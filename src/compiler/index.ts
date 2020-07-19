import { getGL } from 'gl-man'
import { ShaderStageType } from '../state/project/types'

export function compile(
  source: string,
  stage: ShaderStageType,
  errors: string[]
) {
  const gl = getGL()
  const shaderType =
    stage === ShaderStageType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
  // Create the shader object
  var shader = gl.createShader(shaderType)
  if (!shader) {
    errors.push(`Couldn't create shader.`)
    return null
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    errors.push(
      `${stage} shader compilation error: ${
        gl.getShaderInfoLog(shader) as string
      }`
    )
    return null
  }
  return shader
}

export function makeProgram(
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
  errors: string[]
) {
  const gl = getGL()
  let program = gl.createProgram()
  if (!program) {
    errors.push(`Couldn't create shader program.`)
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    errors.push(`Link error: ${gl.getProgramInfoLog(program)}`)
  }
  return program
}
