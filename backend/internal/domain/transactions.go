package domain

import (
	"time"
)

// TransactionType classifies the direction of money movement.
type TransactionType string

const (
	TransactionTypeIncome   TransactionType = "income"
	TransactionTypeExpense  TransactionType = "expense"
	TransactionTypeTransfer TransactionType = "transfer"
)

// Transaction records a single money movement linked to one or two accounts.
type Transaction struct {
	ID              int64           `json:"id"`
	UserID          int64           `json:"user_id"`
	AccountID       int64           `json:"account_id"`
	ToAccountID     *int64          `json:"to_account_id,omitempty"` // set for transfers
	Type            TransactionType `json:"type"`
	Amount          float64         `json:"amount"`
	Currency        string          `json:"currency"`
	CategoryID      *int64          `json:"category_id,omitempty"`
	Note            string          `json:"note,omitempty"`
	TransactedAt    time.Time       `json:"transacted_at"`
	CreatedAt       time.Time       `json:"created_at"`
}
