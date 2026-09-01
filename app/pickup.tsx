import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { BRANCHES } from '@/lib/branches';
import { useStore } from '@/lib/store';
import { Branch } from '@/lib/types';
import { BrandHeader, Screen } from '@/components/ui';

type Mode = 'Pickup' | 'Delivery';

export default function PickupScreen() {
  const colors = useColors();
  const { cart, selectedBranch, setSelectedBranch, setFulfilment, clearCart } = useStore();
  const [mode, setMode] = useState<Mode>('Pickup');

  const openBranchMenu = (branch: Branch) => {
    const start = () => {
      setSelectedBranch(branch);
      setFulfilment(mode);
      router.push({ pathname: '/menu', params: { branchId: branch.id, fulfilment: mode } });
    };
    if (cart.length && selectedBranch?.id !== branch.id) {
      Alert.alert('Start a new branch order?', 'Your current cart is from another order. Choosing this branch will clear it.', [
        { text: 'Keep current order', style: 'cancel' },
        { text: 'Choose branch', style: 'destructive', onPress: () => { clearCart(); start(); } },
      ]);
      return;
    }
    start();
  };

  return <Screen>
    <BrandHeader subtitle="Choose your nearest branch." />
    <View style={styles.heading}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>PICK UP YOUR ORDER</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Pick up your order</Text>
      <Text style={[styles.copy, { color: colors.mutedForeground }]}>Choose your nearest Bun & Bite branch and pick up your food when it is ready.</Text>
    </View>
    <View style={[styles.mode, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {(['Pickup', 'Delivery'] as Mode[]).map((item) => <Pressable key={item} onPress={() => setMode(item)} style={[styles.modeItem, { backgroundColor: mode === item ? colors.primary : 'transparent' }]}><Text style={[styles.modeText, { color: mode === item ? colors.primaryForeground : colors.mutedForeground }]}>{item}</Text></Pressable>)}
    </View>
    <View style={styles.branchList}>{BRANCHES.map((branch) => <View key={branch.id} style={[styles.branchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.branchHeader}><View style={{ flex: 1 }}><Text style={[styles.branchName, { color: colors.foreground }]}>{branch.name}</Text><View style={[styles.openPill, { backgroundColor: colors.secondary }]}><View style={[styles.openDot, { backgroundColor: colors.accent }]} /><Text style={[styles.openText, { color: colors.accent }]}>Open</Text></View></View><View style={[styles.branchIcon, { backgroundColor: colors.secondary }]}><Ionicons name="storefront-outline" size={20} color={colors.primary} /></View></View>
      <BranchDetail icon="location-outline" label="ADDRESS" value={branch.address} colors={colors} />
      <BranchDetail icon="time-outline" label="HOURS" value={branch.hours} colors={colors} />
      <BranchDetail icon="call-outline" label="CONTACT" value={branch.contact} colors={colors} />
      <View style={styles.availabilityRow}><Availability label="PICKUP" value="Available" colors={colors} /><Availability label="PREP TIME" value={branch.prepTime} colors={colors} /></View>
      <View style={[styles.delivery, { backgroundColor: colors.background, borderColor: colors.border }]}><Ionicons name="bicycle-outline" size={15} color={colors.primary} /><View><Text style={[styles.availabilityLabel, { color: colors.primary }]}>DELIVERY</Text><Text style={[styles.availabilityValue, { color: colors.foreground }]}>{branch.delivery}</Text></View></View>
      <Pressable onPress={() => openBranchMenu(branch)} style={({ pressed }) => [styles.chooseButton, { backgroundColor: colors.primary, opacity: pressed ? .84 : 1 }]}><Text style={[styles.chooseText, { color: colors.primaryForeground }]}>Choose Branch</Text><Feather name="arrow-right" size={15} color={colors.primaryForeground} /></Pressable>
    </View>)}</View>
  </Screen>;
}

function BranchDetail({ icon, label, value, colors }: { icon: any; label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return <View style={styles.detail}><View style={[styles.detailIcon, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={16} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text></View></View>;
}

function Availability({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.availability, { backgroundColor: colors.secondary }]}><Text style={[styles.availabilityLabel, { color: colors.primary }]}>{label}</Text><Text style={[styles.availabilityValue, { color: colors.foreground }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  heading: { paddingTop: 20 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 30, marginTop: 5 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 8 },
  mode: { alignSelf: 'center', borderWidth: 1, borderRadius: 24, padding: 4, flexDirection: 'row', marginTop: 20, marginBottom: 14 },
  modeItem: { minWidth: 82, minHeight: 34, borderRadius: 19, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  modeText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  branchList: { gap: 12 },
  branchCard: { borderWidth: 1, borderRadius: 20, padding: 14 },
  branchHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 11 },
  branchName: { fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 19 },
  openPill: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7 },
  openDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { fontFamily: 'Inter_600SemiBold', fontSize: 9 },
  branchIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 },
  detailIcon: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 1 },
  detailValue: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  availabilityRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  availability: { flex: 1, borderRadius: 11, padding: 10 },
  availabilityLabel: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: .7 },
  availabilityValue: { fontFamily: 'Inter_600SemiBold', fontSize: 10, marginTop: 5 },
  delivery: { minHeight: 47, borderWidth: 1, borderRadius: 11, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  chooseButton: { minHeight: 42, borderRadius: 21, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  chooseText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
});