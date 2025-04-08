FROM golang:1.23 as builder

WORKDIR /app

# Скачиваем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем всё
COPY . .

# ❗ Статически линкуем и собираем под Linux
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./src

# Финальный образ
FROM alpine:latest

WORKDIR /root/
COPY --from=builder /app/main .
COPY .env.docker .env

EXPOSE 4000

CMD ["./main"]
