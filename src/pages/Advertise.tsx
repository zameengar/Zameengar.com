import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';

export default function Advertise() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Advertise"
                description="Advertise your real estate agency or project with Zameengar and reach thousands of buyers across Pakistan."
                url="https://zameengar.com/advertise"
            />
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Advertise with Us</h1>
                <p className="text-lg text-gray-600 mb-8">Reach thousands of active property buyers, sellers, and investors across Pakistan.</p>

                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Advertise on Zameengar?</h2>
                        <p>Zameengar is one of Pakistan's fastest-growing real estate platforms with thousands of monthly visitors actively looking to buy, sell, or rent properties. Our audience is highly targeted — every visitor is a potential customer for your real estate business.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-xl p-6 text-center hover:shadow-md transition">
                                <div className="text-3xl mb-2">🏅</div>
                                <h3 className="font-bold text-gray-900 mb-2">Featured Listings</h3>
                                <p className="text-sm text-gray-600 mb-3">Get your property prominently displayed at the top of search results and the homepage.</p>
                                <div className="text-2xl font-bold text-green-700">PKR 5,000<span className="text-sm font-normal text-gray-500">/month</span></div>
                            </div>
                            <div className="border rounded-xl p-6 text-center hover:shadow-md transition bg-green-50 border-green-200">
                                <div className="text-3xl mb-2">🌟</div>
                                <h3 className="font-bold text-gray-900 mb-2">Premium Banner Ads</h3>
                                <p className="text-sm text-gray-600 mb-3">Place your agency or project banner across high-traffic pages with maximum visibility.</p>
                                <div className="text-2xl font-bold text-green-700">PKR 15,000<span className="text-sm font-normal text-gray-500">/month</span></div>
                            </div>
                            <div className="border rounded-xl p-6 text-center hover:shadow-md transition">
                                <div className="text-3xl mb-2">🏢</div>
                                <h3 className="font-bold text-gray-900 mb-2">Agency Partnership</h3>
                                <p className="text-sm text-gray-600 mb-3">Become a verified agency partner with a dedicated profile, badge, and priority support.</p>
                                <div className="text-2xl font-bold text-green-700">PKR 25,000<span className="text-sm font-normal text-gray-500">/month</span></div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Who Should Advertise?</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Real estate agencies and developers</li>
                            <li>Housing societies and builders</li>
                            <li>Home financing and mortgage providers</li>
                            <li>Interior designers and construction companies</li>
                            <li>Any business targeting property buyers and investors</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-6 text-center border">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
                        <p className="text-gray-600 mb-4">Contact our advertising team for a custom quote tailored to your needs.</p>
                        <Link to="/contact">
                            <Button className="bg-green-700 hover:bg-green-800 px-8">Contact Our Team</Button>
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
