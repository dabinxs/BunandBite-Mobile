import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { getProduct } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { PrimaryButton } from '@/components/ui';

export default function ProductDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useMemo(() => getProduct(Number(id)), [id]);
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return <View style={[styles.missing, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.foreground }]}>That bite is off the menu.</Text><PrimaryButton label="Back to menu" onPress={() => router.replace('/menu')} /></View>;
  const size = product.sizes?.[sizeIndex];
  const unitPrice = product.price + (size?.price ?? 0) + addOns.length * .5;
  const toggle = (addOn: string) => setAddOns((prev) => prev.includes(addOn) ? prev.filter((item) => item !== addOn) : [...prev, addOn]);
  const add = () => {
    addToCart({ productId: product.id, name: product.name, image: product.image, badge: product.badge, size: size?.label ?? 'Regular', addOns, quantity, unitPrice });
    setAdded(true);
  };
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={[styles.imageArea, { backgroundColor: colors.secondary }]}>
        <Image source={product.image} style={styles.image} />
        <Pressable onPress={() => toggleFavorite(product.id)} style={[styles.favorite, { backgroundColor: colors.card }]}>
          <Ionicons name={favorites.includes(product.id) ? 'heart' : 'heart-outline'} size={21} color={favorites.includes(product.id) ? colors.primary : colors.foreground} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.rating}><Ionicons name="star" size={14} color={colors.accent} /><Text style={[styles.ratingText, { color: colors.foreground }]}>{product.rating}</Text><Text style={[styles.muted, { color: colors.mutedForeground }]}>{product.reviews} reviews · {product.time}</Text></View>
        <Text style={[styles.title, { color: colors.foreground }]}>{product.name}</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>{product.description}</Text>
        <View style={styles.priceLine}><Text style={[styles.price, { color: colors.primary }]}>${unitPrice.toFixed(2)}</Text><Text style={[styles.calories, { color: colors.mutedForeground }]}>{product.calories}</Text></View>
        {product.sizes ? <><Text style={[styles.optionTitle, { color: colors.foreground }]}>Choose your size</Text><View style={styles.options}>{product.sizes.map((item, index) => <Pressable key={item.label} onPress={() => setSizeIndex(index)} style={[styles.option, { backgroundColor: sizeIndex === index ? colors.primary : colors.card, borderColor: sizeIndex === index ? colors.primary : colors.border }]}><Text style={[styles.optionText, { color: sizeIndex === index ? colors.primaryForeground : colors.foreground }]}>{item.label}</Text>{item.price > 0 && <Text style={[styles.optionPrice, { color: sizeIndex === index ? colors.primaryForeground : colors.mutedForeground }]}>+${item.price.toFixed(2)}</Text>}</Pressable>)}</View></> : null}
        {product.addOns ? <><Text style={[styles.optionTitle, { color: colors.foreground }]}>Make it extra</Text><View style={[styles.addOnBox, { backgroundColor: colors.card, borderColor: colors.border }]}>{product.addOns.map((item) => <Pressable key={item} onPress={() => toggle(item)} style={[styles.addOn, { borderBottomColor: colors.border }]}><Text style={[styles.addOnText, { color: colors.foreground }]}>{item}</Text><View style={[styles.check, { borderColor: addOns.includes(item) ? colors.primary : colors.border, backgroundColor: addOns.includes(item) ? colors.primary : colors.background }]}>{addOns.includes(item) && <Feather name="check" size={12} color={colors.primaryForeground} />}</View></Pressable>)}</View></> : null}
        <View style={styles.bottomRow}><View style={[styles.quantity, { backgroundColor: colors.card, borderColor: colors.border }]}><Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyButton}><Feather name="minus" size={16} color={colors.foreground} /></Pressable><Text style={[styles.qtyText, { color: colors.foreground }]}>{quantity}</Text><Pressable onPress={() => setQuantity(quantity + 1)} style={styles.qtyButton}><Feather name="plus" size={16} color={colors.foreground} /></Pressable></View><View style={{ flex: 1 }}>{added ? <Pressable onPress={() => router.push('/cart')} style={[styles.added, { backgroundColor: colors.accent }]}><Text style={[styles.addedText, { color: colors.accentForeground }]}>Added · View cart</Text><Feather name="arrow-right" size={18} color={colors.accentForeground} /></Pressable> : <PrimaryButton label={`Add · $${(unitPrice * quantity).toFixed(2)}`} onPress={add} icon="shopping-bag" />}</View></View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 }, imageArea: { height: 265, alignItems: 'center', justifyContent: 'center' }, image: { width: '84%', height: '84%', resizeMode: 'contain' }, favorite: { position: 'absolute', top: 18, right: 18, width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, content: { padding: 19 }, rating: { flexDirection: 'row', alignItems: 'center', gap: 6 }, ratingText: { fontFamily: 'Inter_700Bold', fontSize: 13 }, muted: { fontFamily: 'Inter_400Regular', fontSize: 12 }, title: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -.7, marginTop: 10 }, description: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 8 }, priceLine: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 15 }, price: { fontFamily: 'Inter_700Bold', fontSize: 24 }, calories: { fontFamily: 'Inter_400Regular', fontSize: 12 }, optionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 25, marginBottom: 11 }, options: { flexDirection: 'row', gap: 9 }, option: { borderRadius: 14, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 14, minWidth: 96 }, optionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 }, optionPrice: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 }, addOnBox: { borderRadius: 17, borderWidth: 1, paddingHorizontal: 14 }, addOn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 49, borderBottomWidth: 1 }, addOnText: { fontFamily: 'Inter_400Regular', fontSize: 13 }, check: { width: 21, height: 21, borderRadius: 7, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, bottomRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 24 }, quantity: { height: 52, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' }, qtyButton: { width: 39, height: 50, alignItems: 'center', justifyContent: 'center' }, qtyText: { fontFamily: 'Inter_700Bold', fontSize: 15, minWidth: 18, textAlign: 'center' }, added: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, addedText: { fontFamily: 'Inter_700Bold', fontSize: 13 }, missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 25 },
});