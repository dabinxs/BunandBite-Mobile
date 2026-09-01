import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Product } from '@/lib/catalog';
import { useStore } from '@/lib/store';

export function Screen({ children, scroll = true, style }: { children: ReactNode; scroll?: boolean; style?: any }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { ready } = useStore();
  if (!ready) {
    return <View style={[styles.loading, { backgroundColor: colors.background }]}>
      <Image source={require('../assets/images/icon.png')} style={styles.loadingLogo} />
      <Text style={[styles.loadingTitle, { color: colors.foreground }]}>BUN & BITE</Text>
      <View style={[styles.loadingBar, { backgroundColor: colors.secondary, width: '48%' }]} />
      <View style={[styles.loadingBar, { backgroundColor: colors.secondary, width: '78%' }]} />
    </View>;
  }
  const screenStyle = [styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }, style];
  if (!scroll) return <View style={screenStyle}>{children}</View>;
  return <ScrollView style={screenStyle} contentContainerStyle={{ paddingBottom: insets.bottom + 112 }} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

export function BrandHeader({ subtitle, cart = true }: { subtitle?: string; cart?: boolean }) {
  const colors = useColors();
  const { cart: items } = useStore();
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  return <View style={styles.header}>
    <View style={styles.brandLockup}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <View>
        <Text style={[styles.brand, { color: colors.foreground }]}>BUN & BITE</Text>
        {subtitle && <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{subtitle}</Text>}
      </View>
    </View>
    {cart && <Pressable testID="header-cart" onPress={() => { Haptics.selectionAsync(); router.push('/cart'); }} style={[styles.cartButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="cart-outline" size={21} color={colors.foreground} />
      {total > 0 && <View style={[styles.cartCount, { backgroundColor: colors.primary }]}><Text style={[styles.countText, { color: colors.primaryForeground }]}>{total}</Text></View>}
    </Pressable>}
  </View>;
}

export function SectionTitle({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHead}>
    <View>{eyebrow && <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>}<Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text></View>
    {action && <Pressable onPress={onAction} hitSlop={10}><Text style={[styles.action, { color: colors.primary }]}>{action}</Text></Pressable>}
  </View>;
}

export function PrimaryButton({ label, onPress, disabled = false, icon = 'arrow-up-right' as any }: { label: string; onPress: () => void; disabled?: boolean; icon?: any }) {
  const colors = useColors();
  return <Pressable testID={`button-${label}`} disabled={disabled} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }} style={({ pressed }) => [styles.primary, { backgroundColor: disabled ? colors.muted : colors.primary, opacity: pressed ? .86 : 1 }]}><Text style={[styles.primaryText, { color: disabled ? colors.mutedForeground : colors.primaryForeground }]}>{label}</Text>{icon && <Feather name={icon} size={18} color={disabled ? colors.mutedForeground : colors.primaryForeground} />}</Pressable>;
}

export function ProductCard({ product, compact = false, onPress }: { product: Product; compact?: boolean; onPress: () => void }) {
  const colors = useColors();
  const { favorites, toggleFavorite, addToCart } = useStore();
  const favorite = favorites.includes(product.id);
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.productCard, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? .985 : 1 }] }, compact && styles.compactCard]}>
    <View style={[styles.productImageWrap, { backgroundColor: colors.secondary }]}>
      <Image source={product.image} style={styles.productImage} />
      <View style={[styles.saveBadge, { backgroundColor: colors.primary }]}><Text style={[styles.badgeText, { color: colors.primaryForeground }]}>SAVE 20%</Text></View>
      <View style={styles.productTools}>
        <View style={[styles.rating, { backgroundColor: colors.background }]}>
          <Ionicons name="star" size={12} color={colors.accent} />
          <Text style={[styles.ratingText, { color: colors.foreground }]}>{product.rating}</Text>
          {product.reviews !== '—' && <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>({product.reviews})</Text>}
        </View>
        <Pressable testID={`favorite-${product.id}`} onPress={() => { Haptics.selectionAsync(); toggleFavorite(product.id); }} style={[styles.heart, { backgroundColor: colors.secondary }]}>
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={17} color={favorite ? colors.primary : colors.foreground} />
        </Pressable>
      </View>
      <View style={styles.productBadges}>{[product.badge].map((badge) => <View key={badge} style={[styles.categoryBadge, { backgroundColor: colors.secondary, borderColor: colors.border }]}><Text style={[styles.badgeText, { color: colors.foreground }]}>{badge}</Text></View>)}</View>
    </View>
    <View style={styles.cardInfo}>
      <View style={styles.namePriceRow}><Text numberOfLines={2} style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text><View style={styles.priceBlock}><Text style={[styles.price, { color: colors.primary }]}>$ {product.price.toFixed(2)}</Text>{product.oldPrice && <Text style={[styles.oldPrice, { color: colors.mutedForeground }]}>$ {product.oldPrice.toFixed(2)}</Text>}</View></View>
      <View style={styles.metaRow}><Text style={[styles.meta, { color: colors.mutedForeground }]}><Ionicons name="time-outline" size={12} color={colors.mutedForeground} /> {product.time}</Text><Text style={[styles.metaDivider, { color: colors.border }]}>|</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}><Ionicons name="flame-outline" size={12} color={colors.mutedForeground} /> {product.calories}</Text></View>
      <Text numberOfLines={2} style={[styles.description, { color: colors.mutedForeground }]}>{product.description}</Text>
      <View style={styles.priceRow}><Pressable testID={`quick-add-${product.id}`} onPress={() => addToCart({ productId: product.id, name: product.name, image: product.image, badge: product.badge, size: product.sizes?.[0]?.label ?? 'Regular', addOns: [], quantity: 1, unitPrice: product.price })} style={[styles.addButton, { backgroundColor: colors.primary }]}><Text style={[styles.addText, { color: colors.primaryForeground }]}>CUSTOMIZE</Text><Feather name="plus" size={15} color={colors.primaryForeground} /></Pressable></View>
    </View>
  </Pressable>;
}

export const styles = StyleSheet.create({
  loading: { flex: 1, padding: 22, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingLogo: { width: 64, height: 64, borderRadius: 32 },
  loadingTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: 2, marginBottom: 12 },
  loadingBar: { height: 10, borderRadius: 5, alignSelf: 'stretch' },
  screen: { flex: 1, paddingHorizontal: 18 },
  header: { paddingTop: 14, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 34, height: 34, borderRadius: 17 },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 1.5 },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  cartButton: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cartCount: { position: 'absolute', right: -4, top: -5, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 5 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 13, marginTop: 24 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -.5 },
  action: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  primary: { minHeight: 48, paddingHorizontal: 19, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  primaryText: { fontFamily: 'Inter_700Bold', fontSize: 13, letterSpacing: .3 },
  productCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  compactCard: { width: 208, marginBottom: 0 },
  productImageWrap: { height: 194, position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  saveBadge: { position: 'absolute', left: 11, top: 11, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 5 },
  productTools: { position: 'absolute', right: 10, top: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  rating: { paddingHorizontal: 8, height: 29, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  reviewText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  heart: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  productBadges: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', gap: 5 },
  categoryBadge: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: .6 },
  cardInfo: { padding: 15, gap: 9 },
  namePriceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  productName: { fontFamily: 'Inter_700Bold', fontSize: 16, lineHeight: 20, flex: 1 },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  oldPrice: { textDecorationLine: 'line-through', fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  metaDivider: { fontSize: 11 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  addButton: { minHeight: 40, paddingHorizontal: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, flex: 1 },
  addText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
});