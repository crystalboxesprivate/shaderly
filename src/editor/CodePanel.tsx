import { WebView, WebViewMessageEvent } from 'react-native-webview'
import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import { useEditorSource } from './source-loading'
import { overlayLog } from '../utils/DebugOverlay'
import { useSelector, useDispatch } from 'react-redux'
import { ShaderlyState } from '../state'
import { ShaderStageType } from '../state/project/types'
import { EditorActions } from '../state/editor'
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'

function ErrorDispay() {
  const errors = useSelector((state: ShaderlyState) => state.editor.errors)
  return errors.length == 0 ? null : (
    <View style={styles.errorDisplay}>
      {errors.map((x: string, i: number) => (
        <Text key={`item:${i}`} style={styles.errorDisplayText}>
          {x}
        </Text>
      ))}
    </View>
  )
}

type WebViewMessage = {
  type: string
  textValue?: string
}

export function CodePanel() {
  const initialSource = useSelector((state: ShaderlyState) =>
    state.project.currentStage === ShaderStageType.Vertex
      ? state.project.passes[state.project.currentPass].shaderStages.vertex
          .source
      : state.project.passes[state.project.currentPass].shaderStages.fragment
          .source
  )

  const dispatch = useDispatch()

  const [currentShaderSource, setCurrentShaderSource] = useState(initialSource)
  const source = useEditorSource(initialSource)
  const webView: React.MutableRefObject<WebView | null> = useRef(null)

  const handleMessage = (message: WebViewMessageEvent) => {
    const parsed = JSON.parse(message.nativeEvent.data) as WebViewMessage

    if (parsed.type == 'value_changed') {
      const newSource = parsed.textValue as string
      setCurrentShaderSource(newSource)
    }
  }

  useEffect(() => {
    overlayLog('pending one shader compilation...')
    dispatch(EditorActions.setSource(currentShaderSource))
  }, [currentShaderSource])

  return (
    <View style={styles.codePanel}>
      <WebView
        style={styles.webView}
        ref={webView}
        onMessage={handleMessage}
        originWhitelist={['*']}
        source={{ html: source }}
      />
      <ErrorDispay />

      {/*<KeyboardAccessoryView alwaysVisible={true}>
  </KeyboardAccessoryView>*/}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  codePanel: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  webView: {
    alignSelf: 'auto',
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  errorDisplay: {
    backgroundColor: 'red',
    color: 'white',
  },
  errorDisplayText: {
    color: 'white',
    padding: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
})
