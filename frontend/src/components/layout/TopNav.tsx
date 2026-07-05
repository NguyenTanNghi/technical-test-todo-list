import React, { useState } from "react";
import { Search, Moon, Sun } from "lucide-react";
import { getTodayDisplay } from "../../utils";
import { useTheme } from "../../context/ThemeContext";

interface TopNavProps {
    appTitle?: string;
    onSearch?: (query: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({
    appTitle = "Dashboard",
    onSearch,
}) => {
    const [searchValue, setSearchValue] = useState("");
    const { day, date } = getTodayDisplay();
    const { isDark, toggleTheme } = useTheme();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
        onSearch?.(val);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchValue);
    };

    const titleParts = appTitle.split(" ");

    return (
        <header className="sticky top-0 z-30 bg-[var(--color-app-surface)] border-b border-[var(--color-app-border)] px-4 md:px-6 h-14 flex items-center gap-4">
            {/* App title */}
            <div className="min-w-[140px] hidden md:block">
                <h1 className="text-xl font-bold m-0">
                    {titleParts.map((part, i) => (
                        <span key={i}>
                            {i === 0 ? (
                                <span>
                                    <span className="text-[var(--color-primary)]">
                                        {part.charAt(0)}
                                    </span>
                                    <span className="text-[var(--color-app-text)]">
                                        {part.slice(1)}
                                    </span>
                                </span>
                            ) : (
                                <span className="text-[var(--color-app-text)]">
                                    {" "}
                                    {part}
                                </span>
                            )}
                        </span>
                    ))}
                </h1>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
                <div className="relative">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearch}
                        placeholder="Search your task here..."
                        className="
                            w-full pl-4 pr-10 py-2 text-sm bg-[var(--color-app-surface-soft)] border border-[var(--color-app-border)]
                            rounded-full focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-app-surface)]
                            transition-colors
                        "
                    />
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white p-1.5 rounded-full hover:bg-[var(--color-primary-hover)] transition-colors"
                        aria-label="Search"
                    >
                        <Search size={14} />
                    </button>
                </div>
            </form>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 rounded-lg bg-[var(--color-app-surface-soft)] text-[var(--color-app-text)] border border-[var(--color-app-border)] flex items-center justify-center hover:bg-[var(--color-app-surface)] transition-colors"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <div className="hidden sm:block text-right ml-1">
                    <p className="text-xs font-semibold text-[var(--color-app-text)]">
                        {day}
                    </p>
                    <p className="text-xs text-[var(--color-app-text-muted)] font-medium">
                        {date}
                    </p>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
