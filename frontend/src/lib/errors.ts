import { getApiError } from '@/api/client';

export function getErrorMessage(error: unknown): string {
  const apiError = getApiError(error);
  if (apiError?.error) {
    return apiError.error;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Something went wrong.';
}
