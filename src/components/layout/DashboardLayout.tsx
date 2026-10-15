import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Home, Building2, PlusCircle, Heart, MessageSquare, LogOut, ExternalLink } from 'lucide-react';

export const DashboardLayout = () => {
    const { session, profile, signOut, isLoading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (profile?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    const navLinks = [
        { label: 'Overview', to: '/dashboard', icon: Home, exact: true },
        { label: 'My Properties', to: '/dashboard/properties', icon: Building2 },
        { label: 'Add Property', to: '/dashboard/add-property', icon: PlusCircle },
        { label: 'Saved Properties', to: '/dashboard/favorites', icon: Heart },
        { label: 'Inquiries', to: '/dashboard/inquiries', icon: MessageSquare },
    ];

    const isActive = (to: string, exact?: boolean) => {
        if (exact) return location.pathname === to;
        return location.pathname.startsWith(to);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
            {/* Mobile Header Bar */}
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <Link to="/" className="text-xl font-bold text-green-700">Zameengar</Link>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-700 hover:text-green-700 focus:outline-none"
                    aria-label="Toggle navigation menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Slide-out / Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-2 shadow-lg sticky top-[57px] z-30">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        Back to Marketplace
                    </Link>
                    <div className="border-t border-gray-100 my-2" />
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
                                        ? 'bg-green-50 text-green-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-400'}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="border-t border-gray-100 my-2" />
                    <button
                        onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex border-gray-200 min-h-screen flex-col p-4 shrink-0">
                <Link to="/" className="text-2xl font-bold text-green-700 mb-8 px-2">Zameengar</Link>
                <nav className="flex-1 space-y-1.5">
                    <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                        <ExternalLink className="w-4 h-4 text-gray-400" /> Back to Home
                    </Link>
                    <Link to="/properties" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                        <Building2 className="w-4 h-4 text-gray-400" /> Search Properties
                    </Link>
                    <div className="my-3 border-b border-gray-200" />
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.to, link.exact);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-green-50 text-green-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-400'}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

