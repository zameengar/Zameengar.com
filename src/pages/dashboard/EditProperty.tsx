import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash, Upload } from 'lucide-react';

export default function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [purpose, setPurpose] = useState('Sale');
    const [propertyType, setPropertyType] = useState('House');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');
    const [areaValue, setAreaValue] = useState('');
    const [areaUnit, setAreaUnit] = useState('Marla');
    const [bedrooms, setBedrooms] = useState('0');
    const [bathrooms, setBathrooms] = useState('0');

    // Advanced Editing State
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const COMMON_FEATURES = [
        'Electricity', 'Sui Gas', 'Water Supply', 'Sewerage',
        'Corner', 'Security Staff', 'Broadband Internet',
        'Central Heating', 'Central Air Conditioning', 'Maintenance Staff'
    ];

    useEffect(() => {
        if (!id) return;
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
        if (data) {
            setTitle(data.title);
            setDescription(data.description || '');
            setPurpose(data.purpose);
            setPropertyType(data.property_type);
            setCity(data.city);
            setPrice(data.price.toString());
            setAreaValue(data.area_value.toString());
            setAreaUnit(data.area_unit);
            setBedrooms((data.bedrooms || 0).toString());
            setBathrooms((data.bathrooms || 0).toString());

            // Fetch images
            const { data: imgData } = await supabase.from('property_images').select('*').eq('property_id', id).order('sort_order', { ascending: true });
            if (imgData) setExistingImages(imgData);

            // Fetch features
            const { data: featData } = await supabase.from('property_features').select('*').eq('property_id', id);
            if (featData) setSelectedFeatures(featData.map((f: any) => f.feature_name));
        } else {
            console.error(error);
        }
        setLoading(false);
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const activeExisting = existingImages.length - imagesToDelete.length;
            if (activeExisting + newImages.length + files.length > 10) {
                alert('You can only have a maximum of 10 pictures per property.');
                return;
            }
            setNewImages([...newImages, ...files]);
        }
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim().length < 10) return alert("Title must be at least 10 characters long.");
        if (parseFloat(price) <= 0) return alert("Price must be greater than zero.");
        if (parseFloat(areaValue) <= 0) return alert("Area must be greater than zero.");

        setSaving(true);

        // 1. Update Basic Properties
        const { error } = await supabase.from('properties').update({
            title,
            description,
            price: parseFloat(price),
            purpose,
            property_type: propertyType,
            city,
            area_value: parseFloat(areaValue || '0'),
            area_unit: areaUnit,
            bedrooms: parseInt(bedrooms || '0'),
            bathrooms: parseInt(bathrooms || '0'),
        }).eq('id', id);

        if (error) {
            alert("Error updating property: " + error.message);
            setSaving(false);
            return;
        }

        // 2. Update Features
        await supabase.from('property_features').delete().eq('property_id', id);
        if (selectedFeatures.length > 0) {
            const featureData = selectedFeatures.map(f => ({ property_id: id, feature_name: f }));
            await supabase.from('property_features').insert(featureData);
        }

        // 3. Process Image Deletions
        for (const imgId of imagesToDelete) {
            const img = existingImages.find(i => i.id === imgId);
            if (img) {
                // Try to remove from storage using stored path or extracted path
                try {
                    const storagePath = img.storage_path || img.image_url?.split('/property-images/').pop();
                    if (storagePath) {
                        await supabase.storage.from('property-images').remove([decodeURIComponent(storagePath)]);
                    }
                } catch (e) {
                    console.error("Storage delete fail:", e);
                }
                await supabase.from('property_images').delete().eq('id', imgId);
            }
        }

        // 4. Upload New Images
        let editUploadErrors: string[] = [];
        for (let i = 0; i < newImages.length; i++) {
            const file = newImages[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${id}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) {
                console.error(`Edit image ${i + 1} upload failed:`, uploadError);
                editUploadErrors.push(`Image ${i + 1}: ${uploadError.message}`);
                continue;
            }

            if (uploadData) {
                const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(uploadData.path);
                const { error: insertError } = await supabase.from('property_images').insert({
                    property_id: id,
                    image_url: publicUrl,
                    storage_path: uploadData.path,
                    is_primary: false,
                    sort_order: 99 + i
                });
                if (insertError) {
                    console.error(`Edit image ${i + 1} DB insert failed:`, insertError);
                    editUploadErrors.push(`Image ${i + 1} record: ${insertError.message}`);
                }
            }
        }

        if (editUploadErrors.length > 0) {
            alert('Property updated, but some new images failed:\\n' + editUploadErrors.join('\\n'));
        }

        setSaving(false);
        if (profile?.role === 'admin') {
            navigate('/admin/properties');
        } else {
            navigate('/dashboard/properties');
        }
    };

    if (loading) return <div className="p-8">Loading property details...</div>;

    const visibleExistingImages = existingImages.filter(img => !imagesToDelete.includes(img.id));
    const canUploadMore = (visibleExistingImages.length + newImages.length) < 10;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Property</h1>
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <form className="space-y-8" onSubmit={handleUpdate}>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 border-b pb-2">Basic Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full p-3 border rounded-lg focus:ring-green-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Links (Optional)</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-3 border rounded-lg focus:ring-green-500 outline-none" placeholder="Enter extra details, external links, etc." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
                                    <option>Sale</option>
                                    <option>Rent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
                                    <option>House</option>
                                    <option>Apartment</option>
                                    <option>Plot</option>
                                    <option>Commercial</option>
                                    <option>Farmhouse</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input value={city} onChange={e => setCity(e.target.value)} type="text" className="w-full p-3 border rounded-lg outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                            <input value={price} onChange={e => setPrice(e.target.value)} type="number" required className="w-full p-3 border rounded-lg outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                                <input value={areaValue} onChange={e => setAreaValue(e.target.value)} type="number" required className="w-full p-3 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
                                    <option>Marla</option>
                                    <option>Kanal</option>
                                    <option>Sq. Ft.</option>
                                    <option>Sq. Yd.</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                <input value={bedrooms} onChange={e => setBedrooms(e.target.value)} type="number" className="w-full p-3 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                <input value={bathrooms} onChange={e => setBathrooms(e.target.value)} type="number" className="w-full p-3 border rounded-lg outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 border-b pb-2">Property Features</h3>

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

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 border-b pb-2">Manage Images (Max 10)</h3>

                        {(visibleExistingImages.length > 0 || newImages.length > 0) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {visibleExistingImages.map(img => (
                                    <div key={img.id} className="relative group rounded-lg overflow-hidden border shadow-sm h-32">
                                        <img src={img.image_url} alt="Property" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => setImagesToDelete([...imagesToDelete, img.id])} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {newImages.map((file, idx) => (
                                    <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border shadow-sm h-32">
                                        <img src={URL.createObjectURL(file)} alt="New Upload" className="w-full h-full object-cover brightness-90" />
                                        <div className="absolute top-2 left-2 bg-blue-600 text-xs text-white px-2 py-0.5 rounded">New</div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => setNewImages(newImages.filter((_, i) => i !== idx))} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {canUploadMore && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-green-700 transition">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="font-medium text-sm">Click to upload more {`(Limit: ${10 - visibleExistingImages.length - newImages.length} remaining)`}</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button type="button" onClick={() => navigate(-1)} variant="outline">Cancel</Button>
                        <Button type="submit" disabled={saving} className="bg-green-700 hover:bg-green-800">
                            {saving ? 'Processing...' : 'Save All Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
