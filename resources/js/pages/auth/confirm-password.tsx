import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Form, Head, Link } from '@inertiajs/react';
import { store } from '@/routes/password/confirm';
import Layout from '@/layouts/Layout';
import { ChevronLeft } from 'lucide-react';

export default function ConfirmPassword() {
    return (
        <Layout>
            <Head title="Confirm password" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
                {/* Hero Section */}
                <div className="relative overflow-hidden py-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white"> Confirm Password </h1>
                            <p className="text-gray-600 dark:text-gray-400"> This is a secure area of the application. Please confirm your password before continuing. </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-md">
                        {/* Form Card */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <Form {...store.form()} resetOnSuccess={['password']}>
                                {({ processing, errors }) => (
                                    <div className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                autoComplete="current-password"
                                                autoFocus
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="flex items-center">
                                            <Button className="w-full" disabled={processing} data-test="confirm-password-button">
                                                {processing && <Spinner />}
                                                Confirm password
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
