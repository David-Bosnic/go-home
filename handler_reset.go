package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
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

	// BUG:Keep on getting 401 but everything looks fine
	url := "https://oauth2.googleapis.com/token"
	formData := fmt.Sprintf("client_id=%s&client_secret=%s&refresh_token=%s&grant_type=refresh_token",
		cred.Web.ClientID, cred.Web.ClientSecret, config.refreshToken)

	req, err := http.NewRequest("POST", url, strings.NewReader(formData))
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
	log.Println(accInfo.AccessToken)
}
