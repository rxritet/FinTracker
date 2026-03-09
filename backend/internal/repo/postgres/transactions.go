package postgres

import (
	"context"

	"github.com/yourusername/fintracker-backend/internal/domain"
)

// TransactionRepo is the PostgreSQL implementation of the transaction repository.
// TODO: inject *sql.DB / pgx pool when database layer is wired up.
type TransactionRepo struct{}

// NewTransactionRepo creates a new TransactionRepo.
func NewTransactionRepo() *TransactionRepo {
	return &TransactionRepo{}
}

// GetByID returns a single transaction by its primary key.
func (r *TransactionRepo) GetByID(ctx context.Context, id int64) (*domain.Transaction, error) {
	// TODO: implement
	return nil, nil
}

// ListByUser returns all transactions belonging to a user.
func (r *TransactionRepo) ListByUser(ctx context.Context, userID int64) ([]domain.Transaction, error) {
	// TODO: implement
	return nil, nil
}

// Create inserts a new transaction and returns the created record.
func (r *TransactionRepo) Create(ctx context.Context, t *domain.Transaction) (*domain.Transaction, error) {
	// TODO: implement
	return nil, nil
}

// Update persists changes to an existing transaction.
func (r *TransactionRepo) Update(ctx context.Context, t *domain.Transaction) (*domain.Transaction, error) {
	// TODO: implement
	return nil, nil
}

// Delete removes a transaction by ID.
func (r *TransactionRepo) Delete(ctx context.Context, id int64) error {
	// TODO: implement
	return nil
}
