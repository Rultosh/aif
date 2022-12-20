import {useReducer} from 'react'

const useStateReducer= (prevState, newState) =>{
    const updateState = typeof newState ==='function' ? newState(prevState) : prevState
    return {...prevState, ...updateState} 
}

const useStateInitializer = (initialValue) => (typeof initialValue  ==='function' ? initialValue() : initialValue)

export function useSetState(initialValue) {
    return useReducer(useStateReducer, initialValue, useStateInitializer)
}