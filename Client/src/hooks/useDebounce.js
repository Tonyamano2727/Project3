import React,{useEffect, useState} from 'react'

const useDebounce = (value,ms) => {

    const [debouncevalue, setdebouncevalue] = useState('')
    useEffect(() => {
        const setTimeOutID = setTimeout(() => {
            setdebouncevalue(value)
        },ms)
        return () => {
            clearTimeout(setTimeOutID)
        }
    },[value,ms])

  return debouncevalue
}

export default useDebounce
