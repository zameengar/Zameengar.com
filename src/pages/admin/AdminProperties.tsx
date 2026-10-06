import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckSquare, XSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export default function AdminProperties() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [searchAdId, setSearchAdId] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    useEffect(() => {
        fetchProperties();
    }, [filter, activeSearch]);

    const fetchProperties = async () => {
        setLoading(true);
        let query = supabase
            .from('properties')
            .select(`*, owner:profiles (full_name, email)`)
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        if (activeSearch) {
            query = query.eq('ad_id', activeSearch.trim());
        }

        const { data, error } = await query;
        if (error) {
            console.error('Admin fetch properties error:', error);
            alert('Error fetching properties: ' + error.message);
        }
        if (data) setProperties(data);
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        const { error } = await supabase.from('properties').update({ status: 'approved' }).eq('id', id);
        if (!error) fetchProperties();
        else alert('Error: ' + error.message);
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Enter rejection reason (optional):') || 'Does not meet listing requirements';
        const { error } = await supabase.from('properties').update({ status: 'rejected', rejection_reason: reason }).eq('id', id);
        if (!error) fetchProperties();
        else alert('Error: ' + error.message);
    };

    const toggleFeature = async (id: string, is_featured: boolean) => {
        const { error } = await supabase.from('properties').update({ is_featured }).eq('id', id);
        if (!error) fetchProperties();
        else alert('Error: ' + error.message);
    };

    const toggleVerify = async (id: string, is_verified: boolean) => {
        const { error } = await supabase.from('properties').update({ is_verified }).eq('id', id);
        if (!error) fetchProperties();
        else alert('Error: ' + error.message);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Properties Management</h1>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col xl:flex-row gap-4 mb-6 justify-between xl:items-center">
                <div className="flex gap-2 flex-wrap">
                    {['pending', 'approved', 'rejected', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${filter === f ? 'bg-green-700 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
                        >
                            {f === 'all' ? 'All Properties' : f}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={searchAdId}
                        onChange={e => setSearchAdId(e.target.value)}
                        placeholder="Search Ad ID..."
                        className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                        onKeyDown={e => e.key === 'Enter' && setActiveSearch(searchAdId)}
                    />
                    <Button onClick={() => setActiveSearch(searchAdId)} className="bg-slate-800 text-white hover:bg-slate-900">Search</Button>
                    {activeSearch && <Button onClick={() => { setSearchAdId(''); setActiveSearch(''); }} variant="outline">Clear</Button>}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading properties...</div>
                ) : properties.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No {filter} properties found.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-900 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Ad ID</th>
                                <th className="p-4 font-semibold">Property Title</th>
                                <th className="p-4 font-semibold">Owner</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-900">#{item.ad_id || '-'}</td>
                                    <td className="p-4 font-medium text-gray-900 max-w-[200px] truncate">{item.title}</td>
                                    <td className="p-4">
                                        <div>{item.owner?.full_name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-400">{item.owner?.email}</div>
                                    </td>
                                    <td className="p-4">PKR {item.price?.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <Link to={`/properties/${item.id}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 mr-1">View</Button>
                                        </Link>
                                        {item.status === 'pending' && (
                                            <>
                                                <Button variant="ghost" size="sm" onClick={() => handleApprove(item.id)} className="text-green-600 hover:bg-green-50">
                                                    <CheckSquare className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleReject(item.id)} className="text-red-600 hover:bg-red-50">
                                                    <XSquare className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {item.status === 'approved' && (
                                            <>
                                                <Button variant="ghost" size="sm" onClick={() => toggleFeature(item.id, !item.is_featured)} className="text-yellow-600 hover:bg-yellow-50 mr-1">
                                                    {item.is_featured ? 'Unfeature' : 'Feature'}
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => toggleVerify(item.id, !item.is_verified)} className="text-blue-600 hover:bg-blue-50 mr-1">
                                                    {item.is_verified ? 'Unverify' : 'Verify'}
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleReject(item.id)} className="text-red-600 hover:bg-red-50">
                                                    <XSquare className="w-4 h-4 mr-1" /> Revoke
                                                </Button>
                                            </>
                                        )}
                                        {item.status === 'rejected' && (
                                            <Button variant="ghost" size="sm" onClick={() => handleApprove(item.id)} className="text-green-600 hover:bg-green-50">
                                                <CheckSquare className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
