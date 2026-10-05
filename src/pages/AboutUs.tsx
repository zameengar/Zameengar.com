import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

import SEO from '../components/SEO';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="About Us"
                description="Learn about Zameengar, Pakistan's trusted real estate marketplace connecting buyers and sellers."
                url="https://zameengar.com/about"
            />
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">About Zameengar</h1>

                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10 space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                        <strong className="text-green-700">Zameengar</strong> is Pakistan's trusted real estate marketplace, designed to connect property buyers, sellers, and renters in a seamless, transparent, and efficient way. We believe finding your dream home or investment property should be effortless and accessible to everyone.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 pt-4">Our Mission</h2>
                    <p>
                        Our mission is to revolutionize the Pakistani real estate market by providing a modern digital platform where individuals can list, search, and discover properties across every major city with confidence and ease. We aim to eliminate the information asymmetry that has long plagued real estate transactions in Pakistan.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 pt-4">What We Offer</h2>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li><strong>Comprehensive Listings:</strong> Browse thousands of properties for sale and rent across Lahore, Karachi, Islamabad, Rawalpindi, and other major cities.</li>
                        <li><strong>Advanced Search:</strong> Filter by location, property type, price range, area size, bedrooms, and more to find exactly what you need.</li>
                        <li><strong>Direct Contact:</strong> Connect directly with property owners via phone or WhatsApp — no middlemen, no hidden charges.</li>
                        <li><strong>Free Listings:</strong> Property owners can list their properties completely free of charge with up to 10 high-quality images.</li>
                        <li><strong>Verified Profiles:</strong> Every listing is reviewed by our admin team to ensure quality and authenticity.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 pt-4">Our Vision</h2>
                    <p>
                        We envision a future where every Pakistani has access to reliable, transparent, and easy-to-use tools for all their property needs — whether buying their first home, renting a commercial space, or investing in real estate for the future. Zameengar is here to make that vision a reality.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 pt-4">Why Choose Zameengar?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">🏠</div>
                            <div className="font-bold text-gray-900">Trusted Platform</div>
                            <p className="text-sm text-gray-600 mt-1">Admin-verified property listings you can trust.</p>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">100% Free</div>
                            <p className="text-sm text-gray-600 mt-1">No hidden fees for listing or searching properties.</p>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                            <div className="text-3xl mb-2">📱</div>
                            <div className="font-bold text-gray-900">Modern & Easy</div>
                            <p className="text-sm text-gray-600 mt-1">Beautiful interface optimized for all devices.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
