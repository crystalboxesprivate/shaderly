import { combineReducers } from 'redux'

export type ShaderlyState = {
  project: ProjectState
  editor: EditorState
  contextID: number
}

import { project } from './project'
import { editor, EditorState } from './editor'
import { ProjectState } from './project/types'

const contextID = (state = 0, action: any) =>
  action.type == 'SET_CONTEXT_ID' ? state + 1 : 1
export const StateActions = {
  setContextID: () => ({ type: 'SET_CONTEXT_ID' }),
}
const state = combineReducers({ project, editor, contextID })
export default state
