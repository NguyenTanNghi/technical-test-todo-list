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

                <div className="mt-5">
                    <p className="text-sm text-gray-500 mt-2">
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
