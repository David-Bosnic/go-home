package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type apiconfig struct {
	accessToken string
}

func main() {
	godotenv.Load()
	var apiConf apiconfig
	apiConf.accessToken = os.Getenv("ACCESS_TOKEN")
	mux := http.NewServeMux()

	mux.HandleFunc("GET /calandar", func(w http.ResponseWriter, r *http.Request) {
		// res, err := http.Get("https://google.com")
		w.Header().Add("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(200)
		w.Write([]byte("OK"))
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
