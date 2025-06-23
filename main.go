package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type apiconfig struct {
	accessToken string
	calendarID  string
}

func main() {
	godotenv.Load()
	var apiConf apiconfig
	apiConf.accessToken = "Bearer " + os.Getenv("ACCESS_TOKEN")
	apiConf.calendarID = os.Getenv("CALENDAR_ID")
	mux := http.NewServeMux()

	mux.HandleFunc("GET /calendar", func(w http.ResponseWriter, r *http.Request) {
		url := fmt.Sprintf("https://www.googleapis.com/calendar/v3/calendars/%s/events", apiConf.calendarID)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			log.Printf("GET /calendar Error creating new req %v\n", err)
			return
		}
		req.Header.Set("Authorization", apiConf.accessToken)

		q := req.URL.Query()
		q.Add("timeMin", time.Now().UTC().Format(time.RFC3339))
		req.URL.RawQuery = q.Encode()
		res, err := http.DefaultClient.Do(req)
		if err != nil {
			log.Printf("GET /calendar Error fetching data %v\n", err)
			return
		}
		body, err := io.ReadAll(res.Body)
		res.Body.Close()
		if res.StatusCode > 200 {
			log.Printf("GET /calendar Error failed with status code %v\n with body %v\n", res.StatusCode, body)
			return
		}
		if err != nil {
			log.Printf("GET /calendar Error reading body %v\n", err)
			return
		}
		w.Header().Add("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(200)
		w.Write([]byte(body))
	})

	ServerMux := http.Server{}
	ServerMux.Handler = mux
	ServerMux.Addr = ":8080"

	fmt.Println("Running Server")
	err := ServerMux.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Spinning up server")
	}
}
