import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PRODUCTS } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { BrandHeader, PrimaryButton, ProductCard, Screen, SectionTitle } from '@/components/ui';

export default function DealsScreen() {
  const colors = useColors();
  const { setVoucher } = useStore();
  const dealProducts = PRODUCTS.filter((product) => product.oldPrice);

  const browseDeals = () => {
    setVoucher('BITE45');
    router.push('/menu');
  };

  return <Screen>
    <BrandHeader subtitle="Limited-time offers, stacked fresh." />
    <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={require('../assets/images/flash-deals.png')} style={styles.heroImage} />
      <View style={styles.heroCopy}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>LIMITED TIME</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Flash Deals</Text>
        <Text style={[styles.copy, { color: colors.mutedForeground }]}>Save 45% on your next Bun & Bite order with code BITE45.</Text>
        <Pressable onPress={browseDeals} style={[styles.voucher, { backgroundColor: colors.secondary, borderColor: colors.primary }]}>
          <Ionicons name="pricetag-outline" size={15} color={colors.accent} />
          <Text style={[styles.voucherText, { color: colors.foreground }]}>BITE45</Text>
          <Feather name="arrow-right" size={15} color={colors.primary} />
        </Pressable>
      </View>
    </View>
    <PrimaryButton label="Browse discounted menu" onPress={browseDeals} icon="arrow-right" />
    <SectionTitle eyebrow="TODAY'S OFFERS" title="Save on every craving" />
    <View>{dealProducts.map((product) => <ProductCard key={product.id} product={product} onPress={() => router.push(`/product/${product.id}`)} />)}</View>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { minHeight: 190, borderWidth: 1, borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', marginTop: 8, marginBottom: 14 },
  heroImage: { width: 112, height: 112, resizeMode: 'contain' },
  heroCopy: { flex: 1, paddingLeft: 10 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26, marginTop: 5 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 7 },
  voucher: { borderWidth: 1, borderRadius: 12, minHeight: 34, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', marginTop: 12 },
  voucherText: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1 },
});