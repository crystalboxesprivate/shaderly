import { StatusBar, Dimensions, StyleProp, ViewStyle } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ShaderView from './renderer/ShaderView'
import { DebugOverlay, overlayLog } from './utils/DebugOverlay'
import { CodePanel } from './editor/CodePanel'
import { getShaderSource } from './compiler/get-shader-source'
import { ShaderStageType } from './state/project/types'
import { Provider } from 'react-redux'

import state, { ShaderlyState } from './state'
import { createStore, Store } from 'redux'
import { setupRendererState } from './renderer/verbose-test'
import { PassActions } from './state/project/passes'
import {
  defaultVertexShaderSource,
  defaultFragmentShaderSource,
} from './compiler/shaders'

function Shaderly() {
  useEffect(() => {
    StatusBar.setHidden(true, 'slide')
    overlayLog('initialized')
  }, [])
  return (
    <View>
      <ShaderView />
      <CodePanel initialSource={getShaderSource(ShaderStageType.Fragment, 0)} />
      <DebugOverlay />
    </View>
  )
}

export default function Main() {
  const store = createStore(state) as Store<ShaderlyState>
  setupRendererState(store)

  store.dispatch(PassActions.add())
  store.dispatch(
    PassActions.setShaderSource(
      0,
      defaultVertexShaderSource,
      ShaderStageType.Vertex
    )
  )
  store.dispatch(
    PassActions.setShaderSource(
      0,
      defaultFragmentShaderSource,
      ShaderStageType.Fragment
    )
  )

  return (
    <Provider store={store}>
      <Shaderly />
    </Provider>
  )
}
