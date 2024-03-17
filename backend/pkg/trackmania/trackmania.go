package trackmania

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
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

func getSeasonRecords(seasonId string) ([]MapRecord, error) {
	// get Token
	token, err := fetchTokenFromApi("NadeoServices")

	url := "https://prod.trackmania.core.nadeo.online/mapRecords/"
	method := "GET"
	accountId := "c21d1380-09d8-477a-8062-7c3c02e1d943"

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	// query
	q := req.URL.Query()
	q.Add("seasonId", seasonId)
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

	var mapRecords []MapRecord
	err = json.Unmarshal(body, &mapRecords)

	if err != nil {
		return nil, err
	}
	return mapRecords, nil
}

func getMapRecords(mapIds []string) ([]MapRecord, error) {
	// get Token
	token, err := fetchTokenFromApi("NadeoServices")

	url := "https://prod.trackmania.core.nadeo.online/mapRecords/"
	method := "GET"
	accountId := "c21d1380-09d8-477a-8062-7c3c02e1d943"

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
	CampaignList []Campaign `json:"campaignList"`
}

type CampaignMaps struct {
	Name       string   `json:"name"`
	SeasonId   string   `json:"seasonId"`
	MapUidList []string `json:"mapUidList"`
}

func GetAllCampaignMaps() ([]Season, error) {
	// get Token
	token, err := fetchTokenFromApi("NadeoLiveServices")
	if err != nil {
		return nil, err
	}

	// var result []SeasonInfo

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

	// Make into test struct type
	var tests []CampaignMaps
	for _, campaign := range campaigns.CampaignList {
		test := CampaignMaps{
			Name:       campaign.Name,
			SeasonId:   campaign.SeasonUid,
			MapUidList: []string{},
		}
		for _, playlistItem := range campaign.Playlist {
			test.MapUidList = append(test.MapUidList, playlistItem.MapUid)
		}
		tests = append(tests, test)
	}

	total, err := getAuthorTimesForAllSeasons(tests)

	if err != nil {
		return nil, err
	}

	return total, nil
}

func getAuthorTimesForAllSeasons(campaignMaps []CampaignMaps) ([]Season, error) {
	var seasons []Season

	for _, campaignMap := range campaignMaps {
		var season Season
		season.SeasonId = campaignMap.SeasonId
		season.Name = campaignMap.Name
		mapUids := campaignMap.MapUidList
		maps, err := getMaps(mapUids)
		if err != nil {
			return nil, err
		}

		var mapIds []string
		for _, m := range maps {
			mapIds = append(mapIds, m.MapId)
		}

		seasonRecords, _ := getMapRecords(mapIds)

		for j, m := range maps {
			for _, record := range seasonRecords {
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

		season.Maps = maps
		seasons = append(seasons, season)
	}

	return seasons, nil
}

type Season struct {
	SeasonId string `json:"seasonId"`
	Name     string `json:"name"`
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

func getMaps(mapUids []string) ([]Map, error) {
	token, err := fetchTokenFromApi("NadeoServices")
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
	return maps, nil
}
