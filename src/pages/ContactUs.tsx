import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';

import SEO from '../components/SEO';

export default function ContactUs() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim().length < 15) {
            alert("Please provide a more detailed message (minimum 15 characters).");
            return;
        }
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Contact Us"
                description="Get in touch with the Zameengar support team for any real estate inquiries, feedback, or assistance."
                url="https://zameengar.com/contact"
            />
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Send Us a Message</h2>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                <div className="text-4xl mb-3">✅</div>
                                <h3 className="text-lg font-bold text-green-800 mb-1">Message Sent!</h3>
                                <p className="text-green-700 text-sm">Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit} name="contact" method="POST" data-netlify="true">
                                <input type="hidden" name="form-name" value="contact" />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input value={name} onChange={e => setName(e.target.value)} type="text" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input value={subject} onChange={e => setSubject(e.target.value)} type="text" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="What is this about?" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="Tell us how we can help..."></textarea>
                                </div>
                                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">Send Message</Button>
                            </form>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex gap-3 items-start">
                                    <span className="text-xl">📧</span>
                                    <div>
                                        <div className="font-medium text-gray-900">Email</div>
                                        <a href="mailto:support@zameengar.com" className="text-green-700 hover:underline">support@zameengar.com</a>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="text-xl">📞</span>
                                    <div>
                                        <div className="font-medium text-gray-900">Phone</div>
                                        <a href="tel:+923001234567" className="text-green-700 hover:underline">+92 300 1234567</a>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="text-xl">💬</span>
                                    <div>
                                        <div className="font-medium text-gray-900">WhatsApp</div>
                                        <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Chat with us on WhatsApp</a>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="text-xl">📍</span>
                                    <div>
                                        <div className="font-medium text-gray-900">Address</div>
                                        <p className="text-sm">Zameengar Headquarters, Lahore, Pakistan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                            <h3 className="font-bold text-green-800 mb-2">Business Hours</h3>
                            <div className="text-sm text-green-700 space-y-1">
                                <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                                <p>Saturday: 10:00 AM – 2:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
