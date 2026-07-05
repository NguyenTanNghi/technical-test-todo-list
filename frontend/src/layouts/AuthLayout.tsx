import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen auth-pattern flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-[var(--color-app-surface)] rounded-2xl shadow-2xl overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
