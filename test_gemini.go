package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/serilevanjalines/LogFlow/internal/ai"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_API_KEY not set in .env file")
	}

	client := ai.NewClient(apiKey)

	response, err := client.Query("Explain what a log aggregator does in one sentence.")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println("Gemini Response:")
	fmt.Println(response)
}
