import { StatusBar, Dimensions, StyleProp, ViewStyle } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShaderView from './renderer/ShaderView';
import { DebugOverlay, overlayLog } from './utils/DebugOverlay';
import { CodePanel } from './editor/CodePanel';



export default function Main() {
  useEffect(() => {
    StatusBar.setHidden(true, 'slide')
    overlayLog('initialized')
  }, [])
  return (
    <View>
      <ShaderView />
      <CodePanel />
      <DebugOverlay />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
