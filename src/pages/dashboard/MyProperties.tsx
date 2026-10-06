import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Edit, Trash } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export default function MyProperties() {
    const { profile } = useAuth();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            fetchProperties();
        }
    }, [profile]);

    const fetchProperties = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('owner_id', profile?.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('MyProperties fetch error:', error);
        }
        if (!error && data) {
            setProperties(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;

        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) {
            alert('Error deleting property: ' + error.message);
        } else {
            setProperties(prev => prev.filter(p => p.id !== id));
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                <Link to="/dashboard/add-property">
                    <Button className="bg-green-700 hover:bg-green-800">+ Add Property</Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                {properties.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        You have not listed any properties yet.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Title</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Date Added</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((item) => (
                                <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{item.title}</td>
                                    <td className="p-4">PKR {item.price.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <Link to={`/dashboard/properties/edit/${item.id}`}>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 ml-2">
                                            <Trash className="w-4 h-4" />
                                        </Button>
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
