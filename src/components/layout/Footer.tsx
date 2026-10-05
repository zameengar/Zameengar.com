import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">Zameengar</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">Pakistan's trusted real estate marketplace. Find your dream property or list yours for free.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
                            <li><Link to="/properties" className="hover:text-green-400 transition">Properties</Link></li>
                            <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-green-400 transition">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/advertise" className="hover:text-green-400 transition">Advertise with Us</Link></li>
                            <li><Link to="/terms" className="hover:text-green-400 transition">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/contact" className="hover:text-green-400 transition">Contact Support</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Zameengar. All rights reserved.</p>
                    <div className="flex gap-4 mt-3 md:mt-0">
                        <Link to="/terms" className="hover:text-gray-300 transition">Terms</Link>
                        <Link to="/privacy" className="hover:text-gray-300 transition">Privacy</Link>
                        <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
