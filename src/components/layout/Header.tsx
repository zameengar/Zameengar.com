import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BuildingIcon, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export const Header = () => {
    const { session, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <BuildingIcon className="w-8 h-8 text-green-700" />
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-green-700">Zameengar</Link>
                    </div>
                    <nav className="hidden md:flex gap-6 items-center flex-1 ml-10">
                        <Link to="/properties?purpose=buy" className="text-gray-700 font-medium hover:text-green-700 transition">Buy</Link>
                        <Link to="/properties?purpose=rent" className="text-gray-700 font-medium hover:text-green-700 transition">Rent</Link>
                        <Link to="/properties" className="text-gray-700 font-medium hover:text-green-700 transition">Properties</Link>
                        <Link to="/blog" className="text-gray-700 font-medium hover:text-green-700 transition">Blog</Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/dashboard/add-property">
                            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">Post Property</Button>
                        </Link>
                        {!session ? (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-green-700 font-medium">Login</Link>
                                <Link to="/register">
                                    <Button className="bg-green-700 hover:bg-green-800">Sign Up</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-green-700 font-medium">Dashboard</Link>
                                <Button onClick={signOut} variant="ghost" className="text-gray-600 hover:text-red-700">Logout</Button>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-green-700 focus:outline-none">
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-2 shadow-lg absolute w-full left-0">
                    <nav className="flex flex-col px-4 pt-2 pb-4 space-y-3">
                        <Link to="/properties?purpose=buy" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-green-700 transition px-2 py-1">Buy</Link>
                        <Link to="/properties?purpose=rent" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-green-700 transition px-2 py-1">Rent</Link>
                        <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-green-700 transition px-2 py-1">All Properties</Link>
                        <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-green-700 transition px-2 py-1">Blog</Link>
                        <div className="border-t border-gray-100 my-2 pt-2"></div>
                        <Link to="/dashboard/add-property" onClick={() => setMobileMenuOpen(false)} className="px-2">
                            <Button variant="outline" className="w-full justify-center border-green-600 text-green-700 hover:bg-green-50 mb-2">Post Property</Button>
                        </Link>
                        {!session ? (
                            <div className="flex flex-col gap-2 px-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-700 font-medium text-center py-2 border rounded-md">Login</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-green-700 hover:bg-green-800">Sign Up</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 px-2">
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-green-700 font-medium text-center py-2 border border-gray-200 rounded-md bg-gray-50">Go to Dashboard</Link>
                                <Button onClick={() => { signOut(); setMobileMenuOpen(false); }} variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-100">Logout</Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};
