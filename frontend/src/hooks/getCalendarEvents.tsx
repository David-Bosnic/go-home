import { useEffect, useState } from "react";

export type CalendarEvent = {
    title: string;
    startTime: string;
    endTime: string;
    location: string;
};

export const GetCalendarEvents = () => {
    const [data, setData] = useState<CalendarEvent[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async (): Promise<CalendarEvent[]> => {
        const response = await fetch("http://localhost:8080/calendar/events");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    };

    const refreshTokens = async (): Promise<void> => {
        const response = await fetch("http://localhost:8080/admin/refresh", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(`Failed to refresh: HTTP ${response.status}`);
        }
    };

    useEffect(() => {
        const getEvents = async () => {
            try {
                setLoading(true);
                setError(null);

                const events = await fetchEvents();
                setData(events);
            } catch (error) {
                console.log("Failed to get events, refreshing tokens:", error);

                try {
                    await refreshTokens();
                    console.log("Token refresh successful, retrying...");

                    const events = await fetchEvents();
                    setData(events);
                } catch (refreshError) {
                    console.error("Failed after token refresh:", refreshError);
                    setError("Failed to load calendar events");
                }
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, []);

    return { data, loading, error };
};
