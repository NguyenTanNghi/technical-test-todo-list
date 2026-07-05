import React from "react";
import { HelpCircle, MessageCircle, Book, Mail } from "lucide-react";

const HelpPage: React.FC = () => {
    const faqs = [
        {
            q: "How do I add a new task?",
            a: 'Click the "+ Add Task" button on the My Task page or "+ Add task" on the Dashboard to create a new task.',
        },
        {
            q: "How do I edit a task?",
            a: 'Click the three-dot menu (⋯) on any task card and select "Edit", or click the edit icon in the task detail panel.',
        },
        {
            q: "How do I delete a task?",
            a: 'Click the three-dot menu (⋯) on any task card and select "Delete". Confirm the deletion in the dialog.',
        },
        {
            q: "How do I filter tasks?",
            a: "Use the filter bar on the My Task page to filter by status (Not Started, In Progress, Completed) or priority (Extreme, Moderate, Low).",
        },
        {
            q: "How do I change my profile information?",
            a: "Go to the Settings page in the sidebar and update your account information there.",
        },
    ];

    return (
        <div className="animate-fade-in w-full max-w-none">
            <h2 className="text-xl font-bold text-[var(--color-app-text)] border-b-2 border-[var(--color-primary)] pb-1 mb-6">
                Help & Support
            </h2>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    {
                        icon: <Book size={24} />,
                        title: "Documentation",
                        desc: "Read the full docs",
                    },
                    {
                        icon: <MessageCircle size={24} />,
                        title: "Community",
                        desc: "Join our community",
                    },
                    {
                        icon: <Mail size={24} />,
                        title: "Contact Support",
                        desc: "Get help from our team",
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm p-5 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-[var(--color-primary)] transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-[var(--color-app-surface-soft)] border border-[var(--color-app-border)] flex items-center justify-center text-[var(--color-app-text)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                            {item.icon}
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--color-app-text)]">
                            {item.title}
                        </h3>
                        <p className="text-xs text-[var(--color-app-text-muted)]">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <HelpCircle
                        size={18}
                        className="text-[var(--color-app-text)]"
                    />
                    <h3 className="text-sm font-semibold text-[var(--color-app-text)]">
                        Frequently Asked Questions
                    </h3>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border-b border-[var(--color-app-border)] pb-4 last:border-0 last:pb-0"
                        >
                            <h4 className="text-sm font-medium text-[var(--color-app-text)] mb-1">
                                {faq.q}
                            </h4>
                            <p className="text-xs text-[var(--color-app-text-muted)] leading-relaxed">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
