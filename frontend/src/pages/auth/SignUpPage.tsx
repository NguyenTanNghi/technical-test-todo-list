import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserCircle2, ClipboardList } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // ── Password strength ──
    const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
        if (!pwd) return { level: 0, label: "", color: "" };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
        if (score === 2) return { level: 2, label: "Fair", color: "#f97316" };
        if (score === 3) return { level: 3, label: "Good", color: "#eab308" };
        return { level: 4, label: "Strong", color: "#22c55e" };
    };
    const pwdStrength = getPasswordStrength(formData.password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setError("");
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.firstName.trim()) errors.firstName = "Required";
        if (!formData.lastName.trim()) errors.lastName = "Required";
        if (!formData.username.trim()) errors.username = "Required";
        if (!formData.email.trim()) errors.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            errors.email = "Invalid email";
        if (!formData.password) errors.password = "Required";
        else if (formData.password.length < 6)
            errors.password = "At least 6 characters";
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        if (!formData.agreeToTerms)
            errors.agreeToTerms = "You must agree to the terms";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        try {
            const response = await authApi.register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
            login(response.token, response.user);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Registration failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const fields = [
        {
            name: "firstName",
            placeholder: "Enter First Name",
            icon: <User size={15} />,
            type: "text",
        },
        {
            name: "lastName",
            placeholder: "Enter Last Name",
            icon: <User size={15} />,
            type: "text",
        },
        {
            name: "username",
            placeholder: "Enter Username",
            icon: <UserCircle2 size={15} />,
            type: "text",
        },
        {
            name: "email",
            placeholder: "Enter Email",
            icon: <Mail size={15} />,
            type: "email",
        },
        {
            name: "password",
            placeholder: "Enter Password",
            icon: <Lock size={15} />,
            type: "password",
        },
        {
            name: "confirmPassword",
            placeholder: "Confirm Password",
            icon: <Lock size={15} />,
            type: "password",
        },
    ] as const;

    return (
        <div className="flex min-h-[560px]">
            {/* Left - illustration */}
            <div className="hidden md:flex w-2/5 bg-gray-50 items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-44 h-44 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                        <div className="relative flex items-center justify-center w-full h-full">
                            <div className="absolute w-28 h-36 bg-blue-300 rounded-xl opacity-60 -rotate-6 transform" />
                            <div className="absolute w-28 h-36 bg-cyan-300 rounded-xl opacity-60 rotate-3 transform" />
                            <ClipboardList
                                size={48}
                                className="text-white relative z-10"
                            />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Get Started Today
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Join thousands of productive users
                    </p>
                </div>
            </div>

            {/* Right - form */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                    Sign Up
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {field.icon}
                                </span>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] ${
                                        fieldErrors[field.name]
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    }`}
                                />
                            </div>

                            {/* Password strength bar */}
                            {field.name === "password" && formData.password && (
                                <div className="mt-2 px-0.5">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((seg) => (
                                            <div
                                                key={seg}
                                                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor:
                                                        seg <= pwdStrength.level
                                                            ? pwdStrength.color
                                                            : "#e5e7eb",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p
                                        className="text-xs font-medium transition-colors duration-200"
                                        style={{ color: pwdStrength.color }}
                                    >
                                        {pwdStrength.label}
                                    </p>
                                </div>
                            )}

                            {fieldErrors[field.name] && (
                                <p className="text-xs text-red-500 mt-0.5">
                                    {fieldErrors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="agreeToTerms"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="w-4 h-4 mt-0.5 accent-[var(--color-primary)]"
                        />
                        <label
                            htmlFor="agreeToTerms"
                            className="text-sm text-gray-600 cursor-pointer"
                        >
                            I agree to all terms
                        </label>
                    </div>
                    {fieldErrors.agreeToTerms && (
                        <p className="text-xs text-red-500">
                            {fieldErrors.agreeToTerms}
                        </p>
                    )}

                    <Button type="submit" isLoading={isLoading} size="lg">
                        Register
                    </Button>

                    <p className="text-sm text-gray-500 pt-1">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-[var(--color-primary)] font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
