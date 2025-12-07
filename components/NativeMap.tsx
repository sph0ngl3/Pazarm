import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

let MapView: any;
let Marker: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
} else {
  // Web Fallback Component
  MapView = (props: any) => (
    <View style={[styles.webMap, props.style]}>
      <Text style={styles.webText}>Maps are available on Android/iOS Simulator</Text>
      <Text style={styles.subText}>(Web preview not supported for Maps)</Text>
    </View>
  );
  // Mock children components for Web
  Marker = () => null;
  Polyline = () => null;
  PROVIDER_GOOGLE = null;
}

const styles = StyleSheet.create({
  webMap: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  webText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});

export { MapView as default, Marker, Polyline, PROVIDER_GOOGLE };
