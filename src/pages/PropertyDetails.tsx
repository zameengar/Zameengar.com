import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/button';
import { MapPin, Home as HomeIcon, CheckCircle2, Flag, CheckSquare, XSquare, Heart, Edit, Trash, Phone, MessageCircle, X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

export default function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [property, setProperty] = useState<any>(null);
    const [images, setImages] = useState<any[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [owner, setOwner] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [isFavorite, setIsFavorite] = useState(false);
    const [savingFav, setSavingFav] = useState(false);

    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [sending, setSending] = useState(false);

    const [showReport, setShowReport] = useState(false);
    const [reportReason, setReportReason] = useState('Spam');
    const [reportDesc, setReportDesc] = useState('');
    const [reporting, setReporting] = useState(false);

    useEffect(() => {
        if (id) fetchPropertyData();
    }, [id]);

    const fetchPropertyData = async () => {
        setLoading(true);
        const { data: propData } = await supabase
            .from('properties')
            .select('*, property_features(feature_name)')
            .eq('id', id)
            .single();
        if (propData) {
            setProperty(propData);
            const { data: imgData } = await supabase.from('property_images').select('*').eq('property_id', id).order('sort_order');
            if (imgData) setImages(imgData);
            const { data: ownerData } = await supabase.from('profiles').select('id, full_name, created_at, avatar_url, phone').eq('id', propData.owner_id).single();
            if (ownerData) setOwner(ownerData);

            if (profile) {
                const { data: favData } = await supabase.from('favorites').select('id').eq('property_id', id).eq('user_id', profile.id).single();
                if (favData) setIsFavorite(true);
            }
        }
        setLoading(false);
    };

    const toggleFavorite = async () => {
        if (!profile) {
            alert('Please log in to save properties.');
            navigate('/login');
            return;
        }
        setSavingFav(true);
        if (isFavorite) {
            await supabase.from('favorites').delete().eq('property_id', id).eq('user_id', profile.id);
            setIsFavorite(false);
        } else {
            await supabase.from('favorites').insert({ property_id: id, user_id: profile.id });
            setIsFavorite(true);
        }
        setSavingFav(false);
    };

    const handleAdminDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this property?')) return;
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (!error) {
            alert('Property deleted.');
            navigate('/admin/properties');
        } else {
            alert('Error deleting: ' + error.message);
        }
    };

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) {
            alert('Please log in to contact the owner.');
            navigate('/login');
            return;
        }
        if (!property) return;
        if (profile.id === property.owner_id) {
            alert('You cannot inquire about your own property.');
            return;
        }

        setSending(true);
        const { error } = await supabase.from('inquiries').insert({
            property_id: property.id,
            sender_id: profile.id,
            receiver_id: property.owner_id,
            name: formName || profile.full_name,
            email: profile.email,
            phone: formPhone,
            message: formMessage
        });

        setSending(false);
        if (error) {
            alert("Error sending inquiry: " + error.message);
        } else {
            alert("Inquiry sent successfully!");
            setFormMessage('');
        }
    };

    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) {
            alert('Please log in to report this property.');
            navigate('/login');
            return;
        }

        setReporting(true);
        const { error } = await supabase.from('property_reports').insert({
            property_id: property.id,
            reported_by: profile.id,
            reason: reportReason,
            description: reportDesc,
            status: 'reviewing'
        });

        setReporting(false);
        if (error) {
            alert('Error submitting report: ' + error.message);
        } else {
            alert('Property reported successfully. The admin will review it.');
            setShowReport(false);
        }
    };

    const handleAdminApprove = async () => {
        const { error } = await supabase.from('properties').update({ status: 'approved' }).eq('id', property.id);
        if (!error) {
            alert('Property approved successfully.');
            fetchPropertyData();
        } else {
            alert('Error: ' + error.message);
        }
    };

    const handleAdminReject = async () => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        const { error } = await supabase.from('properties').update({ status: 'rejected', rejection_reason: reason }).eq('id', property.id);
        if (!error) {
            alert('Property rejected successfully.');
            fetchPropertyData();
        } else {
            alert('Error: ' + error.message);
        }
    };

    if (loading) return <div><Header /><div className="p-10 text-center">Loading property details...</div></div>;
    if (!property) return <div><Header /><div className="p-10 text-center">Property not found.</div></div>;

    const primaryImage = images.length > 0 ? images[0].image_url : null;
    const secondaryImages = images.length > 1 ? images.slice(1, 3) : [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title={property.title || 'Property Details'}
                description={property.description ? property.description.substring(0, 150) + "..." : "View this amazing property for sale/rent on Zameengar."}
                url={`https://zameengar.com/properties/${property.id}`}
                image={primaryImage || undefined}
            />
            <Header />

            <main className="max-w-7xl mx-auto px-4 w-full py-8">
                {profile?.role === 'admin' && property.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 flex justify-between items-center shadow-sm">
                        <div>
                            <h3 className="font-bold text-yellow-800">Admin Action Required</h3>
                            <p className="text-yellow-700 text-sm">This property is pending approval via the admin dashboard.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleAdminApprove} className="bg-green-600 hover:bg-green-700 text-white"><CheckSquare className="w-4 h-4 mr-2" /> Approve</Button>
                            <Button onClick={handleAdminReject} className="bg-red-600 hover:bg-red-700 text-white"><XSquare className="w-4 h-4 mr-2" /> Reject</Button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                            <p className="flex items-center text-gray-600 gap-1"><MapPin className="w-4 h-4" /> {property.city}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right flex flex-col items-end">
                            <div className="text-3xl font-bold text-green-700 mb-2">PKR {property.price.toLocaleString()}</div>
                            <div className="flex flex-wrap gap-2 justify-end mb-4">
                                <span className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700 font-medium h-fit">{property.purpose}</span>
                                <Button
                                    onClick={toggleFavorite}
                                    disabled={savingFav}
                                    variant="outline"
                                    className={`h-fit py-1 px-3 flex items-center gap-2 ${isFavorite ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'text-gray-600 hover:text-red-500 hover:border-red-500'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                    {isFavorite ? 'Saved' : 'Save Property'}
                                </Button>
                            </div>

                            <div className="flex gap-4 items-center justify-end">
                                <button onClick={() => setShowReport(true)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-800 transition">
                                    <Flag className="w-4 h-4" /> Report
                                </button>

                                {profile?.role === 'admin' && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <Link to={`/admin/properties/edit/${property.id}`} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition">
                                            <Edit className="w-4 h-4" /> Edit Layout
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={handleAdminDelete} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition">
                                            <Trash className="w-4 h-4" /> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-8">
                        <div
                            className="md:col-span-2 h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-95 transition"
                            onClick={() => setSelectedImageIndex(0)}
                        >
                            {primaryImage ? (
                                <img src={primaryImage} alt={`${property.title} - Main Image`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            {property.status !== 'approved' && (
                                <div className="absolute top-4 left-4 bg-yellow-500/90 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                                    Status: {property.status.toUpperCase()}
                                </div>
                            )}
                            {images.length > 0 && (
                                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium backdrop-blur-sm">
                                    <ImageIcon className="w-5 h-5" />
                                    1 / {images.length}
                                </div>
                            )}
                        </div>

                        {secondaryImages.length > 0 ? (
                            <div className="hidden md:flex flex-col gap-4">
                                {secondaryImages.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i + 1)}
                                        className="flex-1 bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-95 transition group"
                                    >
                                        <img src={img.image_url} alt={`${property.title} - Image ${i + 2}`} className="w-full h-full object-cover" />
                                        {(i === 1 && images.length > 3) && (
                                            <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition flex items-center justify-center text-white font-bold text-lg">
                                                +{images.length - 3} Photos
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="hidden md:flex flex-col gap-4">
                                <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                                <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                            </div>
                        )}

                        {/* Mobile Grid for Secondary Images */}
                        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 snap-x">
                            {images.slice(1).map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImageIndex(i + 1)}
                                    className="w-32 min-w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0 snap-start cursor-pointer"
                                >
                                    <img src={img.image_url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Type</div>
                                        <div className="font-semibold text-gray-900 flex items-center gap-1"><HomeIcon className="w-4 h-4" /> {property.property_type}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Area</div>
                                        <div className="font-semibold text-gray-900">{property.area_value} {property.area_unit}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Baths</div>
                                        <div className="font-semibold text-gray-900">{property.bathrooms || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Beds</div>
                                        <div className="font-semibold text-gray-900">{property.bedrooms || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Floors</div>
                                        <div className="font-semibold text-gray-900">{property.floors || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Year Built</div>
                                        <div className="font-semibold text-gray-900">{property.year_built || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Parking</div>
                                        <div className="font-semibold text-gray-900">{property.parking_spaces || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Furnished</div>
                                        <div className="font-semibold text-gray-900">{property.furnished ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>
                            </section>

                            {(property.address || property.society || property.block) && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-4">Location Details</h2>
                                    <div className="bg-white border rounded-lg p-4">
                                        <ul className="space-y-3">
                                            {property.society && (
                                                <li className="flex border-b pb-2">
                                                    <span className="w-1/3 text-gray-500 font-medium">Society</span>
                                                    <span className="w-2/3 text-gray-900 font-semibold">{property.society}</span>
                                                </li>
                                            )}
                                            {property.block && (
                                                <li className="flex border-b pb-2">
                                                    <span className="w-1/3 text-gray-500 font-medium">Block / Sector</span>
                                                    <span className="w-2/3 text-gray-900 font-semibold">{property.block}</span>
                                                </li>
                                            )}
                                            {property.address && (
                                                <li className="flex">
                                                    <span className="w-1/3 text-gray-500 font-medium">Full Address</span>
                                                    <span className="w-2/3 text-gray-900 font-semibold">{property.address}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </section>
                            )}

                            <section>
                                <h2 className="text-2xl font-bold mb-4">Description</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {property.description || "No description provided by the owner."}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">Features</h2>
                                {property.property_features?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {property.property_features.map((f: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                {f.feature_name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No features listed for this property.</div>
                                )}
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-4">
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Contact the Owner</h3>
                                {owner && (
                                    <>
                                        <Link to={`/users/${owner.id}`} className="block hover:bg-gray-50 rounded-lg transition p-2 -mx-2">
                                            <div className="flex gap-4 items-center mb-4">
                                                <div className="w-12 h-12 bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl rounded-full overflow-hidden">
                                                    {owner.avatar_url ? <img src={owner.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : owner.full_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 group-hover:text-green-700 transition">{owner.full_name || 'User'}</div>
                                                    <div className="text-sm text-gray-500">Member since {new Date(owner.created_at).getFullYear()}</div>
                                                </div>
                                            </div>
                                        </Link>
                                        {owner.phone && (
                                            <div className="flex gap-2 mb-4">
                                                <a href={"tel:" + owner.phone} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm">
                                                    <Phone className="w-4 h-4" /> Call
                                                </a>
                                                <a href={"https://wa.me/" + owner.phone.replace(/[^0-9]/g, '') + "?text=" + encodeURIComponent("Hi, I am interested in your property: " + property.title)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm">
                                                    <MessageCircle className="w-4 h-4" /> WhatsApp
                                                </a>
                                            </div>
                                        )}
                                    </>
                                )}
                                {profile?.id !== property.owner_id ? (
                                    <form className="space-y-4" onSubmit={handleInquirySubmit}>
                                        <input value={formName} onChange={e => setFormName(e.target.value)} type="text" placeholder="Your Name" className="w-full border outline-none focus:ring-2 focus:ring-green-500 rounded p-2 text-sm" required />
                                        <input value={formPhone} onChange={e => setFormPhone(e.target.value)} type="text" placeholder="Your Phone Number" className="w-full outline-none focus:ring-2 focus:ring-green-500 border rounded p-2 text-sm" required />
                                        <textarea value={formMessage} onChange={e => setFormMessage(e.target.value)} placeholder="I am interested in this property..." rows={4} className="w-full outline-none focus:ring-2 focus:ring-green-500 border rounded p-2 text-sm" required></textarea>
                                        <Button type="submit" disabled={sending} className="w-full bg-green-700 hover:bg-green-800">
                                            {sending ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="bg-green-50 p-4 rounded text-green-800 text-sm text-center border border-green-200">
                                        <p className="font-bold mb-1">This is your property</p>
                                        <p>Buyers will see a contact form here to send you inquiries directly to your dashboard.</p>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Report Modal */}
                {showReport && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Report Property</h3>
                            <form onSubmit={handleReportSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                    <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="w-full border rounded p-2 text-sm outline-none focus:ring-green-500 bg-white">
                                        <option>Spam</option>
                                        <option>Fake / Scam</option>
                                        <option>Inappropriate Content</option>
                                        <option>Property already sold</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} rows={3} className="w-full border rounded p-2 text-sm outline-none focus:ring-green-500" placeholder="Provide more details..."></textarea>
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <Button type="button" variant="outline" onClick={() => setShowReport(false)}>Cancel</Button>
                                    <Button type="submit" disabled={reporting} className="bg-red-600 hover:bg-red-700 text-white">
                                        {reporting ? 'Submitting...' : 'Submit Report'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            {/* Lightbox Modal */}
            {selectedImageIndex !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
                    <button
                        className="absolute top-6 right-6 text-gray-300 hover:text-white bg-black/30 hover:bg-white/20 rounded-full p-2 transition z-50"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {images.length > 1 && (
                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-white/30 rounded-full p-3 transition z-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex(prev => prev === null || prev === 0 ? images.length - 1 : prev - 1);
                            }}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}

                    <div className="w-full max-w-6xl max-h-[85vh] px-4 md:px-24 flex items-center justify-center" onClick={() => setSelectedImageIndex(null)}>
                        <img
                            src={images[selectedImageIndex].image_url}
                            alt="Property Gallery Image"
                            className="max-w-full max-h-[85vh] object-contain select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {images.length > 1 && (
                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-white/30 rounded-full p-3 transition z-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex(prev => prev === null || prev === images.length - 1 ? 0 : prev + 1);
                            }}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    )}

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium bg-black/50 px-4 py-2 rounded-full">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
}
