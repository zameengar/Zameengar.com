import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ban, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalLimit, setGlobalLimit] = useState(5);

    useEffect(() => {
        fetchUsers();
        fetchGlobalLimit();
    }, []);

    const fetchGlobalLimit = async () => {
        const { data } = await supabase.from('platform_settings').select('value').eq('key', 'property_listing_limit').single();
        if (data && data.value) setGlobalLimit(parseInt(data.value));
    };

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setUsers(data);
        setLoading(false);
    };

    const toggleSuspend = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id);
        if (!error) fetchUsers();
        else alert('Error updating user: ' + error.message);
    };

    const setLimit = async (id: string) => {
        const amt = prompt('Enter a new property limit for this user (or leave empty to reset to global default):');
        let override = null;
        if (amt && !isNaN(parseInt(amt))) {
            override = parseInt(amt);
        }
        const { error } = await supabase.from('profiles').update({ property_limit_override: override }).eq('id', id);
        if (!error) fetchUsers();
        else alert('Error updating limit: ' + error.message);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No users found.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-900 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Account Type</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Joined</th>
                                <th className="p-4 font-semibold">Limit Override</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{user.full_name || '(No Name)'}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium capitalize text-gray-600">
                                        {user.account_type || 'User'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-green-700">{user.property_limit_override !== null ? user.property_limit_override : `${globalLimit} (Default)`}</td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <Button variant="outline" size="sm" onClick={() => setLimit(user.id)} className="mr-2 border-gray-300 text-gray-700">Edit Limit</Button>
                                        {user.role !== 'admin' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleSuspend(user.id, user.status)}
                                                className={user.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                                            >
                                                {user.status === 'active' ? (
                                                    <><Ban className="w-4 h-4 mr-1" /> Suspend</>
                                                ) : (
                                                    <><CheckCircle className="w-4 h-4 mr-1" /> Activate</>
                                                )}
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
