import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Terms and Conditions"
                description="Read the Zameengar Terms and Conditions to understand the rules and regulations for using our platform."
                url="https://zameengar.com/terms"
            />
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms and Conditions</h1>
                <p className="text-gray-500 mb-8">Last updated: September 2026</p>

                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10 space-y-6 text-gray-700 leading-relaxed text-sm">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using Zameengar.com ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Platform. These terms apply to all visitors, users, sellers, buyers, and anyone who accesses or uses the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">2. User Accounts</h2>
                        <p>To access certain features of the Platform, you must register for an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to keep your profile updated.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Property Listings</h2>
                        <p>Users may list properties for sale or rent on the Platform free of charge. All listings are subject to review and approval by our admin team. We reserve the right to remove, reject, or modify any listing that violates our policies, contains misleading information, or is deemed inappropriate. Listings must represent real, available properties and include accurate details about the property's location, price, and features.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Prohibited Activities</h2>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Posting fraudulent, fake, or misleading property listings</li>
                            <li>Uploading offensive, illegal, or inappropriate content</li>
                            <li>Attempting to deceive other users or engage in scams</li>
                            <li>Using automated tools to scrape, copy, or download content</li>
                            <li>Interfering with the Platform's functionality or security</li>
                            <li>Impersonating another person or entity</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">5. Intellectual Property</h2>
                        <p>All content on the Platform, including but not limited to text, graphics, logos, icons, images, and software, is the property of Zameengar and is protected by copyright and intellectual property laws. Users retain ownership of the content they upload but grant Zameengar a non-exclusive, royalty-free license to use, display, and distribute such content on the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">6. Disclaimer of Warranties</h2>
                        <p>The Platform is provided on an "as is" and "as available" basis. Zameengar does not guarantee the accuracy, completeness, or reliability of any property listing or user-generated content. We are not a party to any transaction between users and do not verify the legal ownership of listed properties. Users are advised to conduct their own due diligence before entering into any real estate transaction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">7. Limitation of Liability</h2>
                        <p>To the fullest extent permitted by law, Zameengar and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to the use of the Platform, including but not limited to financial loss, property damage, or personal injury resulting from transactions conducted through the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">8. Account Termination</h2>
                        <p>We reserve the right to suspend or terminate your account at any time, with or without notice, if we believe you have violated these Terms and Conditions or engaged in activities harmful to other users or the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">9. Changes to Terms</h2>
                        <p>We may update these Terms and Conditions from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Platform after changes are posted constitutes acceptance of the modified terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">10. Contact</h2>
                        <p>If you have any questions about these Terms and Conditions, please <Link to="/contact" className="text-green-700 hover:underline">contact us here</Link>.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
