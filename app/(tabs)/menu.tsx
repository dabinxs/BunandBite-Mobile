import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { CATEGORIES, Category, PRODUCTS } from '@/lib/catalog';
import { getBranch } from '@/lib/branches';
import { useStore } from '@/lib/store';
import { ProductCard, Screen, BrandHeader } from '@/components/ui';

export default function MenuScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ branchId?: string; fulfilment?: string }>();
  const { selectedBranch, setSelectedBranch, setFulfilment } = useStore();
  const routeBranch = getBranch(typeof params.branchId === 'string' ? params.branchId : undefined);
  const activeBranch = routeBranch ?? selectedBranch;
  const [category, setCategory] = useState<Category>('burgers');
  const [query, setQuery] = useState('');
  const products = useMemo(() => PRODUCTS.filter((p) => p.category === category && (!query.trim() || p.name.toLowerCase().includes(query.toLowerCase()))), [category, query]);
  useEffect(() => {
    if (routeBranch) setSelectedBranch(routeBranch);
    if (params.fulfilment === 'Pickup' || params.fulfilment === 'Delivery') setFulfilment(params.fulfilment);
  }, [params.fulfilment, routeBranch, setFulfilment, setSelectedBranch]);
  return <Screen>
    <BrandHeader subtitle={activeBranch ? `${activeBranch.name} · Choose your food.` : 'Explore our delicious menu.'} />
    {activeBranch && <View style={[styles.branchBanner, { backgroundColor: colors.secondary, borderColor: colors.primary }]}><Ionicons name="storefront-outline" size={16} color={colors.primary} /><Text numberOfLines={1} style={[styles.branchBannerText, { color: colors.foreground }]}>Ordering from {activeBranch.name}</Text><Pressable onPress={() => router.push('/pickup')}><Text style={[styles.changeBranch, { color: colors.primary }]}>Change</Text></Pressable></View>}
    <Text style={[styles.eyebrow, { color: colors.primary }]}>SHOWING MENU</Text>
    <Text style={[styles.title, { color: colors.foreground }]}>Featured Items</Text>
    <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="search" size={17} color={colors.mutedForeground} />
      <TextInput testID="menu-search" value={query} onChangeText={setQuery} placeholder="Search burgers, drinks..." placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
      {query.length > 0 && <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={colors.mutedForeground} /></Pressable>}
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={styles.categoryContent}>
      {CATEGORIES.map((item) => <Pressable key={item.key} onPress={() => setCategory(item.key)} style={[styles.category, { backgroundColor: category === item.key ? colors.primary : colors.background, borderColor: category === item.key ? colors.primary : colors.border }]}><Text style={[styles.categoryText, { color: category === item.key ? colors.primaryForeground : colors.mutedForeground }]}>{item.label}</Text></Pressable>)}
    </ScrollView>
    <Text style={[styles.results, { color: colors.mutedForeground }]}>{products.length} items in {CATEGORIES.find((item) => item.key === category)?.label}</Text>
    {products.length ? <View>{products.map((product) => <ProductCard key={product.id} product={product} onPress={() => router.push(`/product/${product.id}`)} />)}</View> : <View style={[styles.empty, { borderColor: colors.border }]}><Feather name="search" size={28} color={colors.accent} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nothing in the menu</Text><Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>Try another search or browse a different category.</Text></View>}
  </Screen>;
}

const styles = StyleSheet.create({
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6, marginTop: 11, marginBottom: 5 },
  branchBanner: { minHeight: 42, borderWidth: 1, borderRadius: 13, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  branchBannerText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, flex: 1 },
  changeBranch: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -.8 },
  search: { height: 48, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9, marginTop: 18 },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14 },
  categoryRow: { overflow: 'hidden', marginTop: 15 },
  categoryContent: { gap: 8 },
  category: { paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderRadius: 22 },
  categoryText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  results: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 18, marginBottom: 12 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 20, padding: 28, alignItems: 'center', marginTop: 36 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 14 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 6 },
});