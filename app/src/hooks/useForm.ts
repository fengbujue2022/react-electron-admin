import produce from 'immer'
import { has, set } from 'lodash'
import { Reducer, ReducerState } from 'react'
import { useReducer } from 'react'

type FormAction<TObject extends Record<string, unknown>, TPath = any> = {
  _path: TPath
  _value: PropPathType<TPath, TObject>
}
type FromReducer<TObject extends Record<string, unknown>> = Reducer<TObject, FormAction<TObject>>

type Delimiter = '.'

type PropType<TObj, TProp> = TProp extends keyof TObj ? TObj[TProp] : never

export type PropPathType<S, O> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Tail extends `${infer tmpHead}${Delimiter}${infer tmpTail}`
    ? PropPathType<`${Tail}`, PropType<O, Head>>
    : PropType<PropType<O, Head>, Tail>
  : never

function formReducer<TObject extends Record<string, unknown>>(state: TObject, action: FormAction<TObject>) {
  // if (updateArg.constructor === Function) {
  //   return { ...state, ...action(state) }
  // }

  if (has(action, '_path') && has(action, '_value')) {
    const { _path, _value } = action

    return produce(state, (draft) => {
      set(draft, _path, _value)
    })
  } else {
    return { ...state, ...action }
  }
}

// Obsoleted, using useImmer instead
const useForm = <TObject extends Record<string, unknown>>(
  initialState: TObject
): [ReducerState<FromReducer<TObject>>, <TPath>(value: FormAction<TObject, TPath>) => void] =>
  useReducer<FromReducer<TObject>>(formReducer, initialState)

export { useForm }
