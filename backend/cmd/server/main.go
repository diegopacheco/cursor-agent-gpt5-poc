package main

import (
	"github.com/diegopacheco/cursor-agent-gpt5-poc/backend/internal/server"
	"log"
	"os"
)

func main() {
	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dsn = "root:root@tcp(127.0.0.1:3306)/coaching?parseTime=true"
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	s, err := server.New(dsn)
	if err != nil {
		log.Fatal(err)
	}
	log.Fatal(s.Start(":" + port))
}
