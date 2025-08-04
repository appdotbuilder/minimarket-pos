import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
    id: number;
    name: string;
    stock: number;
    minimum_stock: number;
    category: {
        name: string;
    };
}

interface Transaction {
    id: number;
    transaction_code: string;
    total_amount: string;
    payment_method: string;
    created_at: string;
    user: {
        name: string;
    };
    items: Array<{
        quantity: number;
        product: {
            name: string;
        };
    }>;
}

interface Props {
    stats: {
        total_products: number;
        low_stock_products: number;
        total_transactions: number;
        daily_sales: string;
    };
    recent_transactions: Transaction[];
    low_stock_products: Product[];
    top_products: Array<{
        id: number;
        name: string;
        total_sold: number;
    }>;
    sales_chart: Array<{
        date: string;
        total: string;
    }>;
    user_role: string;
    [key: string]: unknown;
}

export default function Dashboard({
    stats,
    recent_transactions,
    low_stock_products,
    top_products,
    sales_chart,
    user_role
}: Props) {
    const formatCurrency = (amount: string | number) => {
        return `Rp ${parseFloat(amount.toString()).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID');
    };

    return (
        <AppShell>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard</h1>
                        <p className="text-gray-600">Selamat datang di sistem Point of Sale</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/pos">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                🛒 Buka POS
                            </Button>
                        </Link>
                        {user_role === 'admin' && (
                            <Link href="/products">
                                <Button variant="outline" size="lg">
                                    📦 Kelola Produk
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                            <span className="text-2xl">📦</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <p className="text-xs text-muted-foreground">
                                Produk terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                            <span className="text-2xl">⚠️</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.low_stock_products}</div>
                            <p className="text-xs text-muted-foreground">
                                Produk perlu restok
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transaksi Hari Ini</CardTitle>
                            <span className="text-2xl">🧾</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_transactions}</div>
                            <p className="text-xs text-muted-foreground">
                                Transaksi berhasil
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Penjualan Hari Ini</CardTitle>
                            <span className="text-2xl">💰</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.daily_sales)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total penjualan hari ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                🧾 Transaksi Terbaru
                            </CardTitle>
                            <CardDescription>10 transaksi terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_transactions.length > 0 ? (
                                    recent_transactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{transaction.transaction_code}</div>
                                                <div className="text-sm text-gray-600">
                                                    {transaction.user.name} • {formatDate(transaction.created_at)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {transaction.items.length} item(s)
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{formatCurrency(transaction.total_amount)}</div>
                                                <Badge variant={transaction.payment_method === 'cash' ? 'default' : 'secondary'}>
                                                    {transaction.payment_method === 'cash' ? '💰 Tunai' : 
                                                     transaction.payment_method === 'card' ? '💳 Kartu' : '📱 Lainnya'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <div className="text-4xl mb-2">📝</div>
                                        <p>Belum ada transaksi hari ini</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Low Stock Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                ⚠️ Peringatan Stok Rendah
                            </CardTitle>
                            <CardDescription>Produk yang perlu direstok</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {low_stock_products.length > 0 ? (
                                    low_stock_products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-600">{product.category.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="destructive">
                                                    {product.stock} / {product.minimum_stock}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <div className="text-4xl mb-2">✅</div>
                                        <p>Semua produk stoknya aman</p>
                                    </div>
                                )}
                            </div>
                            {user_role === 'admin' && low_stock_products.length > 0 && (
                                <div className="mt-4">
                                    <Link href="/products?stock_status=low">
                                        <Button variant="outline" className="w-full">
                                            Lihat Semua Produk Stok Rendah
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                🏆 Produk Terlaris Minggu Ini
                            </CardTitle>
                            <CardDescription>Top 5 produk dengan penjualan tertinggi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {top_products.length > 0 ? (
                                    top_products.map((product, index) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    {index + 1}
                                                </div>
                                                <div className="font-medium">{product.name}</div>
                                            </div>
                                            <Badge variant="secondary">
                                                {product.total_sold} terjual
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <div className="text-4xl mb-2">📊</div>
                                        <p>Belum ada data penjualan minggu ini</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📈 Grafik Penjualan 7 Hari Terakhir
                            </CardTitle>
                            <CardDescription>Trend penjualan harian</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {sales_chart.map((day, index) => {
                                    const amount = parseFloat(day.total);
                                    const maxAmount = Math.max(...sales_chart.map(d => parseFloat(d.total)));
                                    const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                                    
                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{new Date(day.date).toLocaleDateString('id-ID', { 
                                                    weekday: 'short', 
                                                    day: 'numeric', 
                                                    month: 'short' 
                                                })}</span>
                                                <span className="font-medium">{formatCurrency(day.total)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>🚀 Aksi Cepat</CardTitle>
                        <CardDescription>Fitur yang sering digunakan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/pos">
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                    <span className="text-2xl mb-1">🛒</span>
                                    <span className="text-sm">POS System</span>
                                </Button>
                            </Link>
                            
                            {user_role === 'admin' && (
                                <>
                                    <Link href="/products">
                                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                            <span className="text-2xl mb-1">📦</span>
                                            <span className="text-sm">Kelola Produk</span>
                                        </Button>
                                    </Link>
                                    
                                    <Link href="/categories">
                                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                            <span className="text-2xl mb-1">🏷️</span>
                                            <span className="text-sm">Kategori</span>
                                        </Button>
                                    </Link>
                                    
                                    <Link href="/reports">
                                        <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                            <span className="text-2xl mb-1">📊</span>
                                            <span className="text-sm">Laporan</span>
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}