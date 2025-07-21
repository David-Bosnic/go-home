import { useState } from "react";
import { GetCalendarEvents } from "../hooks/getCalendarEvents.tsx";
import type { CalendarEvent } from "../hooks/getCalendarEvents.tsx";

export const CalendarEvents = () => {
    const events: CalendarEvent[] | null = GetCalendarEvents().data;
    const [show, setShow] = useState(false);

    if (show) {
        return (
            <>
                <div
                    className="flex w- "
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {events?.map((event: CalendarEvent) => (
                        <div
                            className={`${setBorderColor(parseDateTime(event.startTime).date)} w-80 h-64 p-6 rounded-3xl border-8 m-5 flex flex-col justify-center space-y-4 text-center`}
                            key={event.title}
                        >
                            <h2 className="truncate text-balance text-orange-500 text-3xl font-bold leading-tight">
                                {event.title}
                            </h2>
                            <h2 className="text-2xl text-gray-500">
                                `{parseDateTime(event.startTime).day} at{" "}
                                {parseDateTime(event.startTime).time}`
                            </h2>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <div
                className="flex "
                onClick={() => {
                    setShow(!show);
                }}
            >
                {events?.map((event: CalendarEvent) => (
                    <div
                        className={`${setBorderColor(parseDateTime(event.startTime).date)} w-96 h-64 p-6 rounded-3xl border-8 m-5 flex flex-col justify-center space-y-4 text-center`}
                        key={event.title}
                    >
                        <h2 className="truncate text-balance text-orange-500 text-3xl font-bold leading-tight">
                            {event.title}
                        </h2>
                        <h2 className="text-2xl text-gray-500">{event.location}</h2>
                    </div>
                ))}
            </div>
        </>
    );
};

type DateTimeParts = {
    thisWeek: boolean;
    day: string;
    date: string;
    time: string;
};

function parseDateTime(dateTime: string): DateTimeParts {
    const date = new Date(dateTime);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return {
        thisWeek: false,
        day: dayOfWeek,
        date: date.toDateString(),
        time: time,
    };
}

function setBorderColor(date: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (today.getTime() === compareDate.getTime()) {
        return "border-blue-400";
    }

    const nextMonday = new Date(today);
    let daysUntilNextMonday;

    if (today.getDay() === 1) {
        daysUntilNextMonday = 7;
    } else if (today.getDay() === 0) {
        daysUntilNextMonday = 1;
    } else {
        daysUntilNextMonday = (8 - today.getDay()) % 7;
    }

    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    if (compareDate >= nextMonday && compareDate <= nextSunday) {
        return "border-gray-300";
    }

    return "border-orange-400";
}
