package main

import (
	"backend/pkg/httpapi"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	// Initialization code here

	// Set up environment variables, configuration, logging, etc.
	err := godotenv.Load("./.env")
	if err != nil {
		path, _ := os.Getwd()
		log.Println("Path: ", path)
		log.Fatal("Error loading .env file", err)
	}

	// Start the HTTP server
	port := ":4200"
	log.Println("Starting server on port" + port + "...")
	if err := httpapi.StartServer(port); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
