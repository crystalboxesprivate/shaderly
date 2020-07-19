import { WebView, WebViewMessageEvent } from 'react-native-webview'
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useEditorSource } from './source-loading';
import { overlayLog } from '../utils/DebugOverlay';

const shaderCode = `#version 150
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

in VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} inData;

out vec4 fragColor;

void main(void)
{
    vec2 uv = -1. + 2. * inData.v_texcoord;
    fragColor = vec4(
        abs(sin(cos(time+3.*uv.y)*2.*uv.x+time)),
        abs(cos(sin(time+2.*uv.x)*3.*uv.y+time)),
        spectrum.x * 100.,
        1.0);
        
}`

function ErrorDispay({ messages }: { messages?: string[] }) {
  return !messages ? null : (
    <View style={styles.errorDisplay}>
      {messages.map((x: string, i: number) => (
        <Text key={`item:${i}`} style={styles.errorDisplayText}>
          {x}
        </Text>
      ))}
    </View>
  )
}

type WebViewMessage = {
  type: string,
  textValue?: string
}

export function CodePanel({ initialSource }: { initialSource?: string }) {
  initialSource = !initialSource ? shaderCode : initialSource as string
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
  }, [currentShaderSource])

  return <View style={styles.codePanel}>
    <WebView style={styles.webView} ref={webView}
      onMessage={handleMessage}
      originWhitelist={['*']}
      source={{ html: source }
      } />
    <ErrorDispay messages={['diso', 'dsds']} />
  </View>
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codePanel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(255,255,255,0.0)',
    flex: 1
  },
  webView: {
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
    borderBottomWidth: 1
  }

});
