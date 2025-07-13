import { GetCalendarEvents } from "../hooks/getCalendarEvents.tsx";
import type { CalendarEvent } from "../hooks/getCalendarEvents.tsx";

export const CalendarEvents = () => {
    const events: CalendarEvent[] | null = GetCalendarEvents();
    // <h2 className="text-5xl">Ends at: {event.endTime}</h2>
    // <h2 className="text-5xl">Location: {event.location}</h2>
    return (
        <>
            <div>
                {events?.map((event: CalendarEvent) => (
                    <div
                        className="border-orange-400 p-10 rounded-3xl border-8 m-5 flex flex-col space-y-12 text-center"
                        key={event.title}
                    >
                        <h2 className="text-orange-500 text-5xl font-bold">
                            Event: {event.title}
                        </h2>
                        <h2 className="text-5xl">Starts at: {event.startTime}</h2>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CalendarEvents;
