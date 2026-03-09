package postgres

import (
	"context"

	"github.com/yourusername/fintracker-backend/internal/domain"
)

// AccountRepo is the PostgreSQL implementation of the account repository.
// TODO: inject *sql.DB / pgx pool when database layer is wired up.
type AccountRepo struct{}

// NewAccountRepo creates a new AccountRepo.
func NewAccountRepo() *AccountRepo {
	return &AccountRepo{}
}

// GetByID returns a single account by its primary key.
func (r *AccountRepo) GetByID(ctx context.Context, id int64) (*domain.Account, error) {
	// TODO: implement
	return nil, nil
}

// ListByUser returns all accounts belonging to a user.
func (r *AccountRepo) ListByUser(ctx context.Context, userID int64) ([]domain.Account, error) {
	// TODO: implement
	return nil, nil
}

// Create inserts a new account and returns the created record.
func (r *AccountRepo) Create(ctx context.Context, a *domain.Account) (*domain.Account, error) {
	// TODO: implement
	return nil, nil
}

// Update persists changes to an existing account.
func (r *AccountRepo) Update(ctx context.Context, a *domain.Account) (*domain.Account, error) {
	// TODO: implement
	return nil, nil
}

// Delete removes an account by ID.
func (r *AccountRepo) Delete(ctx context.Context, id int64) error {
	// TODO: implement
	return nil
}
