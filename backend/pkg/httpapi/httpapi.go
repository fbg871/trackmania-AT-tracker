package httpapi

import (
	"backend/pkg/trackmania"
	"encoding/json"
	"net/http"
)

func StartServer(port string) error {
	http.HandleFunc("/my-pbs", handlerFunction)
	http.HandleFunc("/test", testHandlerFunction)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		return err
	}

	return nil
}

type ApiResponse []struct {
	data interface{}
}

func testHandlerFunction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "hello live world"}`))
}

func handlerFunction(w http.ResponseWriter, r *http.Request) {
	test, err := trackmania.GetAllCampaignMaps()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, err := json.Marshal(test)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}
