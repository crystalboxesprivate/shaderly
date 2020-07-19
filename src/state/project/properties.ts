import { combineReducers } from 'redux'
const PROP_SET_TYPE = 'PROP_SET_TYPE'
const PROP_SET_DATA_TYPE = 'PROP_SET_DATA_TYPE'
const PROP_ADD = 'PROP_ADD'

type Property = {
  id: number
  type: PropertyType
  dataType: PropertyDataType
}

export const properties = (state: Property[] = [], action: any) => {
  switch (action.type) {
    case PROP_SET_TYPE:
      return state.map((prop) =>
        prop.id === action.id ? { ...prop, type: action.propType } : prop
      )

    case PROP_SET_DATA_TYPE:
      return state.map((prop) =>
        prop.id === action.id
          ? { ...prop, dataType: action.propDataType }
          : prop
      )

    case PROP_ADD:
      return [
        ...state,
        {
          id: state.length,
          type: action.propType,
          dataType: action.propDataType,
        } as Property,
      ]

    default:
      return state
  }
}

export enum PropertyType {
  Constant,
  Function,
}

export enum PropertyDataType {
  Scalar,
  Vector,
  Texture,
}

export const PropertyActions = {
  add: (propType: PropertyType, propDataType: PropertyDataType) => ({
    type: PROP_ADD,
    propType,
    propDataType,
  }),
  setType: (id: number, type: PropertyType) => ({
    id,
    propType: type,
    type: PROP_SET_TYPE,
  }),
  setDataType: (id: number, type: PropertyDataType) => ({
    id,
    propDataType: type,
    type: PROP_SET_DATA_TYPE,
  }),
}
