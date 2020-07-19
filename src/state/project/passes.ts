import { getShaderSource } from '../../compiler/get-shader-source'
import {
  Pass,
  GeometryType,
  PrimitiveType,
  ShaderStageType,
  ShaderStage,
} from './types'

const SET_SHADER_SOURCE = 'SET_SHADER_SOURCE'

export const passes = (state: Pass[] = [], action: any) => {
  switch (action.type) {
    case PASS_ADD:
      return [
        ...state,
        {
          id: state.length,
          enabled: true,
          name: `Pass-${state.length}`,
          geometryType: GeometryType.Quad,
          primitiveType: PrimitiveType.Triangles,
          shaderStages: {
            vertex: {
              type: ShaderStageType.Vertex,
              source: getShaderSource(ShaderStageType.Vertex),
            },
            fragment: {
              type: ShaderStageType.Fragment,
              source: getShaderSource(ShaderStageType.Fragment, state.length),
            },
          },
        },
      ]
    case SET_SHADER_SOURCE:
      return state.map((pass) =>
        pass.id == action.id
          ? {
              ...pass,
              shaderStages: (() => {
                const stages = pass.shaderStages
                if (action.stage == ShaderStageType.Vertex) {
                  return {
                    ...stages,
                    vertex: { ...stages.vertex, source: action.source },
                  }
                } else {
                  return {
                    ...stages,
                    fragment: { ...stages.fragment, source: action.source },
                  }
                }
              })(),
            }
          : pass
      )
    default:
      return state
  }
}

const PASS_ADD = 'PASS_ADD'

export const PassActions = {
  add: () => ({ type: PASS_ADD }),
  setShaderSource: (id: number, source: string, stage: ShaderStageType) => ({
    type: SET_SHADER_SOURCE,
    id,
    source,
    stage,
  }),
}
