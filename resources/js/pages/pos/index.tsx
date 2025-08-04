import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimpleSelect } from '@/components/ui/select';

interface Product {
    id: number;
    barcode: string;
    name: string;
    category: string;
    selling_price: number;
    stock: number;
    is_low_stock: boolean;
}

interface CartItem extends Product {
    quantity: number;
    subtotal: number;
}

interface Transaction {
    id: number;
    transaction_code: string;
    subtotal: string;
    discount: string;
    total_amount: string;
    amount_paid: string;
    change_amount: string;
    created_at: string;
    user: {
        name: string;
    };
    items: Array<{
        quantity: number;
        price: string;
        subtotal: string;
        product: {
            name: string;
        };
    }>;
}



export default function PosIndex() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [discount, setDiscount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus search input
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    // Search products
    const searchProducts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/pos/${encodeURIComponent(query)}?q=${encodeURIComponent(query)}`);
            const products = await response.json();
            setSearchResults(products);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchProducts(query);
    };

    // Handle barcode scan or search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchResults.length === 1) {
            addToCart(searchResults[0]);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    // Add product to cart
    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                alert(`Stok ${product.name} tidak mencukupi!`);
                return;
            }
            updateCartQuantity(product.id, existingItem.quantity + 1);
        } else {
            const cartItem: CartItem = {
                ...product,
                quantity: 1,
                subtotal: product.selling_price
            };
            setCart([...cart, cartItem]);
        }
        
        setSearchQuery('');
        setSearchResults([]);
        searchInputRef.current?.focus();
    };

    // Update cart item quantity
    const updateCartQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(cart.map(item => {
            if (item.id === productId) {
                const product = searchResults.find(p => p.id === productId) || item;
                if (newQuantity > product.stock) {
                    alert(`Stok ${item.name} tidak mencukupi!`);
                    return item;
                }
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal: item.selling_price * newQuantity
                };
            }
            return item;
        }));
    };

    // Remove item from cart
    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
        setAmountPaid('');
        setDiscount('');
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = parseFloat(discount) || 0;
    const total = subtotal - discountAmount;
    const change = parseFloat(amountPaid) - total;

    // Process transaction
    const processTransaction = async () => {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }

        if (parseFloat(amountPaid) < total) {
            alert('Jumlah pembayaran kurang!');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch('/pos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity
                    })),
                    payment_method: paymentMethod,
                    amount_paid: parseFloat(amountPaid),
                    discount: discountAmount
                })
            });

            const result = await response.json();
            
            if (result.success) {
                setLastTransaction(result.transaction);
                setShowReceipt(true);
                clearCart();
                alert('Transaksi berhasil diproses!');
            } else {
                alert(result.message || 'Transaksi gagal!');
            }
        } catch (error) {
            console.error('Transaction error:', error);
            alert('Terjadi kesalahan saat memproses transaksi!');
        } finally {
            setIsProcessing(false);
        }
    };

    // Print receipt
    const printReceipt = () => {
        window.print();
    };

    return (
        <AppShell>
            <Head title="Point of Sale (POS)" />
            
            <div className="flex h-screen bg-gray-50">
                {/* Left Panel - Product Search & Cart */}
                <div className="flex-1 flex flex-col">
                    {/* Search Bar */}
                    <div className="bg-white p-4 border-b">
                        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                            <div className="flex-1">
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Scan barcode atau cari produk..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="text-lg"
                                />
                            </div>
                            <Button type="submit" disabled={isSearching}>
                                {isSearching ? '🔍' : '📷'} Cari
                            </Button>
                        </form>
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                {searchResults.map(product => (
                                    <div
                                        key={product.id}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {product.category} • {product.barcode}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">Rp {product.selling_price.toLocaleString()}</div>
                                                <div className="text-sm">
                                                    Stok: {product.stock}
                                                    {product.is_low_stock && (
                                                        <Badge variant="destructive" className="ml-1">Low</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <h2 className="text-lg font-semibold mb-4">Keranjang Belanja ({cart.length} item)</h2>
                        
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <div className="text-4xl mb-4">🛒</div>
                                <p>Keranjang belanja kosong</p>
                                <p className="text-sm">Scan atau cari produk untuk menambahkan ke keranjang</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {cart.map(item => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        Rp {item.selling_price.toLocaleString()} × {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-12 text-center">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-right font-bold mt-2">
                                                Rp {item.subtotal.toLocaleString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Payment */}
                <div className="w-80 bg-white border-l flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Pembayaran</h2>
                    </div>
                    
                    <div className="flex-1 p-4 space-y-4">
                        {/* Totals */}
                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>Rp {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Diskon:</span>
                                    <span>Rp {discountAmount.toLocaleString()}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>Rp {total.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Form */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                                <SimpleSelect value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <option value="cash">💰 Tunai</option>
                                    <option value="card">💳 Kartu</option>
                                    <option value="other">📱 Lainnya</option>
                                </SimpleSelect>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Diskon (Rp)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    min="0"
                                    max={subtotal}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Jumlah Bayar</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    min={total}
                                    className="text-lg"
                                />
                            </div>

                            {amountPaid && parseFloat(amountPaid) >= total && (
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="text-sm text-green-600">Kembalian:</div>
                                    <div className="text-lg font-bold text-green-700">
                                        Rp {change.toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t space-y-2">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={processTransaction}
                            disabled={cart.length === 0 || parseFloat(amountPaid) < total || isProcessing}
                        >
                            {isProcessing ? '⏳ Memproses...' : '💳 Proses Pembayaran'}
                        </Button>
                        
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={clearCart}
                                disabled={cart.length === 0}
                            >
                                🗑️ Clear
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setAmountPaid(total.toString())}
                                disabled={cart.length === 0}
                            >
                                💰 Pas
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && lastTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold">Struk Penjualan</h3>
                            <p className="text-sm text-gray-600">{lastTransaction.transaction_code}</p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Kasir:</span>
                                <span>{lastTransaction.user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tanggal:</span>
                                <span>{new Date(lastTransaction.created_at).toLocaleString()}</span>
                            </div>
                            <hr className="my-2" />
                            
                            {lastTransaction.items.map((item, index: number) => (
                                <div key={index}>
                                    <div className="font-medium">{item.product.name}</div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{item.quantity} × Rp {parseFloat(item.price).toLocaleString()}</span>
                                        <span>Rp {parseFloat(item.subtotal).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                            
                            <hr className="my-2" />
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>Rp {parseFloat(lastTransaction.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Diskon:</span>
                                <span>Rp {parseFloat(lastTransaction.discount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>Rp {parseFloat(lastTransaction.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Bayar:</span>
                                <span>Rp {parseFloat(lastTransaction.amount_paid).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Kembalian:</span>
                                <span>Rp {parseFloat(lastTransaction.change_amount).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-6">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={printReceipt}
                            >
                                🖨️ Print
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => setShowReceipt(false)}
                            >
                                ✓ Selesai
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}