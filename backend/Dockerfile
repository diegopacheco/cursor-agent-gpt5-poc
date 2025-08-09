# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /backend ./cmd/server

FROM alpine:3.20
WORKDIR /app
ENV PORT=8080
ENV MYSQL_DSN=root:root@tcp(mysql:3306)/coaching?parseTime=true
COPY --from=build /backend /app/backend
EXPOSE 8080
CMD ["/app/backend"]
