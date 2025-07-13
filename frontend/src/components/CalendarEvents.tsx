import { GetCalendarEvents } from "../hooks/getCalendarEvents.tsx";
import type { CalendarEvent } from "../hooks/getCalendarEvents.tsx";

export const CalendarEvents = () => {
    const events: CalendarEvent[] | null = GetCalendarEvents();

    return (
        <>
            <div className="flex ">
                {events?.map((event: CalendarEvent) => (
                    <div
                        className={`${setBorderColor(parseDateTime(event.startTime).date)} p-10 rounded-3xl border-8 m-5 flex flex-col space-y-12 text-center`}
                        key={event.title}
                    >
                        <h2 className="text-balance text-orange-500 text-5xl font-bold leading-tight">
                            {event.title}
                        </h2>
                        <h2 className="text-5xl text-gray-500">
                            {parseDateTime(event.startTime).day} at{" "}
                            {parseDateTime(event.startTime).time}
                        </h2>
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
