package handlers

import (
	"net/http"
)

// TransactionHandler handles HTTP requests for the /transactions resource.
// TODO: inject TransactionService when business logic is implemented.
type TransactionHandler struct{}

// NewTransactionHandler creates a new TransactionHandler.
func NewTransactionHandler() *TransactionHandler {
	return &TransactionHandler{}
}

// List returns all transactions for the authenticated user.
// GET /api/v1/transactions
func (h *TransactionHandler) List(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Get returns a single transaction by ID.
// GET /api/v1/transactions/{id}
func (h *TransactionHandler) Get(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Create records a new transaction.
// POST /api/v1/transactions
func (h *TransactionHandler) Create(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Update replaces transaction data.
// PUT /api/v1/transactions/{id}
func (h *TransactionHandler) Update(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}

// Delete removes a transaction.
// DELETE /api/v1/transactions/{id}
func (h *TransactionHandler) Delete(w http.ResponseWriter, r *http.Request) {
	// TODO: implement
	w.WriteHeader(http.StatusNotImplemented)
}
