package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/yourusername/fintracker-backend/internal/config"
	httpsrv "github.com/yourusername/fintracker-backend/internal/http"
)

func main() {
	// ── logger ────────────────────────────────────────────────────────────────
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	// ── config ────────────────────────────────────────────────────────────────
	cfg, err := config.Load()
	if err != nil {
		slog.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	// ── router ────────────────────────────────────────────────────────────────
	router := httpsrv.NewRouter()

	// ── HTTP server ───────────────────────────────────────────────────────────
	srv := &http.Server{
		Addr:         cfg.HTTP.Host + ":" + cfg.HTTP.Port,
		Handler:      router,
		ReadTimeout:  cfg.HTTP.ReadTimeout,
		WriteTimeout: cfg.HTTP.WriteTimeout,
	}

	// Start server in a goroutine so we can listen for shutdown signals.
	serverErr := make(chan error, 1)
	go func() {
		slog.Info("starting HTTP server", "addr", srv.Addr, "env", cfg.Env)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErr <- err
		}
	}()

	// ── graceful shutdown ─────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-quit:
		slog.Info("shutdown signal received", "signal", sig)
	case err := <-serverErr:
		slog.Error("server error", "error", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), cfg.HTTP.ShutdownTimeout)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("graceful shutdown failed", "error", err)
		os.Exit(1)
	}

	slog.Info("server stopped cleanly")

	// Ensure the timeout fires properly even if Shutdown returns first.
	<-ctx.Done()
	if errors.Is(ctx.Err(), context.DeadlineExceeded) {
		slog.Warn("shutdown timeout exceeded")
	}
}
