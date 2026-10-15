import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            setErrorMsg("Please enter your email address.");
            setLoading(false);
            return;
        }

        if (!trimmedEmail.endsWith('@gmail.com')) {
            setErrorMsg("Only @gmail.com accounts are permitted.");
            setLoading(false);
            return;
        }

        const redirectTo = `${window.location.origin}/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
            redirectTo
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg('Password reset instructions have been sent to your email. Please check your inbox and spam folder.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-3">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter your registered email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {errorMsg && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="you@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm border p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </Button>
                </form>

                <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
