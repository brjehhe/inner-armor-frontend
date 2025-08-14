import 'react-native-reanimate
  // App.js
import 'react-native-reanimated';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withRepeat, withSequence, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- THEME ---
const COLORS = {
  navy: '#0B1220',
  navy2: '#0E1A2B',
  navy3: '#0F2239',
  gold: '#F4C95D',
  gold2: '#EAB54F',
  white: '#FFFFFF',
  glass: 'rgba(255,255,255,0.06)',
};

// Reusable glass card with subtle 3D tilt
const TiltCard = ({ children }) => {
  const r = useSharedValue(0);
  const tilt = useSharedValue(0);

  // glow loop
  useEffect(() => {
    r.value = withRepeat(withSequence(withTiming(1, { duration: 1600 }), withTiming(0, { duration: 1600 })), -1);
  }, []);

  // enter pop
  useEffect(() => {
    tilt.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
  }, []);

  const aStyle = useAnimatedStyle(() => {
    const scale = 0.98 + 0.02 * tilt.value;
    const rx = 6 * (1 - tilt.value); // settles to 0
    return {
      transform: [
        { perspective: 800 },
        { rotateX: `${rx}deg` },
        { scale },
      ],
      shadowOpacity: 0.2 + 0.2 * r.value,
    };
  });

  return (
    <Animated.View style={[styles.card, aStyle]}>
      {children}
    </Animated.View>
  );
};

// Soft golden shimmer line
const Shimmer = () => {
  const x = useSharedValue(-width * 0.6);
  useEffect(() => {
    x.value = withRepeat(withTiming(width * 1.2, { duration: 3000 }), -1, false);
  }, []);
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    opacity: 0.6,
  }));
  return (
    <View style={{ overflow: 'hidden', height: 2, marginVertical: 12 }}>
      <View style={{ height: 2, backgroundColor: COLORS.glass }} />
      <Animated.View style={[{
        position: 'absolute',
        width: width * 0.4,
        height: 2,
        backgroundColor: COLORS.gold,
      }, aStyle]} />
    </View>
  );
};

// Starfield backdrop (SVG + gradients)
const Starfield = () => {
  const stars = useMemo(
    () => new Array(40).fill(0).map((_, i) => ({
      cx: Math.random() * width,
      cy: Math.random() * 260,
      r: Math.random() * 1.6 + 0.4,
      o: 0.5 + Math.random() * 0.5,
    })),
    []
  );

  return (
    <Svg height={260} width="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <RadialGradient id="g" cx="50%" cy="35%">
          <Stop offset="0%" stopColor="#23324A" stopOpacity="1" />
          <Stop offset="100%" stopColor={COLORS.navy} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Circle cx={width / 2} cy={130} r={520} fill="url(#g)" />
      {stars.map((s, i) => (
        <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={COLORS.gold} opacity={s.o} />
      ))}
    </Svg>
  );
};

export default function App() {
  const [message, setMessage] = useState('Loading…');
  const [loading, setLoading] = useState(true);

  // ping your backend
  useEffect(() => {
    fetch('https://glorious-space-pancake-69pqv4gv5x5jcrvvw-3000.app.github.dev/test')
      .then((res) => res.json())
      .then((data) => setMessage(data?.message || JSON.stringify(data)))
      .catch((err) => setMessage('Error: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  // animated hero title
  const glow = useSharedValue(0);
  useEffect(() => {
    glow.value = withRepeat(withSequence(withTiming(1, { duration: 1600 }), withTiming(0, { duration: 1600 })), -1);
  }, []);
  const titleA = useAnimatedStyle(() => ({
    textShadowColor: COLORS.gold,
    textShadowRadius: 12 + glow.value * 16,
  }));

  return (
    <LinearGradient colors={[COLORS.navy, COLORS.navy2, COLORS.navy3]} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Decorative background */}
        <Starfield />

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.gold} />
          <Text style={styles.brand}>Inner Armor</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <Animated.Text style={[styles.heroTitle, titleA]}>
            Strong • Secure • Simple
          </Animated.Text>
          <Text style={styles.heroSubtitle}>Dark-navy + gold interactive UI</Text>
          <Shimmer />

          <TiltCard>
            <Text style={styles.cardTitle}>Backend Status</Text>
            {loading ? (
              <View style={styles.rowCenter}>
                <ActivityIndicator />
                <Text style={styles.cardText}>  Checking…</Text>
              </View>
            ) : (
              <Text style={styles.cardText}>{message}</Text>
            )}
          </TiltCard>

          <View style={styles.grid}>
            <TiltCard>
              <View style={styles.row}>
                <Ionicons name="flash-outline" size={22} color={COLORS.gold} />
                <Text style={styles.featureTitle}>Real-time Webhooks</Text>
              </View>
              <Text style={styles.featureText}>
                Stripe events are verified and processed securely.
              </Text>
            </TiltCard>

            <TiltCard>
              <View style={styles.row}>
                <Ionicons name="lock-closed-outline" size={22} color={COLORS.gold} />
                <Text style={styles.featureTitle}>Hardened Security</Text>
              </View>
              <Text style={styles.featureText}>
                Secrets in .env; requests signed & validated.
              </Text>
            </TiltCard>

            <TiltCard>
              <View style={styles.row}>
                <Ionicons name="planet-outline" size={22} color={COLORS.gold} />
                <Text style={styles.featureTitle}>Scalable API</Text>
              </View>
              <Text style={styles.featureText}>
                Modular endpoints ready for more features.
              </Text>
            </TiltCard>
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.cta}>
            <LinearGradient
              colors={[COLORS.gold, COLORS.gold2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaInner}
            >
              <Ionicons name="rocket-outline" size={18} color={COLORS.navy} />
              <Text style={styles.ctaText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brand: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroWrap: {
    paddingHorizontal: 18,
    paddingBottom: 32,
    marginTop: 12,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  heroSubtitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  card: {
    marginTop: 16,
    backgroundColor: COLORS.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  cardTitle: {
    color: COLORS.gold,
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 16,
  },
  cardText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  grid: {
    marginTop: 10,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  featureTitle: { color: COLORS.white, fontWeight: '700' },
  featureText: { color: 'rgba(255,255,255,0.85)' },
  cta: { marginTop: 18 },
  ctaInner: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaText: {
    color: COLORS.navy,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
