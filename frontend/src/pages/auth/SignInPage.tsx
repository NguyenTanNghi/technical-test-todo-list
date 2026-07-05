import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, CheckSquare } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.password) {
            setError("Please fill in all fields");
            return;
        }
        setIsLoading(true);
        try {
            const response = await authApi.login({
                username: formData.username.trim(),
                password: formData.password,
            });
            login(response.token, response.user);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[420px]">
            {/* Left - form */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Sign In
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <User
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 accent-[var(--color-primary)]"
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm text-gray-600 cursor-pointer"
                        >
                            Remember Me
                        </label>
                    </div>

                    {/* Login button */}
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                        size="lg"
                    >
                        Login
                    </Button>
                </form>

                {/* Social login */}
                <div className="mt-5">
                    <p className="text-sm text-gray-500 mb-3">
                        Or, Login with
                        <button className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="#1877F2"
                            >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                        <button className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        </button>
                        <button className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </button>
                    </p>
                    <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-[var(--color-primary)] font-medium hover:underline"
                        >
                            Create One
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right - illustration */}
            <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl" />
                        <CheckSquare
                            size={64}
                            className="text-[var(--color-primary)] relative z-10"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Manage Your Tasks
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Stay organized and productive
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
