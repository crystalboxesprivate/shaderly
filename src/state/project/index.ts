import { combineReducers } from 'redux'
import { properties } from './properties'
import { passes } from './passes'
import { Pass, ShaderPipeline, ShaderStageType } from './types'

const PROJECT_SET_NAME = 'PROJECT_SET_NAME'
const PROJECT_SET_CURRENT_PASS = 'PROJECT_SET_CURRENT_PASS'
const PROJECT_SET_CURRENT_STAGE = 'PROJECT_SET_CURRENT_STAGE'

const name = (state = 'untitled', action: any) =>
  action.type === PROJECT_SET_NAME ? action.name : state

const currentPass = (state = 0, action: any) =>
  action.type === PROJECT_SET_CURRENT_PASS ? action.pass : state

const currentStage = (state = ShaderStageType.Fragment, action: any) =>
  action.type === PROJECT_SET_CURRENT_STAGE ? action.stage : state

export const project = combineReducers({
  name,
  properties,
  currentPass,
  currentStage,
  passes,
})

export const ProjectActions = {
  setProjectName: (name: string) => ({ type: PROJECT_SET_NAME, name }),
  setCurrentPass: (pass: number) => ({ type: PROJECT_SET_CURRENT_PASS, pass }),
  setCurrentStage: (stage: ShaderStageType) => ({
    type: PROJECT_SET_CURRENT_STAGE,
    stage,
  }),
}
