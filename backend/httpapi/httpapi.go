package httpapi

import (
	"backend/authentication"
	"backend/trackmania"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func StartServer(port string, r *mux.Router) error {
	r.HandleFunc("/getAccountId", getAccountIdHandler)
	r.HandleFunc("/seasons", seasonHandler)
	r.HandleFunc("/seasons/{number}", seasonRecordsHandler)
	r.HandleFunc("/maps/{id}", mapHandler)
	r.HandleFunc("/all-maps", allMapsHandler)
	r.Use(mux.CORSMethodMiddleware(r))

	http.Handle("/", r)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		return err
	}

	return nil
}

func mapHandler(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query().Get("id")
	if accountId == "" {
		http.Error(w, "No account id provided", http.StatusInternalServerError)
		return
	}

	vars := mux.Vars(r)
	mapId := vars["id"]

	mapInfo, err := trackmania.GetMapRecords(accountId, []string{mapId})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(mapInfo) == 0 {
		// Return empty array if no records found
		response, err := json.Marshal([]int{})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		w.Write(response)
		return
	}

	var mapUpdate = struct {
		PersonalBest int `json:"personalBest"`
		Medal        int `json:"medal"`
	}{
		PersonalBest: mapInfo[0].RecordScore.Time,
		Medal:        mapInfo[0].Medal,
	}
	response, err := json.Marshal(mapUpdate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func getAccountIdHandler(w http.ResponseWriter, r *http.Request) {
	// get url queries
	username := r.URL.Query().Get("username")

	accountId, err := authentication.GetAccountId(username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, err := json.Marshal(accountId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func seasonHandler(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query().Get("id")
	if accountId == "" {
		http.Error(w, "No account id provided", http.StatusInternalServerError)
		return
	}

	seasons, err := trackmania.GetSeasons(accountId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, err := json.Marshal(seasons)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func allMapsHandler(w http.ResponseWriter, r *http.Request) {
	allMaps, err := trackmania.GetAllMaps()
	_ = allMaps
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	return

}

func seasonRecordsHandler(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query().Get("id")
	if accountId == "" {
		http.Error(w, "No account id provided", http.StatusInternalServerError)
		return
	}
	// get url param
	vars := mux.Vars(r)
	seasonNumber := vars["number"]
	seasonNumberInt, err := strconv.Atoi(seasonNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	seasonRecords, err := trackmania.GetSeasonRecords(accountId, seasonNumberInt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, err := json.Marshal(seasonRecords)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}
