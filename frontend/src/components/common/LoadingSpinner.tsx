import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
    text?: string;
    fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 24,
    className = "",
    text,
    fullPage = false,
}) => {
    if (fullPage) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-app-overlay)] backdrop-blur-sm">
                <Loader2
                    size={40}
                    className="animate-spin text-[var(--color-primary)]"
                />
                {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col items-center justify-center gap-2 ${className}`}
        >
            <Loader2
                size={size}
                className="animate-spin text-[var(--color-primary)]"
            />
            {text && <p className="text-sm text-gray-500">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
