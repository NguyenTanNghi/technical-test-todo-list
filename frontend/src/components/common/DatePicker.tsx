import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pad = (value: number) => String(value).padStart(2, "0");

const toInputDate = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseInputDate = (value: string): Date | null => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};

const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

const sameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return compareDate < today;
};

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onChange,
    placeholder = "Select a date",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeMonth, setActiveMonth] = useState(() => {
        return parseInputDate(value) || new Date();
    });

    const selectedDate = useMemo(() => parseInputDate(value), [value]);
    const today = new Date();
    const calendarMonth = startOfMonth(activeMonth);
    const firstDayIndex = (calendarMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        0,
    ).getDate();
    const previousMonthDays = new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth(),
        0,
    ).getDate();

    const monthLabel = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(calendarMonth);

    const calendarDays = useMemo(() => {
        const cells: Array<{ date: Date; isCurrentMonth: boolean }> = [];

        for (let index = firstDayIndex - 1; index >= 0; index -= 1) {
            cells.push({
                date: new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() - 1,
                    previousMonthDays - index,
                ),
                isCurrentMonth: false,
            });
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            cells.push({
                date: new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth(),
                    day,
                ),
                isCurrentMonth: true,
            });
        }

        const remaining = (7 - (cells.length % 7)) % 7;
        for (let day = 1; day <= remaining; day += 1) {
            cells.push({
                date: new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() + 1,
                    day,
                ),
                isCurrentMonth: false,
            });
        }

        return cells;
    }, [calendarMonth, daysInMonth, firstDayIndex, previousMonthDays]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            setActiveMonth(selectedDate);
        }
    }, [selectedDate]);

    const handlePickDate = (date: Date) => {
        onChange(toInputDate(date));
        setActiveMonth(date);
        setIsOpen(false);
    };

    const displayValue = selectedDate
        ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          }).format(selectedDate)
        : "";

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-app-text-muted)] mb-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-3 border border-[var(--color-app-border)] rounded-lg px-3 py-2.5 text-left text-sm bg-[var(--color-app-surface-soft)] text-[var(--color-app-text)] hover:bg-[var(--color-app-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] transition-colors"
            >
                <span
                    className={
                        displayValue ? "" : "text-[var(--color-app-text-muted)]"
                    }
                >
                    {displayValue || placeholder}
                </span>
                <CalendarDays
                    size={16}
                    className="text-[var(--color-app-text-muted)]"
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-50 w-[320px] rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-app-border)] bg-[var(--color-app-surface-soft)]">
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-app-text)]">
                                {monthLabel}
                            </p>
                            <p className="text-xs text-[var(--color-app-text-muted)]">
                                Select a due date
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveMonth(
                                        new Date(
                                            activeMonth.getFullYear(),
                                            activeMonth.getMonth() - 1,
                                            1,
                                        ),
                                    )
                                }
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-app-text)] hover:bg-[var(--color-app-border)] transition-colors"
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveMonth(
                                        new Date(
                                            activeMonth.getFullYear(),
                                            activeMonth.getMonth() + 1,
                                            1,
                                        ),
                                    )
                                }
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-app-text)] hover:bg-[var(--color-app-border)] transition-colors"
                                aria-label="Next month"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="px-4 pt-3 pb-4">
                        <div className="grid grid-cols-7 gap-1 mb-2 text-[11px] font-semibold text-[var(--color-app-text-muted)]">
                            {weekdayLabels.map((day) => (
                                <div
                                    key={day}
                                    className="h-8 flex items-center justify-center"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map(({ date, isCurrentMonth }) => {
                                const isSelected = selectedDate
                                    ? sameDay(date, selectedDate)
                                    : false;
                                const isToday = sameDay(date, today);
                                const isPast = isPastDate(date);

                                return (
                                    <button
                                        key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                                        type="button"
                                        onClick={() => !isPast && handlePickDate(date)}
                                        disabled={isPast}
                                        className={[
                                            "h-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
                                            isCurrentMonth
                                                ? (isPast ? "text-[var(--color-app-text-muted)] opacity-30 cursor-not-allowed" : "text-[var(--color-app-text)]")
                                                : "text-[var(--color-app-text-muted)] opacity-60",
                                            isSelected
                                                ? "bg-[var(--color-primary)] text-white shadow-sm"
                                                : (isPast ? "" : "hover:bg-[var(--color-app-surface-soft)]"),
                                            isToday && !isSelected
                                                ? "ring-1 ring-[var(--color-primary-soft-strong)]"
                                                : "",
                                        ].join(" ")}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--color-app-border)]">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                                className="text-xs font-medium text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text)] transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
