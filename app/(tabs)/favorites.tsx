import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PRODUCTS } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { BrandHeader, ProductCard, Screen, SectionTitle } from '@/components/ui';
export default function FavoritesScreen() {
  const colors = useColors(); const { favorites } = useStore(); const products = PRODUCTS.filter((p) => favorites.includes(p.id));
  return <Screen><BrandHeader subtitle="Your saved cravings."/><SectionTitle eyebrow="YOUR PICKS" title="Favorites" />{products.length ? <View style={styles.grid}>{products.map((p) => <View key={p.id} style={styles.item}><ProductCard product={p} onPress={() => router.push(`/product/${p.id}`)}/></View>)}</View> : <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: colors.secondary }]}><Feather name="heart" size={25} color={colors.primary}/></View><Text style={[styles.title, { color: colors.foreground }]}>Save room for favorites</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>Tap the heart on any menu item and it will show up here.</Text></View>}</Screen>;
}
const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, item: { width: '48.2%' }, empty: { borderRadius: 22, borderWidth: 1, alignItems: 'center', padding: 33, marginTop: 28 }, icon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, title: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 17 }, copy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 7 } });