package httpsrv

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/yourusername/fintracker-backend/internal/http/handlers"
)

// NewRouter builds and returns a configured chi.Router.
func NewRouter() http.Handler {
	r := chi.NewRouter()

	// ── global middleware ────────────────────────────────────────────────────
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// ── health ───────────────────────────────────────────────────────────────
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// ── API v1 ───────────────────────────────────────────────────────────────
	accountH := handlers.NewAccountHandler()
	transactionH := handlers.NewTransactionHandler()

	r.Route("/api/v1", func(r chi.Router) {
		// TODO: add auth middleware here when JWT is ready
		// r.Use(middleware.Auth)

		r.Route("/accounts", func(r chi.Router) {
			r.Get("/", accountH.List)
			r.Post("/", accountH.Create)
			r.Get("/{id}", accountH.Get)
			r.Put("/{id}", accountH.Update)
			r.Delete("/{id}", accountH.Delete)
		})

		r.Route("/transactions", func(r chi.Router) {
			r.Get("/", transactionH.List)
			r.Post("/", transactionH.Create)
			r.Get("/{id}", transactionH.Get)
			r.Put("/{id}", transactionH.Update)
			r.Delete("/{id}", transactionH.Delete)
		})
	})

	return r
}
