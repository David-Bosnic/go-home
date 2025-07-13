import { GetCalendarEvents } from "../hooks/getCalendarEvents.tsx";
import type { CalendarEvent } from "../hooks/getCalendarEvents.tsx";

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
        date: dateTimeParsed[0],
        time: timeParsed[0],
    };
}

export const CalendarEvents = () => {
    const events: CalendarEvent[] | null = GetCalendarEvents();

    return (
        <>
            <div className="flex">
                {events?.map((event: CalendarEvent) => (
                    <div
                        className="border-orange-400 p-10 rounded-3xl border-8 m-5 flex flex-col space-y-12 text-center"
                        key={event.title}
                    >
                        <h2 className=" underline text-orange-500 text-5xl font-bold">
                            {event.title}
                        </h2>
                        <h2 className="text-5xl">
                            {parseDateTime(event.startTime).day} at{" "}
                            {parseDateTime(event.startTime).time}
                        </h2>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CalendarEvents;
