import { useEffect, useState } from "react";

export type CalendarEvent = {
    title: string;
    startTime: string;
    endTime: string;
    location: string;
};

export const GetCalendarEvents = () => {
    const [data, setData] = useState<CalendarEvent[] | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/calendar/events")
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.log(error));
    }, []);
    return data;
};
