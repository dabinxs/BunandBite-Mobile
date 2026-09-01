import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Branch, CartItem } from './types';

export type Address = { id: string; label: string; line: string; detail?: string; isDefault?: boolean };
export type Order = { id: string; createdAt: string; items: CartItem[]; total: number; type: 'Delivery' | 'Pickup'; status: string; address?: string; payment: string; branch?: Branch };
export type User = { name: string; email: string; phone?: string };
type StoreValue = {
  ready: boolean; cart: CartItem[]; favorites: number[]; addresses: Address[]; orders: Order[]; user: User | null; voucher: string | null; selectedBranch: Branch | null; fulfilment: 'Delivery' | 'Pickup';
  addToCart: (item: Omit<CartItem, 'id'>) => void; updateCart: (id: string, qty: number) => void; removeCart: (id: string) => void;
  clearCart: () => void; toggleFavorite: (id: number) => void; saveAddress: (address: Address) => void; removeAddress: (id: string) => void;
  setUser: (user: User | null) => void; setVoucher: (voucher: string | null) => void; setSelectedBranch: (branch: Branch | null) => void; setFulfilment: (type: 'Delivery' | 'Pickup') => void; addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
};

const StoreContext = createContext<StoreValue | null>(null);
const keys = { cart: '@bnb/cart', favorites: '@bnb/favorites', addresses: '@bnb/addresses', orders: '@bnb/orders', user: '@bnb/user', voucher: '@bnb/voucher', selectedBranch: '@bnb/selected-branch', fulfilment: '@bnb/fulfilment' };
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [fulfilment, setFulfilment] = useState<'Delivery' | 'Pickup'>('Delivery');
  useEffect(() => {
    Promise.all(Object.values(keys).map((key) => AsyncStorage.getItem(key))).then((values) => {
      const parse = <T,>(value: string | null, fallback: T): T => { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } };
      setCart(parse(values[0], [])); setFavorites(parse(values[1], [])); setAddresses(parse(values[2], [])); setOrders(parse(values[3], [])); setUser(parse(values[4], null)); setVoucher(parse(values[5], null)); setSelectedBranch(parse(values[6], null)); setFulfilment(parse(values[7], 'Delivery')); setReady(true);
    });
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.cart, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.favorites, JSON.stringify(favorites)); }, [favorites, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.addresses, JSON.stringify(addresses)); }, [addresses, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.orders, JSON.stringify(orders)); }, [orders, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.user, JSON.stringify(user)); }, [user, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.voucher, JSON.stringify(voucher)); }, [voucher, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.selectedBranch, JSON.stringify(selectedBranch)); }, [selectedBranch, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem(keys.fulfilment, JSON.stringify(fulfilment)); }, [fulfilment, ready]);
  const value = useMemo<StoreValue>(() => ({
    ready, cart, favorites, addresses, orders, user, voucher, selectedBranch, fulfilment,
    addToCart: (item) => setCart((prev) => [...prev, { ...item, id: makeId() }]),
    updateCart: (id, qty) => setCart((prev) => qty < 1 ? prev.filter((item) => item.id !== id) : prev.map((item) => item.id === id ? { ...item, quantity: qty } : item)),
    removeCart: (id) => setCart((prev) => prev.filter((item) => item.id !== id)),
    clearCart: () => setCart([]),
    toggleFavorite: (id) => setFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]),
    saveAddress: (address) => setAddresses((prev) => [...prev.filter((a) => a.id !== address.id), address]),
    removeAddress: (id) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
    setUser,
    setVoucher,
    setSelectedBranch,
    setFulfilment,
    addOrder: (order) => { const result = { ...order, id: `BNB-${Math.floor(10000 + Math.random() * 89999)}`, createdAt: new Date().toISOString() }; setOrders((prev) => [result, ...prev]); return result; },
  }), [ready, cart, favorites, addresses, orders, user, voucher, selectedBranch, fulfilment]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore() { const context = useContext(StoreContext); if (!context) throw new Error('useStore must be used within StoreProvider'); return context; }