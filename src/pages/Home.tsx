import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import SEO from '../components/SEO';

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('');
    const [purpose, setPurpose] = useState('Sale');
    const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
    const [stats, setStats] = useState({ properties: 0, cities: 0 });
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        fetchFeatured();
        fetchStats();
        fetchCities();
    }, []);

    const fetchCities = async () => {
        const { data } = await supabase.from('locations').select('city').eq('is_active', true).order('city');
        if (data) {
            setCities(data.map((loc: any) => loc.city));
        }
    };

    const fetchFeatured = async () => {
        const { data } = await supabase
            .from('properties')
            .select('*, property_images(image_url, is_primary)')
            .eq('status', 'approved')
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(6);
        if (data) setFeaturedProperties(data);
    };

    const fetchStats = async () => {
        const [propRes] = await Promise.all([
            supabase.from('properties').select('city', { count: 'exact' }).eq('status', 'approved'),
        ]);
        const cities = new Set(propRes.data?.map((p: any) => p.city)).size;
        setStats({ properties: propRes.count || 0, cities });
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('city', searchQuery);
        if (searchType) params.set('type', searchType);
        if (purpose) params.set('purpose', purpose);
        navigate(`/properties?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Home"
                description="Zameengar is Pakistan's trusted real estate marketplace to buy, rent, and sell properties. Discover houses, apartments, and commercial spaces."
                url="https://zameengar.com/"
            />
            <Header />

            {/* Hero Section */}
            <section className="relative h-[560px] bg-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                <div className="relative z-10 w-full max-w-4xl px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">
                        Find Your Perfect Property
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Pakistan's trusted real estate marketplace to buy, rent, and sell properties.
                    </p>

                    {/* Search Box */}
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by city (e.g. Lahore)"
                                className="w-full md:w-1/3 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <select
                                value={purpose}
                                onChange={e => setPurpose(e.target.value)}
                                className="w-full md:w-1/4 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option value="Sale">Buy</option>
                                <option value="Rent">Rent</option>
                            </select>
                            <select
                                value={searchType}
                                onChange={e => setSearchType(e.target.value)}
                                className="p-3 border rounded-lg bg-transparent flex-1 focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option value="">All Types</option>
                                <option>House</option>
                                <option>Apartment</option>
                                <option>Plot</option>
                                <option>Commercial</option>
                                <option>Farmhouse</option>
                            </select>
                            <Button onClick={handleSearch} className="bg-green-700 hover:bg-green-800 p-6 px-8 rounded-lg text-lg w-full md:w-auto flex gap-2">
                                <Search className="w-5 h-5" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-green-700 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 text-center">
                    <div>
                        <div className="text-3xl font-bold">{stats.properties}+</div>
                        <div className="text-green-200 text-sm mt-1">Active Listings</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">{stats.cities}+</div>
                        <div className="text-green-200 text-sm mt-1">Cities Covered</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">100%</div>
                        <div className="text-green-200 text-sm mt-1">Verified Properties</div>
                    </div>
                </div>
            </section>

            {/* Popular Cities */}
            <section className="py-16 px-4 max-w-7xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by City</h2>
                <p className="text-gray-600 mb-8">Discover properties in Pakistan's top cities.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {cities.map((city) => (
                        <Link to={`/properties?city=${city}`} key={city} className="group relative rounded-xl overflow-hidden shadow h-48 block cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-slate-700 opacity-90 group-hover:opacity-100 transition"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-2xl tracking-wide">{city}</span>
                                <span className="text-green-300 text-sm mt-1 group-hover:underline">View Properties →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest Listings */}
            {featuredProperties.length > 0 && (
                <section className="py-6 px-4 max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Latest Listings</h2>
                            <p className="text-gray-600">Freshly approved and ready to explore.</p>
                        </div>
                        <Link to="/properties" className="text-green-700 font-semibold hover:underline">View All →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProperties.map((item) => {
                            const img = item.property_images?.find((i: any) => i.is_primary)?.image_url || item.property_images?.[0]?.image_url;
                            return (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group flex flex-col hover:shadow-md transition">
                                    <div className="h-52 bg-gray-200 relative overflow-hidden">
                                        {img ? <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
                                        <div className="absolute top-3 left-3 bg-green-700/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">For {item.purpose}</div>
                                        {item.is_featured && (
                                            <div className="absolute top-3 left-24 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                Featured
                                            </div>
                                        )}
                                        {item.is_verified && (
                                            <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="text-xl font-bold text-green-700 mb-1">PKR {item.price?.toLocaleString()}</div>
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                                        <div className="text-sm text-gray-500 mb-3 flex-1">{item.city}</div>
                                        <Link to={`/properties/${item.id}`}>
                                            <Button className="w-full bg-gray-50 text-gray-900 border hover:bg-green-50 hover:text-green-700">View Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-green-50 py-16 px-4 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-green-900 mb-4">Want to sell or rent out your property?</h2>
                    <p className="text-green-700 mb-8 text-lg">Reach thousands of potential buyers and tenants on Zameengar.</p>
                    <Link to="/dashboard/add-property">
                        <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition">
                            Post Your Property For Free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
