FROM golang:1.22-alpine AS builder

RUN apk add --no-cache chromium
ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

FROM alpine:3.19

RUN apk --no-cache add chromium ca-certificates tzdata
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV TZ=Asia/Jakarta

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
CMD ["./server"]
