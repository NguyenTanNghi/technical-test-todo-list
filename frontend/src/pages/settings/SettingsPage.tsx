import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth.api";
import Button from "../../components/common/Button";
import type { UpdateProfilePayload } from "../../types";

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<UpdateProfilePayload>({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        contactNumber: user?.contactNumber || "",
        position: user?.position || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setSuccess(false);
        setError("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");
        try {
            const updated = await authApi.updateProfile(formData);
            updateUser(updated);
            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update profile",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            contactNumber: user?.contactNumber || "",
            position: user?.position || "",
        });
        setError("");
        setSuccess(false);
    };

    const displayName = user ? `${user.firstName} ${user.lastName}` : "User";

    return (
        <div className="animate-fade-in w-full max-w-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--color-app-text)] border-b-2 border-[var(--color-primary)] pb-1">
                    Account Information
                </h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] font-medium"
                >
                    Go Back
                </button>
            </div>

            {/* Profile header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[var(--color-app-surface-soft)] border border-[var(--color-app-border)] flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-semibold text-[var(--color-app-text-muted)]">
                            {displayName.charAt(0)}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-[var(--color-app-text)]">
                        {displayName}
                    </h3>
                    <p className="text-sm text-[var(--color-app-text-muted)]">
                        {user?.email}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm p-6">
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                        Profile updated successfully!
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                    {[
                        {
                            name: "firstName",
                            label: "First Name",
                            type: "text",
                        },
                        { name: "lastName", label: "Last Name", type: "text" },
                        {
                            name: "email",
                            label: "Email Address",
                            type: "email",
                        },
                        {
                            name: "contactNumber",
                            label: "Contact Number",
                            type: "tel",
                        },
                        { name: "position", label: "Position", type: "text" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm text-[var(--color-app-text-muted)] mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={
                                    (formData as Record<string, string>)[
                                        field.name
                                    ] || ""
                                }
                                onChange={handleChange}
                                className="w-full bg-[var(--color-app-surface-soft)] border border-[var(--color-app-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-app-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
                            />
                        </div>
                    ))}

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" isLoading={isSaving}>
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
