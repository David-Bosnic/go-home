package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

func (config *apiConfig) handlerEventsGet(w http.ResponseWriter, r *http.Request) {
	url := fmt.Sprintf("https://www.googleapis.com/calendar/v3/calendars/%s/events", config.calendarID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("GET /calendar/events Error creating new req %v\n", err)
		return
	}
	req.Header.Set("Authorization", config.accessToken)

	q := req.URL.Query()
	q.Add("timeMin", time.Now().UTC().Format(time.RFC3339))
	q.Add("orderBy", "startTime")
	q.Add("singleEvents", "true")
	req.URL.RawQuery = q.Encode()
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("GET /calendar/events Error fetching data %v\n", err)
		return
	}
	body, err := io.ReadAll(res.Body)
	res.Body.Close()
	if res.StatusCode > 200 {
		log.Printf("GET /calendar/events Error failed with status code %v\n with body %v\n", res.StatusCode, body)
		return
	}
	if err != nil {
		log.Printf("GET /calendar/events Error reading body %v\n", err)
		return
	}
	var calendarEvent CalendarEvent
	err = json.Unmarshal(body, &calendarEvent)
	if err != nil {
		log.Printf("GET /calendar/events Error unmarshaling body %v\n", err)
		return
	}
	for _, item := range calendarEvent.Items {
		log.Printf("Event: %s @ %s", item.Summary, item.Start.DateTime)
	}
	w.Header().Add("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(200)
	w.Write([]byte(body))
}
