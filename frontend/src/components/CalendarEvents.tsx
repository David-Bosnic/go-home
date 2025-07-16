import { useState } from "react";
import { GetCalendarEvents } from "../hooks/getCalendarEvents.tsx";
import type { CalendarEvent } from "../hooks/getCalendarEvents.tsx";

export const CalendarEvents = () => {
    const events: CalendarEvent[] | null = GetCalendarEvents();
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
    const dateTimeParsed = dateTime.split("T");
    const [year, month, day] = dateTimeParsed[0].split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const timeParsed = dateTimeParsed[1].split("-");

    return {
        thisWeek: false,
        day: dayOfWeek,
        date: date.toDateString(),
        time: timeParsed[0],
    };
}

function setBorderColor(date: string): string {
    const today = new Date();
    const compareDate = new Date(date);

    if (today.toDateString() === compareDate.toDateString()) {
        return "border-blue-400";
    }

    const nextMonday = new Date(today);
    const daysUntilMonday = (8 - today.getDay()) % 7;
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);

    if (compareDate >= nextMonday && compareDate <= nextSunday) {
        return "border-gray-300";
    }

    return "border-orange-400";
}

export default CalendarEvents;
