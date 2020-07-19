import { combineReducers } from 'redux'

const SET_EDITOR_SOURCE = 'SET_EDITOR_SOURCE'
const SET_EDITOR_ERRORS = 'SET_EDITOR_ERRORS'

const source = (state = '', action: any) =>
  action.type == SET_EDITOR_SOURCE ? action.source : state

const errors = (state: string[] = [], action: any) =>
  action.type == SET_EDITOR_ERRORS ? action.errors : state

export const EditorActions = {
  setSource: (source: string) => ({ type: SET_EDITOR_SOURCE, source }),
  setErrors: (errors: string[]) => ({ type: SET_EDITOR_ERRORS, errors }),
}
export const editor = combineReducers({ source, errors })

export type EditorState = {
  source: string
  errors: string[]
}
