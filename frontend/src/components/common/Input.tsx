import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    wrapperClassName = "",
    className = "",
    id,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </span>
                )}
                <input
                    id={id}
                    {...props}
                    className={`
            w-full border border-gray-300 rounded-lg bg-white text-gray-900 text-sm
            px-3 py-2.5 transition-colors
            placeholder:text-gray-400
            focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}
            ${className}
          `}
                />
                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
};

export default Input;
