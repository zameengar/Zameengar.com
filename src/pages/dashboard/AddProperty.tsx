import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';

export default function AddProperty() {
    const { profile } = useAuth();
    const [step, setStep] = useState(1);

    // Limits state
    const [listingLimit, setListingLimit] = useState(5);
    const [userListingCount, setUserListingCount] = useState(0);
    const [isCheckingLimit, setIsCheckingLimit] = useState(true);

    // Step 1 Details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [purpose, setPurpose] = useState('Sale');
    const [propertyType, setPropertyType] = useState('House');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState(profile?.phone || '');

    // Step 2 Details
    const [price, setPrice] = useState('');
    const [listedByType, setListedByType] = useState('owner');
    const [areaValue, setAreaValue] = useState('');
    const [areaUnit, setAreaUnit] = useState('Marla');
    const [bedrooms, setBedrooms] = useState('3');
    const [bathrooms, setBathrooms] = useState('3');
    const [images, setImages] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState('');

    // Available Features
    const COMMON_FEATURES = [
        'Electricity', 'Sui Gas', 'Water Supply', 'Sewerage',
        'Corner', 'Security Staff', 'Broadband Internet',
        'Central Heating', 'Central Air Conditioning', 'Maintenance Staff'
    ];

    const [locations, setLocations] = useState<{ city: string }[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const { data } = await supabase.from('locations').select('city').eq('is_active', true).order('city');
            if (data) setLocations(data);
        };

        const checkLimits = async () => {
            if (!profile) return;

            if (profile.account_type) {
                setListedByType(profile.account_type === 'user' ? 'owner' : profile.account_type);
            }

            // Try fetching limit (fallback to 5 if table missing yet)
            const { data: limitData } = await supabase.from('platform_settings').select('value').eq('key', 'property_listing_limit').single();
            const maxLimit = profile.property_limit_override !== null
                ? profile.property_limit_override
                : (limitData ? parseInt(limitData.value) : 5);
            setListingLimit(maxLimit);

            // Fetch user count
            const { count } = await supabase.from('properties').select('id', { count: 'exact', head: true }).eq('owner_id', profile.id);
            setUserListingCount(count || 0);

            setIsCheckingLimit(false);
        };

        fetchLocations();
        checkLimits();
    }, [profile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (images.length + files.length > 10) {
                alert('You can only upload a maximum of 10 pictures per property.');
                return;
            }
            setImages(prev => [...prev, ...files]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    const handleAddCustomFeature = () => {
        const feat = customFeature.trim();
        if (feat && !selectedFeatures.includes(feat)) {
            setSelectedFeatures([...selectedFeatures, feat]);
            setCustomFeature('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        if (parseFloat(price) <= 0) return alert("Price must be greater than zero.");
        if (parseFloat(areaValue) <= 0) return alert("Area must be greater than zero.");
        if (images.length === 0) return alert("Please upload at least one property image.");

        setLoading(true);

        // 1. Insert Property
        const { data: propertyData, error: propertyError } = await supabase.from('properties').insert({
            owner_id: profile.id,
            title,
            description,
            price: parseFloat(price),
            purpose,
            property_type: propertyType,
            listed_by_type: listedByType,
            city,
            area_value: parseFloat(areaValue || '0'),
            area_unit: areaUnit,
            bedrooms: parseInt(bedrooms || '0'),
            bathrooms: parseInt(bathrooms || '0'),
            status: 'pending'
        }).select().single();

        if (propertyError || !propertyData) {
            console.error("Property insert error:", propertyError);
            alert("Error saving property: " + (propertyError?.message || 'Unknown error') + "\n\nHint: " + (propertyError?.hint || propertyError?.details || 'Check Supabase RLS policies and column names.'));
            setLoading(false);
            return;
        }

        // 2. Save phone number to profile
        if (phone) {
            await supabase.from('profiles').update({ phone }).eq('id', profile.id);
        }

        // 3. Insert Features
        if (selectedFeatures.length > 0) {
            const featureData = selectedFeatures.map(f => ({
                property_id: propertyData.id,
                feature_name: f
            }));
            const { error: fErr } = await supabase.from('property_features').insert(featureData);
            if (fErr) console.error("Error inserting features:", fErr);
        }

        // 4. Upload Images
        let uploadErrors: string[] = [];
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${propertyData.id}/${fileName}`;

            setUploadStatus(`Uploading image ${i + 1} of ${images.length}...`);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error(`Image ${i + 1} upload failed:`, uploadError);
                uploadErrors.push(`Image ${i + 1}: ${uploadError.message}`);
                continue;
            }

            if (uploadData) {
                const { data: publicUrlData } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(uploadData.path);

                const { error: insertError } = await supabase.from('property_images').insert({
                    property_id: propertyData.id,
                    image_url: publicUrlData.publicUrl,
                    storage_path: uploadData.path,
                    is_primary: i === 0,
                    sort_order: i
                });

                if (insertError) {
                    console.error(`Image ${i + 1} DB insert failed:`, insertError);
                    uploadErrors.push(`Image ${i + 1} record: ${insertError.message}`);
                }
            }
        }

        setUploadStatus('');
        setLoading(false);

        if (uploadErrors.length > 0) {
            alert('Property saved, but some images failed to upload:\n' + uploadErrors.join('\n') + '\n\nPlease check that the "property-images" storage bucket exists and is set to Public in your Supabase dashboard.');
        }

        setStep(3);
    };

    if (isCheckingLimit) {
        return <div className="p-8 text-center text-gray-500">Checking listing limits...</div>;
    }

    if (userListingCount >= listingLimit) {
        return (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-xl text-center shadow-sm">
                    <h2 className="text-2xl font-bold mb-2">Listing Limit Reached 🛑</h2>
                    <p className="text-lg">You have reached the maximum allowed limit of {listingLimit} active properties.</p>
                    <p className="mt-4 text-sm opacity-80 mb-6">Please contact an administrator if you need to post more properties.</p>
                    <Button onClick={() => window.location.href = '/dashboard/properties'} className="bg-red-700 hover:bg-red-800 text-white px-6">View My Properties</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Property</h1>

            <div className="bg-white p-6 sm:p-8 rounded-xl border shadow-sm">
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex-1 text-center font-semibold ${step >= 1 ? 'text-green-700' : 'text-gray-400'}`}>1. Basic Info</div>
                    <div className="w-10 border-t border-gray-300"></div>
                    <div className={`flex-1 text-center font-semibold ${step >= 2 ? 'text-green-700' : 'text-gray-400'}`}>2. Details & Media</div>
                    <div className="w-10 border-t border-gray-300"></div>
                    <div className={`flex-1 text-center font-semibold ${step >= 3 ? 'text-green-700' : 'text-gray-400'}`}>3. Complete</div>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="e.g. 10 Marla Beautiful House in DHA" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description & Links (Optional)</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="Enter any extra details, links to YouTube videos or websites here..." />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                    <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
                                        <option>Sale</option>
                                        <option>Rent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                    <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
                                        <option>House</option>
                                        <option>Apartment</option>
                                        <option>Plot</option>
                                        <option>Commercial</option>
                                        <option>Farmhouse</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Listed By Type</label>
                                    <select value={listedByType} onChange={e => setListedByType(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white outline-none">
                                        <option value="owner">Owner / Individual</option>
                                        <option value="dealer">Real Estate Dealer</option>
                                        <option value="agency">Real Estate Agency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <select value={city} onChange={e => setCity(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white outline-none">
                                        <option value="" disabled>Select a City</option>
                                        {locations.map((loc, idx) => (
                                            <option key={idx} value={loc.city}>{loc.city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone Number <span className="text-red-500">*</span></label>
                                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 0300-1234567" />
                                    <p className="text-xs text-gray-500 mt-1">This will be saved to your profile for buyer inquiries.</p>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={() => {
                                    if (title.trim().length < 10) return alert("Title must be at least 10 characters long.");
                                    const cleanPhone = phone.replace(/\D/g, '');
                                    if (cleanPhone.length < 10) return alert("Please enter a valid phone number.");
                                    setStep(2);
                                }} disabled={!title || !city || !phone} className="bg-green-700 hover:bg-green-800 px-8 py-6 text-lg">Next Step</Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form className="space-y-6 animate-in slide-in-from-right-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                                <input value={price} onChange={e => setPrice(e.target.value)} type="number" required min="0" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 15000000" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                                    <input value={areaValue} onChange={e => setAreaValue(e.target.value)} type="number" required min="0" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 10" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                    <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
                                        <option>Marla</option>
                                        <option>Kanal</option>
                                        <option>Sq. Ft.</option>
                                        <option>Sq. Yd.</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {(propertyType === 'House' || propertyType === 'Apartment' || propertyType === 'Farmhouse') && (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                    <input value={bedrooms} onChange={e => setBedrooms(e.target.value)} type="number" min="0" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                    <input value={bathrooms} onChange={e => setBathrooms(e.target.value)} type="number" min="0" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Property Features</label>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Common Features</label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_FEATURES.map(feature => (
                                        <button
                                            key={feature}
                                            type="button"
                                            onClick={() => toggleFeature(feature)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedFeatures.includes(feature)
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {selectedFeatures.includes(feature) && '✓ '}
                                            {feature}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Selected Custom Features</label>
                                {selectedFeatures.filter(f => !COMMON_FEATURES.includes(f)).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedFeatures.filter(f => !COMMON_FEATURES.includes(f)).map(feature => (
                                            <button
                                                key={feature}
                                                type="button"
                                                onClick={() => toggleFeature(feature)}
                                                className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors bg-green-100 text-green-800 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group"
                                            >
                                                {feature} <span className="ml-1 opacity-50 group-hover:opacity-100">×</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customFeature}
                                        onChange={e => setCustomFeature(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomFeature())}
                                        placeholder="Add custom feature (e.g. Lawn, Pool)"
                                        className="flex-1 p-2 border rounded-lg focus:ring-green-500 outline-none text-sm"
                                    />
                                    <Button type="button" onClick={handleAddCustomFeature} className="bg-slate-800 hover:bg-slate-900 text-sm py-2">Add Feature</Button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Property Images (Max 10)</label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {images.map((file, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden border shadow-sm h-32 bg-gray-100">
                                            <img src={URL.createObjectURL(file)} alt="Upload preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => removeImage(idx)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {images.length < 10 && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload-new"
                                    />
                                    <label htmlFor="image-upload-new" className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-green-700 transition w-full">
                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        <span className="font-medium text-sm text-center">Click to add images (Limit: {10 - images.length} remaining)</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" onClick={() => setStep(1)} variant="outline" className="px-8 py-6 text-lg w-1/3">Back</Button>
                            <Button type="submit" disabled={loading || !price || !areaValue} className="bg-green-700 hover:bg-green-800 px-8 py-6 text-lg w-2/3">
                                {loading ? (uploadStatus || 'Submitting...') : 'Submit Property'}
                            </Button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-12 animate-in zoom-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold">✓</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Submitted!</h2>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">Your property has been successfully submitted and is currently pending administrator approval. You can view its status in your dashboard.</p>
                        <div className="mt-8">
                            <Button onClick={() => window.location.href = '/dashboard/properties'} className="bg-green-700 hover:bg-green-800 px-8 py-4">View My Properties</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
