package handlers

import (
	"net/http"
)

// AccountHandler handles HTTP requests for the /accounts resource.
// TODO: inject AccountService when business logic is implemented.
type AccountHandler struct{}

// NewAccountHandler creates a new AccountHandler.
func NewAccountHandler() *AccountHandler {
	return &AccountHandler{}
}

// List returns all accounts for the authenticated user.
// GET /api/v1/accounts
func (h *AccountHandler) List(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Get returns a single account by ID.
// GET /api/v1/accounts/{id}
func (h *AccountHandler) Get(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Create creates a new account.
// POST /api/v1/accounts
func (h *AccountHandler) Create(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Update replaces account data.
// PUT /api/v1/accounts/{id}
func (h *AccountHandler) Update(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Delete removes an account.
// DELETE /api/v1/accounts/{id}
func (h *AccountHandler) Delete(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}
