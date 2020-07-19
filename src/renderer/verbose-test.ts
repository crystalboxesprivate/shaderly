import {
  GraphicsBuffer,
  GraphicsBufferType,
  Shader,
  getGL,
  FLOAT,
  draw,
  getWidth,
  getHeight,
  isContextInitialized,
} from 'gl-man'
import { compile, makeProgram } from '../compiler'
import {
  defaultVertexShaderSource,
  defaultFragmentShaderSource,
} from '../compiler/shaders'
import {
  getCurrentMatrix,
  pushMatrix,
  translate,
  scale,
  popMatrix,
} from 'gl-man/dist/common/transform'
import { ShaderStageType } from '../state/project/types'
import { Store, Dispatch, AnyAction } from 'redux'
import { ShaderlyState } from '../state'
import { EditorActions } from '../state/editor'
import { PassActions } from '../state/project/passes'
import { overlayLog } from '../utils/DebugOverlay'

type ShaderState = {
  vert: WebGLShader | null
  frag: WebGLShader | null
  shader: Shader | null

  vertSrc: string
  fragSrc: string
}

let dispatch: Dispatch<AnyAction> | null = null

// map of shader states
const shaderStates = new Map<number, ShaderState>()
let currentPass = -1

function makeShaderProgram(
  vertSrc: string,
  fragSrc: string,
  errors: string[]
): ShaderState {
  const vert = compile(vertSrc, ShaderStageType.Vertex, errors)
  const frag = compile(fragSrc, ShaderStageType.Fragment, errors)

  if (vert && frag) {
    const prog = makeProgram(vert, frag, errors)
    if (prog) {
      shader = new Shader(getGL(), prog)
      return {
        vert,
        frag,
        shader,
        vertSrc,
        fragSrc,
      }
    }
  }
  if (errors.length) {
    errors.forEach(console.log)
  }
  return { vert: null, frag: null, shader: null, vertSrc, fragSrc }
}

let editorSource = ''

export function setupRendererState(store: Store<ShaderlyState>) {
  dispatch = store.dispatch

  store.subscribe(() => {
    const state = store.getState()
    currentPass = state.project.currentPass
    console.log('set pass')
    if (currentPass >= state.project.passes.length) {
      console.log('not enough passes')
      return
    }
    if (!isContextInitialized()) {
      console.log('no context')
      return
    }

    // make sure the pass exist in the registry
    if (!shaderStates.has(currentPass)) {
      const pass = state.project.passes[currentPass]

      const vertSrc = pass.shaderStages.vertex.source
      const fragSrc = pass.shaderStages.fragment.source
      const errors: string[] = []
      const newShaderState = makeShaderProgram(vertSrc, fragSrc, errors)
      console.log('setting shader state')
      shaderStates.set(currentPass, newShaderState)
      if (dispatch) dispatch(EditorActions.setErrors(errors))
    } else {
      if (editorSource === state.editor.source) {
        return
      }
      editorSource = state.editor.source
      const shState = shaderStates.get(currentPass) as ShaderState
      let newVertSrc = shState.vertSrc
      let newFragSrc = shState.fragSrc

      let src = shState.vertSrc
      if (state.project.currentStage == ShaderStageType.Fragment) {
        src = shState.fragSrc
        newFragSrc = state.editor.source
      } else if (state.project.currentStage == ShaderStageType.Vertex) {
        newVertSrc = state.editor.source
      }

      if (state.editor.source != src) {
        const errors: string[] = []
        const newShaderState = makeShaderProgram(newVertSrc, newFragSrc, errors)
        console.log('setting shader state')
        shaderStates.set(currentPass, newShaderState)
        if (dispatch)
          dispatch(
            PassActions.setShaderSource(
              currentPass,
              state.editor.source,
              state.project.currentStage
            )
          )
      }
    }
  })
}

let initialized = false

type DrawRectData = {
  vertexBuffer: GraphicsBuffer
  indexBuffer: GraphicsBuffer
}

let _drawRectData: DrawRectData | null = null
let shader: Shader | null = null

function initializeIfNecessary() {
  if (initialized) {
    return
  }

  _drawRectData = {
    vertexBuffer: new GraphicsBuffer(GraphicsBufferType.VERTEX),
    indexBuffer: new GraphicsBuffer(GraphicsBufferType.INDEX),
  }

  _drawRectData.vertexBuffer.setData(new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]))
  _drawRectData.indexBuffer.setData(new Uint16Array([3, 2, 1, 3, 1, 0]))
  initialized = true
}

function getCurrentPass() {
  return currentPass
}

function getStates() {
  return shaderStates
}

export function drawVerbose(time: number) {
  initializeIfNecessary()
  if (getCurrentPass() == -1) {
    console.log('np pass')
    return
  }

  const state = getStates().get(getCurrentPass())
  // console.log(shaderStates)
  // console.log(currentPass)
  // console.log(state)
  if (!state) {
    return
  }
  if (!state.shader) {
    console.log('shader not compiled')
    return
  }
  pushMatrix()
  translate(0, 0, 0)
  scale(getWidth(), getHeight())
  const mat = getCurrentMatrix()
  popMatrix()
  const { shader } = state
  shader.setMatrix('mvp', mat)
  // shader.setFloat('alpha', opacity)
  shader.setFloat('time', time)
  shader.setVector('resolution', [getWidth(), getHeight(), 0])

  const { vertexBuffer, indexBuffer } = _drawRectData as DrawRectData
  draw(
    shader,
    ['a_position'],
    [
      {
        size: 2,
        glType: FLOAT,
        normalized: false,
        stride: 0,
        offset: 0,
      },
    ],
    0,
    6,
    vertexBuffer,
    indexBuffer
  )
}
