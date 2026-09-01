import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PRODUCTS } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { BrandHeader, ProductCard, Screen, SectionTitle } from '@/components/ui';

const HERO_RATINGS = [
  ['4.9', '5K', '3K+'], ['4.8', '4.2K', '2.7K+'], ['4.8', '4.5K', '3.1K+'], ['4.9', '5.5K', '3.5K+'],
  ['4.8', '4.8K', '2.9K+'], ['4.7', '3.6K', '2.1K+'], ['4.9', '6K', '4K+'], ['4.8', '4.1K', '2.8K+'],
];

const features = [
  { title: 'Deals', description: 'Enjoy our best offers', image: require('../../assets/images/deals-icon.png'), route: '/deals' },
  { title: 'Menu', description: 'Explore our delicious menu', image: require('../../assets/images/menu-icon.png'), route: '/menu' },
  { title: 'Pick up', description: 'Fast & easy pickup', image: require('../../assets/images/pickup-icon.png'), route: '/pickup' },
  { title: 'Shops', description: 'Find a location near you', image: require('../../assets/images/shops-icon.png'), route: '/shops' },
];

export default function HomeScreen() {
  const colors = useColors();
  const { orders } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const heroProduct = PRODUCTS[activeIndex] ?? PRODUCTS[0];

  const nextHero = useCallback(() => setActiveIndex((index) => (index + 1) % Math.min(8, PRODUCTS.length)), []);
  useEffect(() => {
    const timer = setInterval(nextHero, 3000);
    return () => clearInterval(timer);
  }, [nextHero]);

  return <Screen>
    <BrandHeader subtitle="Serving bold flavor since day one." />

    <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.welcomeGlow, { backgroundColor: colors.primary + '18' }]} />
      <View style={styles.welcomeCopy}>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} style={[styles.welcomeTitle, { color: colors.primary }]}>WELCOME</Text>
        <View style={[styles.welcomeRule, { backgroundColor: colors.accent }]} />
        <Text style={[styles.welcomeBody, { color: colors.mutedForeground }]}>Serving juicy flame-grilled burgers packed with bold flavor, fresh ingredients, and satisfying bites in every stack.</Text>
        <Pressable testID="home-explore" onPress={() => { Haptics.selectionAsync(); router.push('/menu'); }} style={[styles.exploreButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.exploreText, { color: colors.primaryForeground }]}>Explore</Text>
          <Feather name="arrow-right" size={15} color={colors.primaryForeground} />
        </Pressable>
      </View>
      <View style={styles.heroProduct}>
        <Image source={heroProduct.image} style={styles.heroImage} />
        <View style={[styles.ratingPanel, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {[
            { icon: 'star' as const, value: HERO_RATINGS[activeIndex]?.[0], label: 'Average Rating', color: colors.accent },
            { icon: 'people-outline' as const, value: HERO_RATINGS[activeIndex]?.[1], label: 'Happy Customers', color: colors.primary },
            { icon: 'heart-outline' as const, value: HERO_RATINGS[activeIndex]?.[2], label: 'Customer Favorites', color: colors.primary },
          ].map((stat, index) => <View key={stat.label} style={[styles.stat, index > 0 && { borderLeftWidth: 1, borderLeftColor: colors.border }]}>
            <View style={styles.statTop}><Ionicons name={stat.icon} size={13} color={stat.color} /><Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text></View>
            <Text numberOfLines={1} style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
          </View>)}
        </View>
      </View>
      <View style={styles.dots}>{PRODUCTS.slice(0, 8).map((_, index) => <Pressable key={index} onPress={() => setActiveIndex(index)} style={[styles.dot, { backgroundColor: index === activeIndex ? colors.primary : colors.border, width: index === activeIndex ? 18 : 5 }]} />)}</View>
    </View>

    <Pressable onPress={() => router.push('/deals')} style={({ pressed }) => [styles.flashCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? .85 : 1 }]}>
      <View style={styles.flashCopy}>
        <Text style={[styles.flashSave, { color: colors.foreground }]}>Save <Text style={{ color: colors.primary }}>45%</Text></Text>
        <Text style={[styles.flashTitle, { color: colors.foreground }]}>Flash Deals</Text>
        <Text style={[styles.flashSub, { color: colors.mutedForeground }]}>Limited time offers</Text>
      </View>
      <Image source={require('../../assets/images/flash-deals.png')} style={styles.flashImage} />
    </Pressable>

    <View style={styles.featureGrid}>{features.map((feature) => <Pressable key={feature.title} onPress={() => router.push(feature.route as any)} style={({ pressed }) => [styles.featureCard, { backgroundColor: colors.card, borderColor: colors.primary + '55', opacity: pressed ? .85 : 1 }]}>
      <View style={styles.featureCopy}><Text style={[styles.featureTitle, { color: colors.foreground }]}>{feature.title}</Text><Text numberOfLines={2} style={[styles.featureDescription, { color: colors.mutedForeground }]}>{feature.description}</Text></View>
      <Image source={feature.image} style={styles.featureImage} />
    </Pressable>)}</View>

    {orders[0] && <><SectionTitle eyebrow="WELCOME BACK" title="Quick reorder" action="View orders" onAction={() => router.push('/orders')} /><Pressable onPress={() => router.push('/orders')} style={[styles.reorder, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.reorderIcon, { backgroundColor: colors.primary }]}><Ionicons name="repeat" size={19} color={colors.primaryForeground} /></View>
      <View style={{ flex: 1 }}><Text style={[styles.reorderName, { color: colors.foreground }]}>{orders[0].items[0]?.name ?? 'Your last order'}</Text><Text style={[styles.reorderSub, { color: colors.mutedForeground }]}>Order {orders[0].id} · ${orders[0].total.toFixed(2)}</Text></View>
      <Text style={[styles.reorderAction, { color: colors.primary }]}>REORDER</Text>
    </Pressable></>}

    <SectionTitle eyebrow="SHOWING MENU" title="Featured Items" action="Full menu" onAction={() => router.push('/menu')} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRail}>{PRODUCTS.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} compact onPress={() => router.push(`/product/${product.id}`)} />)}</ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  welcomeCard: { minHeight: 322, borderRadius: 28, borderWidth: 1, overflow: 'hidden', marginTop: 8, position: 'relative' },
  welcomeGlow: { position: 'absolute', width: 260, height: 260, borderRadius: 130, right: -70, top: 28 },
  welcomeCopy: { padding: 23, width: '51%', zIndex: 2 },
  welcomeTitle: { width: 190, fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: 1.2, lineHeight: 28 },
  welcomeRule: { width: 42, height: 2, borderRadius: 1, marginTop: 11, marginBottom: 12 },
  welcomeBody: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 },
  exploreButton: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 17, minHeight: 40, marginTop: 17 },
  exploreText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  heroProduct: { position: 'absolute', right: -14, top: 31, width: '62%', height: 237, alignItems: 'center' },
  heroImage: { width: '100%', height: 192, resizeMode: 'contain' },
  ratingPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, borderWidth: 1, borderRadius: 14, paddingVertical: 8, flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 7, marginTop: 2, textAlign: 'center' },
  dots: { position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { height: 4, borderRadius: 2 },
  flashCard: { minHeight: 144, borderRadius: 28, borderWidth: 1, overflow: 'hidden', marginTop: 14, padding: 21, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flashCopy: { flex: 1, paddingRight: 8 },
  flashSave: { fontFamily: 'Inter_700Bold', fontSize: 27, lineHeight: 31 },
  flashTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 13 },
  flashSub: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 5 },
  flashImage: { width: 100, height: 100, resizeMode: 'contain' },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  featureCard: { width: '48.2%', height: 91, borderRadius: 20, borderWidth: 1, padding: 10, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featureCopy: { flex: 1, zIndex: 1 },
  featureTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  featureDescription: { fontFamily: 'Inter_400Regular', fontSize: 9, lineHeight: 12, marginTop: 4 },
  featureImage: { width: 66, height: 66, resizeMode: 'contain', marginRight: -2 },
  reorder: { minHeight: 70, borderRadius: 18, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  reorderIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  reorderName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  reorderSub: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  reorderAction: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: .7 },
  productRail: { gap: 12, paddingBottom: 4 },
});