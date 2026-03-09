import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    // TODO: wrap with <ProtectedRoute> once auth store is implemented
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
