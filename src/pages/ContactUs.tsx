import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import SEO from '../components/SEO';

export default function ContactUs() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const location = useLocation();
    const submitted = new URLSearchParams(location.search).get('success') === 'true';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Contact Us"
                description="Get in touch with the Zameengar support team for any real estate inquiries, feedback, or assistance."
                url="https://zameengar.com/contact"
            />
            <Header />
            <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Send Us a Message</h2>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="text-lg font-bold text-green-800 mb-1">Message Sent!</h3>
                            <p className="text-green-700 text-sm">Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
                        </div>
                    ) : (
                        <form name="contact" method="POST" action="/success.html" data-netlify="true" className="space-y-4">
                            <input type="hidden" name="form-name" value="contact" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input name="name" value={name} onChange={e => setName(e.target.value)} type="text" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input name="subject" value={subject} onChange={e => setSubject(e.target.value)} type="text" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="What is this about?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea name="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} minLength={15} required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="Tell us how we can help..."></textarea>
                            </div>
                            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">Send Message</Button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
