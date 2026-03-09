package httpsrv

import (
	"encoding/json"
	"net/http"
)

// errorResponse is the canonical JSON error envelope.
//
//	{"error": "human readable message", "code": "MACHINE_CODE"}
type errorResponse struct {
	Error string `json:"error"`
	Code  string `json:"code,omitempty"`
}

// WriteError writes a JSON error response with the given HTTP status code.
func WriteError(w http.ResponseWriter, status int, message, code string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(errorResponse{
		Error: message,
		Code:  code,
	})
}

// WriteJSON serialises v as JSON and writes it with the given HTTP status code.
func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// ── common error shortcuts ────────────────────────────────────────────────────

func ErrBadRequest(w http.ResponseWriter, message string) {
	WriteError(w, http.StatusBadRequest, message, "BAD_REQUEST")
}

func ErrUnauthorized(w http.ResponseWriter) {
	WriteError(w, http.StatusUnauthorized, "unauthorized", "UNAUTHORIZED")
}

func ErrForbidden(w http.ResponseWriter) {
	WriteError(w, http.StatusForbidden, "forbidden", "FORBIDDEN")
}

func ErrNotFound(w http.ResponseWriter, resource string) {
	WriteError(w, http.StatusNotFound, resource+" not found", "NOT_FOUND")
}

func ErrInternal(w http.ResponseWriter) {
	WriteError(w, http.StatusInternalServerError, "internal server error", "INTERNAL_ERROR")
}
