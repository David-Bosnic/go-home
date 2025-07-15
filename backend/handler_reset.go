package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Credentials struct {
	Web struct {
		ClientID                string   `json:"client_id"`
		ProjectID               string   `json:"project_id"`
		AuthURI                 string   `json:"auth_uri"`
		TokenURI                string   `json:"token_uri"`
		AuthProviderX509CertURL string   `json:"auth_provider_x509_cert_url"`
		ClientSecret            string   `json:"client_secret"`
		RedirectUris            []string `json:"redirect_uris"`
		JavascriptOrigins       []string `json:"javascript_origins"`
	} `json:"web"`
}

type AccessInfo struct {
	AccessToken           string `json:"access_token"`
	Scope                 string `json:"scope"`
	ExpiresIn             int    `json:"expires_in"`
	RefreshTokenExpiresIn int    `json:"refresh_token_expires_in"`
	TokenType             string `json:"token_type"`
}

func (config *apiConfig) refreshAccessTokenGet(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile("./credentials.json")
	if err != nil {
		log.Printf("GET /admin/refresh Error reading credentials file %v\n", err)
		return
	}
	var cred Credentials
	err = json.Unmarshal(data, &cred)
	if err != nil {
		log.Printf("GET /admin/refresh Error unmarhaling credentials file %v\n", err)
		return
	}

	authURL := "https://oauth2.googleapis.com/token"

	encodeData := url.Values{}
	encodeData.Set("client_id", cred.Web.ClientID)
	encodeData.Set("client_secret", cred.Web.ClientSecret)
	encodeData.Set("refresh_token", config.refreshToken)
	encodeData.Set("grant_type", "refresh_token")

	req, err := http.NewRequest("POST", authURL, strings.NewReader(encodeData.Encode()))
	if err != nil {
		log.Printf("GET /admin/refresh Error creating post request %v\n", err)
		return
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("GET /admin/refresh Error fetching data %v\n", err)
		return
	}
	body, err := io.ReadAll(res.Body)
	res.Body.Close()
	if res.StatusCode > 200 {
		log.Printf("GET /admin/refresh StatusCode is not 200 %v\n", res.StatusCode)
		return
	}

	var accInfo AccessInfo
	err = json.Unmarshal(body, &accInfo)
	if err != nil {
		log.Printf("GET /admin/refresh Error unmarshaling data %v\n", err)
		return
	}
	config.refreshToken = accInfo.AccessToken

	envMap, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal("Error reading .env file:", err)
	}
	envMap["ACCESS_TOKEN"] = config.refreshToken
	err = godotenv.Write(envMap, ".env")
	if err != nil {
		log.Fatal("Error writing to .env file:", err)
	}
}
