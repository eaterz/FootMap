import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
                                  status,
                                  canResetPassword,
                                  canRegister,
                              }: LoginProps) {
    return (
        <>
            <Head title="Log in">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">


                {/* Main Content */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                        <div className="w-full max-w-md">
                            {/* Card */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                {/* Header */}
                                <div className="mb-8 text-center">
                                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                        Welcome Back
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Enter your credentials to access your account
                                    </p>
                                </div>

                                {/* Status Message */}
                                {status && (
                                    <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                        {status}
                                    </div>
                                )}

                                {/* Form */}
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                    className="flex flex-col gap-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-5">
                                                {/* Email Field */}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Email address
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="email@example.com"
                                                        className="h-11"
                                                    />
                                                    <InputError message={errors.email} />
                                                </div>

                                                {/* Password Field */}
                                                <div className="grid gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Password
                                                        </Label>
                                                        {canResetPassword && (
                                                            <TextLink
                                                                href={request()}
                                                                className="text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                                tabIndex={5}
                                                            >
                                                                Forgot password?
                                                            </TextLink>
                                                        )}
                                                    </div>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder="Enter your password"
                                                        className="h-11"
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>


                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    className="mt-2 h-11 w-full bg-green-600 text-base font-medium hover:bg-green-700"
                                                    tabIndex={4}
                                                    disabled={processing}
                                                    data-test="login-button"
                                                >
                                                    {processing && <Spinner />}
                                                    Log in
                                                </Button>
                                            </div>

                                            {/* Sign Up Link */}
                                            {canRegister && (
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Don't have an account?{' '}
                                                        <TextLink
                                                            href={register()}
                                                            tabIndex={5}
                                                            className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            Sign up for free
                                                        </TextLink>
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Form>
                            </div>

                            {/* Footer Text */}
                            <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
                                By logging in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
