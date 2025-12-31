import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout
            heading="Welcome Back"
            subheading="Manage your high-speed connection seamlessly."
        >
            <LoginForm />
        </AuthLayout>
    );
}
