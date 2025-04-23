import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-12">
      <div className="w-full max-w-md">
        <div className="card p-8 space-y-4">
          <div className="text-center">
            <h1 className="title-lg mb-2">Welcome Back</h1>
            <p className="text-[--muted]">Sign in to your account to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
