import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load pages for better performance
const SignInPage = lazy(() => import("./pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const MyTaskPage = lazy(() => import("./pages/tasks/MyTaskPage"));
const TaskCategoriesPage = lazy(
    () => import("./pages/tasks/TaskCategoriesPage"),
);
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const HelpPage = lazy(() => import("./pages/help/HelpPage"));

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <TaskProvider>
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    fullPage
                                    text="Loading page..."
                                />
                            }
                        >
                            <Routes>
                                {/* Auth routes */}
                                <Route element={<AuthLayout />}>
                                    <Route
                                        path="/signin"
                                        element={<SignInPage />}
                                    />
                                    <Route
                                        path="/signup"
                                        element={<SignUpPage />}
                                    />
                                </Route>

                                {/* Protected routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route element={<DashboardLayout />}>
                                        <Route
                                            path="/dashboard"
                                            element={<DashboardPage />}
                                        />
                                        <Route
                                            path="/my-task"
                                            element={<MyTaskPage />}
                                        />
                                        <Route
                                            path="/task-categories"
                                            element={<TaskCategoriesPage />}
                                        />
                                        <Route
                                            path="/settings"
                                            element={<SettingsPage />}
                                        />
                                        <Route
                                            path="/help"
                                            element={<HelpPage />}
                                        />
                                    </Route>
                                </Route>

                                {/* Default redirect */}
                                <Route
                                    path="/"
                                    element={
                                        <Navigate to="/dashboard" replace />
                                    }
                                />
                                <Route
                                    path="*"
                                    element={
                                        <Navigate to="/dashboard" replace />
                                    }
                                />
                            </Routes>
                        </Suspense>
                    </TaskProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
