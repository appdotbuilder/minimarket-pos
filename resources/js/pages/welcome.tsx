import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Minimarket POS System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-indigo-600">
                                    🏪 MiniPOS
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-600 hover:text-gray-900 font-medium"
                                        >
                                            Masuk
                                        </Link>
                                        <Link href="/register">
                                            <Button>Daftar</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Sistem POS</span>
                            <span className="block text-indigo-600">untuk Minimarket</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Solusi lengkap untuk mengelola penjualan, inventaris, dan laporan minimarket Anda. 
                            Dengan antarmuka yang mudah digunakan dan fitur-fitur canggih.
                        </p>
                        <div className="mt-8 flex justify-center">
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button size="lg" className="text-lg px-8 py-4">
                                        Buka Dashboard 📊
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link href="/login">
                                        <Button size="lg" className="text-lg px-8 py-4">
                                            Masuk ke Sistem 🔐
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                            Daftar Gratis
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Fitur Lengkap untuk Bisnis Anda
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Semua yang Anda butuhkan dalam satu platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* POS Interface */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">🛒</span>
                                </div>
                                <CardTitle>Antarmuka POS</CardTitle>
                                <CardDescription>
                                    Interface kasir yang mudah digunakan dengan pemindaian barcode
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Pemindaian barcode otomatis</li>
                                    <li>✓ Pencarian produk instan</li>
                                    <li>✓ Multiple metode pembayaran</li>
                                    <li>✓ Cetak struk otomatis</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Inventory Management */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <CardTitle>Manajemen Inventaris</CardTitle>
                                <CardDescription>
                                    Kelola stok produk dengan sistem peringatan otomatis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Tracking stok real-time</li>
                                    <li>✓ Peringatan stok rendah</li>
                                    <li>✓ Riwayat pergerakan stok</li>
                                    <li>✓ Manajemen kategori produk</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Reports & Analytics */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <CardTitle>Laporan & Analisis</CardTitle>
                                <CardDescription>
                                    Dashboard lengkap dengan laporan penjualan dan analisis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Dashboard penjualan harian</li>
                                    <li>✓ Laporan produk terlaris</li>
                                    <li>✓ Grafik penjualan</li>
                                    <li>✓ Export data ke PDF/Excel</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* User Management */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <CardTitle>Manajemen Pengguna</CardTitle>
                                <CardDescription>
                                    Sistem role-based dengan hak akses berbeda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Role Admin & Kasir</li>
                                    <li>✓ Kontrol akses fitur</li>
                                    <li>✓ Tracking aktivitas user</li>
                                    <li>✓ Sistem login aman</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">🔒</span>
                                </div>
                                <CardTitle>Keamanan Data</CardTitle>
                                <CardDescription>
                                    Sistem keamanan berlapis untuk melindungi data bisnis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Enkripsi data sensitif</li>
                                    <li>✓ Backup otomatis</li>
                                    <li>✓ Audit trail lengkap</li>
                                    <li>✓ Session management</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <CardTitle>Mudah Digunakan</CardTitle>
                                <CardDescription>
                                    Interface intuitif yang dapat dipelajari dengan cepat
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Design responsif</li>
                                    <li>✓ Shortcut keyboard</li>
                                    <li>✓ Training mudah</li>
                                    <li>✓ Support 24/7</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-indigo-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white">
                                Siap Memulai Bisnis yang Lebih Efisien?
                            </h2>
                            <p className="mt-4 text-lg text-indigo-200">
                                Bergabunglah dengan ribuan minimarket yang sudah menggunakan sistem kami
                            </p>
                            <div className="mt-8">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                                            Mulai Sekarang 🚀
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                                            Daftar Gratis Sekarang 🚀
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center text-gray-400">
                            <p>&copy; 2024 MiniPOS. Sistem Point of Sale untuk Minimarket.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}