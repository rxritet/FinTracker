package domain

import (
	"time"
)

// AccountType represents the kind of a financial account.
type AccountType string

const (
	AccountTypeChecking AccountType = "checking"
	AccountTypeSavings  AccountType = "savings"
	AccountTypeCash     AccountType = "cash"
	AccountTypeCredit   AccountType = "credit"
)

// Account represents a financial account owned by a user.
type Account struct {
	ID        int64       `json:"id"`
	UserID    int64       `json:"user_id"`
	Name      string      `json:"name"`
	Type      AccountType `json:"type"`
	Currency  string      `json:"currency"` // ISO 4217, e.g. "USD"
	Balance   float64     `json:"balance"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
}
