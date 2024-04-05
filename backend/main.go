package main

import (
	"backend/httpapi"
	"log"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Initialization code here

	// Set up environment variables, configuration, logging, etc.
	err := godotenv.Load("./.env")
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	// Start the HTTP server
	port := ":4200"
	log.Println("Starting server on port" + port + "...")
	r := mux.NewRouter()
	if err := httpapi.StartServer(port, r); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
