import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isValidSession, setIsValidSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for PASSWORD_RECOVERY or active session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
            }
            setCheckingSession(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                setIsValidSession(true);
                setCheckingSession(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg('Your password has been reset successfully! Redirecting to dashboard...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);
        }
        setLoading(false);
    };

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
                <div className="text-gray-500 text-sm">Verifying reset authorization...</div>
            </div>
        );
    }

    if (!isValidSession && !successMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        The password reset link is invalid or has expired. Please request a new link.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-3">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Create a strong password for your Zameengar account.
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

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm border p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm border p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        {loading ? 'Updating Password...' : 'Update Password'}
                    </Button>
                </form>

                <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" /> Cancel & Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
