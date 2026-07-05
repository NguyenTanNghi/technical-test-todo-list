import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
    primary:
        "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white border-transparent shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white border-transparent",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border-transparent",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
};

const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
};

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    disabled,
    ...props
}) => {
    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={`
        inline-flex items-center justify-center gap-2 font-medium border
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : leftIcon ? (
                leftIcon
            ) : null}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
};

export default Button;
