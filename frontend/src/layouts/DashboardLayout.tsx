import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/my-task": "To-Do",
    "/task-categories": "To-Do",
    "/settings": "To-Do",
    "/help": "To-Do",
};

const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const appTitle = pageTitles[location.pathname] || "Dashboard";

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-app-bg)]">
            {/* Sidebar */}
            <Sidebar
                collapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top nav */}
                <TopNav appTitle={appTitle} onSearch={setSearchQuery} />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 w-full">
                    <Outlet context={{ searchQuery }} />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
