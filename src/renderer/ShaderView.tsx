import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { setContext, drawRect, getWidth, getHeight, getGL, clearColor } from 'gl-man'

const vertSrc = `
void main(void) {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`;

const fragSrc = `
void main(void) {
  gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}
`;

let _initialized = false;
// lol
let start: undefined | number;

function renderStuff(timestamp: number) {

  if (start === undefined)
    start = timestamp;
  const elapsed = (timestamp - start) * 0.001;

  clearColor(1)
  drawRect(0, 0, getWidth(), getHeight(), (elapsed % 20) / 20)

    ;
  (getGL() as ExpoWebGLRenderingContext).endFrameEXP();
  requestAnimationFrame(renderStuff);
}

export default class ShaderView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <GLView
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
          onContextCreate={this._onContextCreate}
        />
      </View>
    );
  }

  _onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    if (_initialized) {
      return;
    }

    setContext(gl);
    requestAnimationFrame(renderStuff);

    _initialized = true;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
