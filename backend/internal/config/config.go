package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds all runtime configuration read from environment variables.
type Config struct {
	HTTP     HTTPConfig
	Database DatabaseConfig
	Auth     AuthConfig
	Env      string // "local" | "dev" | "prod"
}

type HTTPConfig struct {
	Host            string
	Port            string
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	ShutdownTimeout time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type AuthConfig struct {
	JWTSecret string
}

// DSN returns a PostgreSQL connection string.
func (d DatabaseConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		d.Host, d.Port, d.User, d.Password, d.Name, d.SSLMode,
	)
}

// Load reads configuration from environment variables.
// Missing required variables cause an error; optional ones fall back to defaults.
func Load() (*Config, error) {
	cfg := &Config{
		Env: getEnv("APP_ENV", "local"),
		HTTP: HTTPConfig{
			Host:            getEnv("HTTP_HOST", "0.0.0.0"),
			Port:            getEnv("BACKEND_PORT", "8080"),
			ReadTimeout:     getDurationEnv("HTTP_READ_TIMEOUT", 5*time.Second),
			WriteTimeout:    getDurationEnv("HTTP_WRITE_TIMEOUT", 10*time.Second),
			ShutdownTimeout: getDurationEnv("HTTP_SHUTDOWN_TIMEOUT", 15*time.Second),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("POSTGRES_USER", "fintracker"),
			Password: getEnv("POSTGRES_PASSWORD", ""),
			Name:     getEnv("POSTGRES_DB", "fintracker_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Auth: AuthConfig{
			JWTSecret: getEnv("JWT_SECRET", ""),
		},
	}

	if cfg.Database.Password == "" {
		return nil, fmt.Errorf("config: POSTGRES_PASSWORD is required")
	}
	if cfg.Auth.JWTSecret == "" {
		return nil, fmt.Errorf("config: JWT_SECRET is required")
	}

	return cfg, nil
}

// ── helpers ──────────────────────────────────────────────────────────────────

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}
	return fallback
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	v, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	// Accept plain seconds (e.g. "15") or Go duration strings (e.g. "15s").
	if secs, err := strconv.Atoi(v); err == nil {
		return time.Duration(secs) * time.Second
	}
	if d, err := time.ParseDuration(v); err == nil {
		return d
	}
	return fallback
}
