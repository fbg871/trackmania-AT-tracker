package trackmania

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

type TokenInfo struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Expiry       int64  `json:"expires_in"`
}

var (
	tokenStore = map[string]TokenInfo{
		"NadeoLiveServices": {},
		"NadeoCoreServices": {},
	}
)

func fetchTokenFromApi(tokenType string) (string, error) {
	url := "https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic"
	method := "POST"

	// Check if token exists in store
	store, _ := tokenStore[tokenType]
	if store.AccessToken != "" {
		if store.Expiry > 0 && store.Expiry < (int64)(time.Now().Unix()) {
			fmt.Println("Token expired, fetching new token")
			delete(tokenStore, tokenType)
		} else {
			return store.AccessToken, nil
		}
	}

	body := struct {
		Audience string `json:"audience"`
	}{
		Audience: tokenType,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return "", err
	}

	buffer := bytes.NewBuffer(jsonBody)

	req, err := http.NewRequest(method, url, buffer)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Basic "+os.Getenv("AUTH_TOKEN"))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Error fetching token: %s", resp.Status)
	}

	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return "", err
	}

	accessToken, refreshToken := data["accessToken"].(string), data["refreshToken"].(string)
	expiry, err := getExpirationFromToken(accessToken)

	tokenStore[tokenType] = TokenInfo{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Expiry:       expiry,
	}

	return accessToken, nil
}
func getExpirationFromToken(token string) (int64, error) {
	payload := strings.Split(token, ".")[1]
	decodedPayload, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return 0, err
	}
	var result map[string]interface{}
	err = json.Unmarshal(decodedPayload, &result)
	if err != nil {
		return 0, err
	}

	expiry, ok := result["exp"].(float64)
	if !ok {
		return 0, fmt.Errorf("Error parsing token expiration")
	}

	return int64(expiry), nil
}
