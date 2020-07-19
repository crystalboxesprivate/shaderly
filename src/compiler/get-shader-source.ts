import {
  defaultVertexShaderSource,
  defaultFragmentShaderSource,
  defaultFragmentShaderChainPassSource,
} from './shaders'
import { ShaderStageType } from '../state/project/types'

export function getShaderSource(stage: ShaderStageType, passId?: number) {
  switch (stage) {
    case ShaderStageType.Vertex:
      return defaultVertexShaderSource
    case ShaderStageType.Fragment:
      return passId == 0
        ? defaultFragmentShaderSource
        : defaultFragmentShaderChainPassSource
    default:
      return ''
  }
}
