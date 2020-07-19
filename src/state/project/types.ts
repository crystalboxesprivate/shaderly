export enum GeometryType {
  Quad,
}
export enum PrimitiveType {
  Triangles,
}

export enum ShaderStageType {
  Vertex = 'Vertex',
  Fragment = 'Fragment',
}

export type ShaderStage = {
  type: ShaderStageType
  source: string
}

export type ShaderPipeline = {
  vertex: ShaderStage
  fragment: ShaderStage
}

export type Pass = {
  id: number
  enabled: boolean
  name: string

  geometryType: GeometryType
  primitiveType: PrimitiveType

  shaderStages: ShaderPipeline
}

export type ProjectState = {
  name: string
  currentPass: number
  currentStage: ShaderStageType
  passes: Pass[]
}
