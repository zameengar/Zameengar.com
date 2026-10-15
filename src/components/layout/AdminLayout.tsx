import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, LayoutDashboard, Building2, Clock, Users, MapPin, Flag, Settings, LogOut, ExternalLink } from 'lucide-react';

export const AdminLayout = () => {
    const { session, profile, signOut, isLoading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading admin panel...</div>;
    if (!session) return <Navigate to="/admin/login" replace />;
    if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />;

    const navLinks = [
        { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'All Properties', to: '/admin/properties', icon: Building2, exact: true },
        { label: 'Pending Approval', to: '/admin/properties/pending', icon: Clock },
        { label: 'Users', to: '/admin/users', icon: Users },
        { label: 'Locations', to: '/admin/locations', icon: MapPin },
        { label: 'Reports', to: '/admin/reports', icon: Flag },
        { label: 'Settings', to: '/admin/settings', icon: Settings },
    ];

    const isActive = (to: string, exact?: boolean) => {
        if (exact) return location.pathname === to;
        return location.pathname.startsWith(to);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">Admin Panel</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-300 hover:text-white focus:outline-none"
                    aria-label="Toggle admin menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-4 space-y-1.5 shadow-xl sticky top-[57px] z-30">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white font-medium"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        View Live Site
                    </Link>
                    <div className="border-t border-gray-800 my-2" />
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.to, link.exact);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-green-600 text-white font-semibold'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="border-t border-gray-800 my-2" />
                    <button
                        onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 font-medium transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen hidden md:flex flex-col p-4 shrink-0">
                <div className="mb-8 px-2">
                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                    <Link to="/" className="text-xs text-gray-400 hover:text-green-400 flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> View Live Site
                    </Link>
                </div>
                <nav className="flex-1 space-y-1.5">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.to, link.exact);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-green-600 text-white font-semibold'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-4 h-4 text-red-400" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

