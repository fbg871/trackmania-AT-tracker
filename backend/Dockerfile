# Start from the golang base image
FROM golang:latest as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# RUN go install github.com/cosmtrek/air@latest
RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin

ENV PATH $PATH:/go/bin

# Copy go.mod and go.sum
COPY go.* .air.toml ./

# Download all dependencies
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Expose port 4200 to the outside world
EXPOSE 4200

# Set the working directory to the location of the main.go file
WORKDIR /app

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Start a new stage from scratch for a smaller final image
FROM alpine:latest  
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .

# # Copy env file
COPY --from=builder /app/.env .

# # Command to run the executable
CMD ["./main"]
# CMD ["air", "-c", ".air.toml"]

