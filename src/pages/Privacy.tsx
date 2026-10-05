import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Privacy Policy"
                description="Read the Zameengar Privacy Policy to understand how we collect, use, and protect your data."
                url="https://zameengar.com/privacy"
            />
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: September 2026</p>

                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10 space-y-6 text-gray-700 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
                        <p>When you register on Zameengar.com, we collect personal information including your full name, email address, phone number, and profile picture. When you list a property, we collect property details, images, and location information. We also automatically collect usage data such as IP addresses, browser type, and pages visited.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>To create and manage your user account</li>
                            <li>To display your property listings to potential buyers and renters</li>
                            <li>To enable communication between property owners and interested parties</li>
                            <li>To improve the Platform's functionality and user experience</li>
                            <li>To send important account notifications and service updates</li>
                            <li>To detect and prevent fraud, abuse, and security threats</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Information Sharing</h2>
                        <p>Your name, phone number, and property details are displayed publicly on your listings to facilitate contact with potential buyers. We do not sell, trade, or rent your personal information to third parties. We may share your information with law enforcement if required by law or to protect our rights and the safety of our users.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Data Storage and Security</h2>
                        <p>Your data is securely stored using industry-standard encryption and hosted on Supabase infrastructure with row-level security policies. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">5. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to maintain your login session, remember your preferences, and analyze Platform usage patterns. You may disable cookies through your browser settings, but this may limit your ability to use certain features of the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">6. Your Rights</h2>
                        <p>You have the right to access, update, or delete your personal information at any time through your dashboard settings. You may request the deletion of your account by contacting our support team. Upon account deletion, your listings and personal data will be permanently removed from the Platform within 30 days.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">7. Third-Party Services</h2>
                        <p>The Platform may contain links to third-party websites and services, such as WhatsApp for direct communication. We are not responsible for the privacy practices or content of these external services. We encourage you to review the privacy policies of any third-party service you interact with through our Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">8. Children's Privacy</h2>
                        <p>Our Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a user under the age of 18 has provided us with personal information, we will take steps to delete such information promptly.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Your continued use of the Platform after any changes constitutes your acceptance of the updated policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">10. Contact Us</h2>
                        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please <Link to="/contact" className="text-green-700 hover:underline">contact us here</Link>.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
