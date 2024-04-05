package trackmania

import (
	"backend/authentication"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

type RecordScore struct {
	RespawnCount int `json:"respawnCount"`
	Time         int `json:"time"`
}

type MapRecord struct {
	MapId       string      `json:"mapId"`
	RecordScore RecordScore `json:"recordScore"`
	Medal       int         `json:"medal"`
}

func GetMapRecords(accountId string, mapIds []string) ([]MapRecord, error) {
	// get Token
	token, err := authentication.FetchTokenFromApi("NadeoServices")

	url := "https://prod.trackmania.core.nadeo.online/mapRecords/"
	method := "GET"

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	// query
	q := req.URL.Query()
	q.Add("mapIdList", strings.Join(mapIds, ","))
	q.Add("accountIdList", accountId)
	req.URL.RawQuery = q.Encode()
	// headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "nadeo_v1 t="+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if string(body) == "[]" {
		return []MapRecord{}, nil
	}

	var mapRecords []MapRecord
	err = json.Unmarshal(body, &mapRecords)

	if err != nil {
		return nil, err
	}
	return mapRecords, nil
}

type CampaignPlaylistItem struct {
	MapUid string `json:"mapUid"`
}

type Campaign struct {
	Name      string                 `json:"name"`
	SeasonUid string                 `json:"seasonUid"`
	Playlist  []CampaignPlaylistItem `json:"playlist"`
}

type ResponseCampaign struct {
	ItemCount    int        `json:"itemCount"`
	CampaignList []Campaign `json:"campaignList"`
}

type CampaignMaps struct {
	Name       string   `json:"name"`
	SeasonId   string   `json:"seasonId"`
	MapUidList []string `json:"mapUidList"`
}

func GetAllMaps() ([]Map, error) {

	return nil, nil
}

type Season struct {
	SeasonId string `json:"seasonId"`
	Name     string `json:"name"`
	Number   int    `json:"number"`
	Maps     []Map  `json:"maps"`
}

type Map struct {
	MapUid       string `json:"mapUid"`
	MapId        string `json:"mapId"`
	Name         string `json:"name"`
	AuthorTime   int    `json:"authorScore"`
	PersonalBest int    `json:"personalBest"`
	Medal        int    `json:"medal"`
	RespawnCount int    `json:"respawnCount"`
	ThumbnailUrl string `json:"thumbnailUrl"`
}

type SeasonInfo struct {
	SeasonId         string `json:"seasonId"`
	Name             string `json:"name"`
	Number           int    `json:"number"`
	AuthorMedalCount int    `json:"authorMedalCount"`
}

func GetSeasons(accountId string) ([]SeasonInfo, error) {
	// get token
	token, err := authentication.FetchTokenFromApi("NadeoLiveServices")
	if err != nil {
		fmt.Println("Error fetching token for NadeoLiveServices")
	}

	url := "https://live-services.trackmania.nadeo.live/api/token/campaign/official?length=20&offset=0"
	method := "GET"
	length := "20"
	offset := "0"

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}
	// query
	q := req.URL.Query()
	q.Add("length", length)
	q.Add("offset", offset)
	req.URL.RawQuery = q.Encode()

	// headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "nadeo_v1 t="+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var campaigns ResponseCampaign
	err = json.Unmarshal(body, &campaigns)
	if err != nil {
		return nil, err
	}

	var seasons []SeasonInfo
	var wg sync.WaitGroup
	var mu sync.Mutex
	for i, campaign := range campaigns.CampaignList {
		wg.Add(1)

		go func(i int, campaign Campaign) {
			defer wg.Done()

			season := SeasonInfo{
				Name:             campaign.Name,
				SeasonId:         campaign.SeasonUid,
				Number:           getSeasonCount() - i,
				AuthorMedalCount: 0,
			}
			var mapUids []string
			for _, playlistItem := range campaign.Playlist {
				mapUids = append(mapUids, playlistItem.MapUid)
			}

			maps, err := getMaps(accountId, mapUids)
			if err != nil {
				// return nil, err
			}

			for _, m := range maps {
				if m.Medal == 4 {
					season.AuthorMedalCount++
				}
			}

			mu.Lock()
			seasons = append(seasons, season)
			mu.Unlock()
		}(i, campaign)
	}
	wg.Wait()

	// Sort by season number
	sort.Slice(seasons, func(i, j int) bool {
		return seasons[i].Number > seasons[j].Number
	})
	return seasons, nil
}

func getSeasonNumber(m time.Month) int {
	if m >= 1 && m <= 3 {
		return 1
	}
	if m >= 4 && m <= 6 {
		return 2
	}
	if m >= 7 && m <= 9 {
		return 3
	}
	return 4
}

func getSeasonCount() int {
	currentDate := time.Now()
	currentYear := currentDate.Year()
	currentSeason := getSeasonNumber(currentDate.Month())

	seasonCount := (currentYear-2020)*4 + currentSeason - 2
	return seasonCount
}

func GetSeasonRecords(accountId string, seasonNumber int) (Season, error) {
	token, err := authentication.FetchTokenFromApi("NadeoLiveServices")
	if err != nil {
		fmt.Println("Error fetching token for NadeoLiveServices")
	}

	url := "https://live-services.trackmania.nadeo.live/api/token/campaign/official"
	method := "GET"

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return Season{}, err
	}

	offset := getSeasonCount() - seasonNumber
	if offset < 0 {
		return Season{}, fmt.Errorf("This season doesn't exist yet")
	}

	q := req.URL.Query()
	q.Add("length", "1")
	q.Add("offset", strconv.Itoa(offset))
	req.URL.RawQuery = q.Encode()

	// headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "nadeo_v1 t="+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return Season{}, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return Season{}, err
	}

	var campaign ResponseCampaign
	err = json.Unmarshal(body, &campaign)
	if err != nil {
		return Season{}, err
	}

	if len(campaign.CampaignList) == 0 {
		fmt.Println("No campaign found", campaign)
		return Season{}, fmt.Errorf("No campaign found")
	}

	var season Season
	season.SeasonId = campaign.CampaignList[0].SeasonUid
	season.Name = campaign.CampaignList[0].Name
	mapUids := []string{}
	for _, playlistItem := range campaign.CampaignList[0].Playlist {
		mapUids = append(mapUids, playlistItem.MapUid)
	}
	maps, err := getMaps(accountId, mapUids)
	if err != nil {
		return Season{}, err
	}

	season.Maps = maps

	sort.Slice(season.Maps, func(i, j int) bool {
		return season.Maps[i].Name < season.Maps[j].Name
	})

	return season, nil
}

func getMaps(accountId string, mapUids []string) ([]Map, error) {
	token, err := authentication.FetchTokenFromApi("NadeoServices")
	if err != nil {
		fmt.Println("Error fetching token for NadeoServices")
	}

	url := "https://prod.trackmania.core.nadeo.online/maps/"
	method := "GET"

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}
	// Query
	q := req.URL.Query()
	// add commas between mapUids
	q.Add("mapUidList", strings.Join(mapUids, ","))
	req.URL.RawQuery = q.Encode()
	// headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "nadeo_v1 t="+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var maps []Map
	err = json.Unmarshal(body, &maps)
	if err != nil {
		return nil, err
	}

	mapIds := []string{}
	for _, m := range maps {
		mapIds = append(mapIds, m.MapId)
	}

	records, err := GetMapRecords(accountId, mapIds)
	if err != nil {
		return nil, err
	}

	for j, m := range maps {
		for _, record := range records {
			if m.MapId == record.MapId {
				var newAuthorTime Map
				newAuthorTime = m
				newAuthorTime.Medal = record.Medal
				newAuthorTime.PersonalBest = record.RecordScore.Time
				newAuthorTime.RespawnCount = record.RecordScore.RespawnCount
				maps[j] = newAuthorTime
			}
		}
	}

	return maps, nil
}
