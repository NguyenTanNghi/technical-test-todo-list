import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    CheckSquare,
    Tag,
    Settings,
    HelpCircle,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={18} />,
    },
    { label: "My Task", path: "/my-task", icon: <CheckSquare size={18} /> },
    {
        label: "Task Categories",
        path: "/task-categories",
        icon: <Tag size={18} />,
    },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
    { label: "Help", path: "/help", icon: <HelpCircle size={18} /> },
];

interface SidebarProps {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    collapsed = false,
    onToggleCollapse,
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
    const email = user?.email || "";

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[var(--color-sidebar-bg)]">
            <div className="hidden md:flex justify-end px-3 pt-3">
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-8 h-8 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 hover:text-white flex items-center justify-center transition-colors"
                    aria-label={
                        collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                >
                    {collapsed ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </button>
            </div>

            <div
                className={`flex flex-col items-center px-4 ${collapsed ? "pt-4 pb-4" : "pt-8 pb-6"}`}
            >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 mb-3 bg-white/20">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <>
                        <h3 className="text-white font-semibold text-sm text-center leading-tight">
                            {displayName}
                        </h3>
                        <p className="text-white/70 text-xs text-center mt-0.5 break-all">
                            {email}
                        </p>
                    </>
                )}
            </div>

            <nav className={`flex-1 px-3 space-y-1 ${collapsed ? "pt-2" : ""}`}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"} py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-white/20 text-white"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className={`flex items-center ${collapsed ? "justify-center px-3" : "gap-3 px-4"} py-2.5 w-full rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150`}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut size={18} />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-[var(--color-sidebar-bg)] text-white p-2 rounded-lg shadow-lg"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            <aside
                className={`hidden md:flex flex-col flex-shrink-0 h-full transition-all duration-200 ${collapsed ? "w-20" : "w-52"}`}
            >
                <SidebarContent />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative w-52 h-full">
                        <button
                            className="absolute top-3 right-3 z-10 text-white/80 hover:text-white"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
