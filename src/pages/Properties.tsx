import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import SEO from '../components/SEO';

export default function Properties() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters state - initialize from URL params
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [purpose, setPurpose] = useState('All');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'All');
    const [listedBy, setListedBy] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // New Advanced Filters
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        // Read URL changes to sync state when navigating from Home
        const cityParam = searchParams.get('city') || '';
        const typeParam = searchParams.get('type') || 'All';

        if (cityParam !== city || typeParam !== propertyType) {
            setCity(cityParam);
            setPropertyType(typeParam);
        }

        fetchProperties();
    }, [searchParams]);

    const handleApplyFilters = () => {
        // Update URL to match filters without full reload
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (propertyType !== 'All') params.set('type', propertyType);

        setSearchParams(params);
        fetchProperties();
    };

    const fetchProperties = async () => {
        setLoading(true);
        let query = supabase
            .from('properties')
            .select(`
                *,
                property_images(image_url, is_primary)
            `)
            .eq('status', 'approved');

        // Apply filters
        if (purpose !== 'All') query = query.eq('purpose', purpose);
        if (propertyType !== 'All') query = query.eq('property_type', propertyType);
        if (listedBy !== 'All') query = query.eq('listed_by_type', listedBy.toLowerCase());
        if (city) query = query.ilike('city', `%${city}%`);
        if (minPrice) query = query.gte('price', parseFloat(minPrice));
        if (maxPrice) query = query.lte('price', parseFloat(maxPrice));

        if (bedrooms) query = query.gte('bedrooms', parseInt(bedrooms));
        if (bathrooms) query = query.gte('bathrooms', parseInt(bathrooms));
        if (minArea) query = query.gte('area_value', parseFloat(minArea));
        if (maxArea) query = query.lte('area_value', parseFloat(maxArea));

        // Apply sorting
        if (sort === 'newest') query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        else if (sort === 'oldest') query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: true });
        else if (sort === 'price-asc') query = query.order('is_featured', { ascending: false }).order('price', { ascending: true });
        else if (sort === 'price-desc') query = query.order('is_featured', { ascending: false }).order('price', { ascending: false });
        else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false }); // default fallback

        const { data, error } = await query;
        if (!error && data) {
            setProperties(data);
        } else {
            console.error('Error fetching properties', error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Properties"
                description="Browse thousands of properties for sale and rent across Pakistan on Zameengar."
                url="https://zameengar.com/properties"
            />
            <Header />
            <div className="max-w-7xl mx-auto px-4 w-full py-8 flex flex-col md:flex-row gap-6">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-4">
                    <h2 className="font-bold text-xl mb-6 text-gray-800">Filter Search</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">City / Location</label>
                            <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="e.g. Lahore" className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Purpose</label>
                            <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500">
                                <option>All</option>
                                <option>Sale</option>
                                <option>Rent</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Property Type</label>
                            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500">
                                <option>All</option>
                                <option>House</option>
                                <option>Apartment</option>
                                <option>Plot</option>
                                <option>Commercial</option>
                                <option>Farmhouse</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Listed By</label>
                            <select value={listedBy} onChange={e => setListedBy(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500">
                                <option>All</option>
                                <option value="owner">Owner</option>
                                <option value="dealer">Dealer</option>
                                <option value="agency">Agency</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Price Range (PKR)</label>
                            <div className="flex gap-2">
                                <input value={minPrice} onChange={e => setMinPrice(e.target.value)} type="number" placeholder="Min" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                                <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" placeholder="Max" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Min Rooms</label>
                            <div className="flex gap-2">
                                <input value={bedrooms} onChange={e => setBedrooms(e.target.value)} type="number" placeholder="Beds" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                                <input value={bathrooms} onChange={e => setBathrooms(e.target.value)} type="number" placeholder="Baths" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Area Range</label>
                            <div className="flex gap-2">
                                <input value={minArea} onChange={e => setMinArea(e.target.value)} type="number" placeholder="Min" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                                <input value={maxArea} onChange={e => setMaxArea(e.target.value)} type="number" placeholder="Max" className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Sort By</label>
                            <select value={sort} onChange={e => setSort(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                        <Button onClick={handleApplyFilters} className="w-full bg-green-700 hover:bg-green-800 py-6 text-base font-semibold mt-2">
                            Apply Filters
                        </Button>
                    </div>
                </aside>

                {/* Properties Grid */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {properties.length} Properties Found
                        </h1>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            Loading properties...
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
                            No properties match your exact search criteria. Try removing some filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map((item) => {
                                const primaryImage = item.property_images?.find((img: any) => img.is_primary)?.image_url ||
                                    item.property_images?.[0]?.image_url;
                                return (
                                    <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group flex flex-col cursor-pointer transition hover:shadow-md">
                                        <div className="h-56 bg-gray-200 relative overflow-hidden">
                                            {primaryImage ? (
                                                <img src={primaryImage} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-green-700/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                For {item.purpose}
                                            </div>
                                            {item.is_featured && (
                                                <div className="absolute top-3 left-[90px] md:left-24 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                    Featured
                                                </div>
                                            )}
                                            {item.is_verified && (
                                                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="text-xl font-bold text-green-700 mb-1">PKR {item.price.toLocaleString()}</div>
                                            <h3 className="text-gray-900 font-bold mb-2 line-clamp-1">{item.title}</h3>
                                            <div className="text-sm text-gray-500 mb-4 line-clamp-1 flex-1">{item.city}</div>
                                            <div className="flex gap-3 text-sm text-gray-600 border-t pt-3 mb-4">
                                                {item.bedrooms > 0 && <span className="flex items-center gap-1 font-medium">{item.bedrooms} Beds</span>}
                                                {item.bathrooms > 0 && <span className="flex items-center gap-1 font-medium">{item.bathrooms} Baths</span>}
                                                <span className="flex items-center gap-1 font-medium">{item.area_value} {item.area_unit}</span>
                                            </div>
                                            <Link to={`/properties/${item.id}`} className="mt-auto">
                                                <Button className="w-full bg-gray-50 text-gray-900 border hover:bg-green-50 hover:text-green-700 hover:border-green-200">View Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}
