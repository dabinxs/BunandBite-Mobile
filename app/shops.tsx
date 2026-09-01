import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { BRANCHES } from '@/lib/branches';
import { BrandHeader, Screen, SectionTitle } from '@/components/ui';

export default function ShopsScreen() {
  const colors = useColors();
  return <Screen>
    <BrandHeader subtitle="Find a Bun & Bite near you." />
    <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>COME SAY HI</Text><Text style={[styles.title, { color: colors.foreground }]}>Our shops</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>Choose a nearby shop for pickup or find the location that works best for you.</Text></View>
    <View style={[styles.map, { backgroundColor: colors.secondary, borderColor: colors.border }]}><View style={[styles.mapCircle, { borderColor: colors.primary + '55' }]}><View style={[styles.mapPin, { backgroundColor: colors.primary }]}><Ionicons name="location" size={20} color={colors.primaryForeground} /></View></View><Text style={[styles.mapText, { color: colors.mutedForeground }]}>Bun & Bite locations</Text></View>
    <SectionTitle eyebrow="LOCATIONS" title="Pick a shop" />
    <View style={{ gap: 10 }}>{BRANCHES.map((shop) => <Pressable key={shop.id} onPress={() => router.push({ pathname: '/pickup' })} style={({ pressed }) => [styles.shop, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? .85 : 1 }]}>
      <View style={[styles.shopIcon, { backgroundColor: colors.secondary }]}><Ionicons name="storefront-outline" size={20} color={colors.accent} /></View>
      <View style={{ flex: 1 }}><Text style={[styles.shopName, { color: colors.foreground }]}>{shop.name}</Text><Text style={[styles.address, { color: colors.mutedForeground }]}>{shop.address}</Text><Text style={[styles.time, { color: colors.primary }]}>{shop.prepTime} pickup · {shop.hours}</Text></View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>)}</View>
  </Screen>;
}

const styles = StyleSheet.create({
  heading: { paddingTop: 20 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, marginTop: 5 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 8 },
  map: { height: 150, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 22, overflow: 'hidden' },
  mapCircle: { width: 92, height: 92, borderRadius: 46, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  mapPin: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  mapText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 9 },
  shop: { minHeight: 78, borderRadius: 18, borderWidth: 1, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  shopIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  shopName: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  address: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  time: { fontFamily: 'Inter_600SemiBold', fontSize: 10, marginTop: 4 },
});