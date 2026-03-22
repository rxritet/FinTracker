'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { login } from '@/api/auth';
import { getApiError } from '@/api/client';
import { loginSchema, type LoginValues } from '@/lib/validators';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
  });

  useEffect(() => {
    if (hydrated && token) {
      router.replace('/dashboard');
    }
  }, [hydrated, router, token]);

  const onSubmit = async (values: LoginValues) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      setToken(response.token);
      router.replace('/dashboard');
    } catch (error: unknown) {
      const apiError = getApiError(error);
      setError('root', {
        message: apiError?.error ?? 'Unable to login right now',
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          <LogIn className="h-5 w-5 text-brand-600" />
          <h1 className="text-2xl font-bold text-slate-900">Login to FinTracker</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="name@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {errors.root?.message ? (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errors.root.message}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </section>
    </main>
  );
}
