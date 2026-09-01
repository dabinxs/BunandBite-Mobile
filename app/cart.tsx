import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useStore } from '@/lib/store';
import { PrimaryButton, Screen } from '@/components/ui';

export default function CartScreen() {
  const colors = useColors();
  const { cart, updateCart, removeCart, voucher, setVoucher, selectedBranch, fulfilment } = useStore();
  const [code, setCode] = useState(voucher ?? '');
  const [notice, setNotice] = useState('');
  const isPickup = fulfilment === 'Pickup' && Boolean(selectedBranch);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [cart]);
  const discountRate = voucher === 'BUNBITE50' ? .5 : voucher === 'BITE45' ? .45 : 0;
  const discount = subtotal * discountRate;
  const vat = 0;
  const service = cart.length ? .75 : 0;
  const delivery = cart.length && !isPickup ? 2 : 0;
  const total = Math.max(0, subtotal - discount + vat + service + delivery);

  const apply = () => {
    const nextCode = code.trim().toUpperCase();
    if (nextCode === 'BUNBITE50' || nextCode === 'BITE45') {
      setVoucher(nextCode);
      setNotice(`${nextCode === 'BUNBITE50' ? '50%' : '45%'} off applied`);
    } else {
      setNotice('Try BUNBITE50 for a current deal');
    }
  };

  const goCheckout = () => router.push({ pathname: '/checkout', params: { fulfilment, location: selectedBranch?.name ?? '' } });

  return <Screen>
    <View style={styles.heading}>
      <View><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR ORDER FROM</Text><Text numberOfLines={2} style={[styles.title, { color: colors.foreground }]}>{selectedBranch?.name ?? 'Your cart'}</Text></View>
      <Text style={[styles.count, { color: colors.mutedForeground }]}>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</Text>
    </View>
    {cart.length === 0 ? <View style={[styles.empty, { borderColor: colors.border }]}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Ionicons name="cart-outline" size={28} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your cart is empty</Text><Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>Choose a branch and add your favorite bites.</Text><PrimaryButton label={isPickup ? 'Choose a branch' : 'Browse menu'} onPress={() => router.replace(isPickup ? '/pickup' : '/menu')} icon="arrow-right" /></View> : <>
      <View style={styles.items}>{cart.map((item) => <View key={item.id} style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemMain}><View style={styles.itemTop}><Text style={[styles.itemName, { color: colors.foreground }]}>{item.quantity}x {item.name}</Text><Text style={[styles.itemPrice, { color: colors.primary }]}>${(item.unitPrice * item.quantity).toFixed(2)}</Text></View><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.size}{item.addOns.length ? ` · ${item.addOns.join(', ')}` : ''}</Text><View style={styles.itemActions}><Pressable onPress={() => router.push(`/product/${item.productId}`)} style={[styles.edit, { backgroundColor: colors.secondary, borderColor: colors.border }]}><Feather name="edit-2" size={12} color={colors.mutedForeground} /><Text style={[styles.editText, { color: colors.mutedForeground }]}>Edit</Text></Pressable><View style={styles.quantity}><Pressable onPress={() => updateCart(item.id, item.quantity - 1)}><Feather name="minus" size={13} color={colors.mutedForeground} /></Pressable><Text style={[styles.quantityText, { color: colors.foreground }]}>{item.quantity}</Text><Pressable onPress={() => updateCart(item.id, item.quantity + 1)}><Feather name="plus" size={13} color={colors.mutedForeground} /></Pressable></View><Pressable onPress={() => Alert.alert('Remove item?', item.name, [{ text: 'Keep' }, { text: 'Remove', style: 'destructive', onPress: () => removeCart(item.id) }])} style={[styles.delete, { backgroundColor: colors.secondary }]}><Ionicons name="trash-outline" size={16} color={colors.primary} /></Pressable></View></View>
      </View>)}</View>
      <Pressable onPress={() => router.push({ pathname: '/menu', params: { branchId: selectedBranch?.id ?? '' } })} style={styles.addMore}><Feather name="plus" size={22} color={colors.primary} /><Text style={[styles.addMoreText, { color: colors.foreground }]}>Add more items</Text></Pressable>
      <View style={[styles.voucher, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.voucherHeading}><Ionicons name="ticket-outline" size={19} color={colors.primary} /><Text style={[styles.voucherTitle, { color: colors.foreground }]}>Apply voucher</Text></View><View style={styles.voucherRow}><TextInput value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="BUNBITE50" placeholderTextColor={colors.mutedForeground} style={[styles.voucherInput, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]} /><Pressable onPress={apply} style={[styles.apply, { backgroundColor: colors.primary + '22', borderColor: colors.primary }]}><Text style={[styles.applyText, { color: colors.foreground }]}>Apply</Text></Pressable></View>{notice && <Text style={[styles.notice, { color: notice.includes('applied') ? colors.accent : colors.mutedForeground }]}>{notice}</Text>}</View>
      <View style={[styles.summary, { borderTopColor: colors.border }]}>
        <SummaryLine label="Subtotal" value={subtotal} colors={colors} />
        {discount > 0 && <SummaryLine label={`Voucher · ${discountRate * 100}% off`} value={-discount} colors={colors} accent />}
        <SummaryLine label="VAT" value={vat} colors={colors} />
        {delivery > 0 && <SummaryLine label="Delivery fee" value={delivery} colors={colors} />}
        <SummaryLine label="Service fee" value={service} colors={colors} />
        <View style={styles.paymentLine}><Text style={[styles.lineLabel, { color: colors.mutedForeground }]}>Payment method</Text><Text style={[styles.paymentText, { color: colors.foreground }]}>{isPickup ? 'Cash on Pickup' : 'Cash on Delivery'}</Text></View>
        <View style={[styles.totalLine, { borderTopColor: colors.border }]}><View><Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text><Text style={[styles.totalNote, { color: colors.mutedForeground }]}>(incl. fees and tax)</Text></View><Text style={[styles.total, { color: colors.primary }]}>${total.toFixed(2)}</Text></View>
      </View>
      <PrimaryButton label={isPickup ? 'Go checkout' : 'Continue to checkout'} onPress={goCheckout} disabled={!cart.length} icon="arrow-right" />
    </>}
  </Screen>;
}

function SummaryLine({ label, value, colors, accent = false }: { label: string; value: number; colors: ReturnType<typeof useColors>; accent?: boolean }) {
  return <View style={styles.line}><Text style={[styles.lineLabel, { color: accent ? colors.accent : colors.mutedForeground }]}>{label}</Text><Text style={[styles.lineValue, { color: accent ? colors.accent : colors.foreground }]}>${value.toFixed(2)}</Text></View>;
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 18 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, lineHeight: 29, marginTop: 5, maxWidth: 280 },
  count: { fontFamily: 'Inter_400Regular', fontSize: 11, marginBottom: 4 },
  items: { gap: 10 },
  item: { borderWidth: 1, borderRadius: 18, padding: 11, flexDirection: 'row', gap: 11 },
  itemImage: { width: 65, height: 65, borderRadius: 15, resizeMode: 'cover' },
  itemMain: { flex: 1 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemName: { fontFamily: 'Inter_700Bold', fontSize: 14, flex: 1 },
  itemPrice: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  itemMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 5 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  edit: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 9, minHeight: 27, flexDirection: 'row', alignItems: 'center', gap: 5 },
  editText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  quantity: { height: 27, borderRadius: 13, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 7 },
  quantityText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  delete: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  addMore: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 12 },
  addMoreText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  voucher: { borderWidth: 1, borderRadius: 17, padding: 14, marginBottom: 25 },
  voucherHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  voucherTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  voucherRow: { flexDirection: 'row', gap: 9 },
  voucherInput: { flex: 1, height: 48, borderWidth: 1, borderRadius: 24, paddingHorizontal: 17, fontFamily: 'Inter_700Bold', fontSize: 13 },
  apply: { minWidth: 82, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  applyText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  notice: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 8 },
  summary: { borderTopWidth: 1, paddingTop: 19, marginBottom: 18 },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 7 },
  lineLabel: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  lineValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  paymentLine: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 7 },
  paymentText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  totalLine: { borderTopWidth: 1, marginTop: 14, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: 'Inter_700Bold', fontSize: 26 },
  totalNote: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },
  total: { fontFamily: 'Inter_700Bold', fontSize: 25 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 22, alignItems: 'center', padding: 31, marginTop: 26 },
  emptyIcon: { width: 63, height: 63, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 15 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', marginTop: 7, marginBottom: 19 },
});