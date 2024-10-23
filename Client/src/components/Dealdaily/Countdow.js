import React from 'react'

const Countdow = ({unit , number}) => {
  return (
    <div className='w-[28%] flex-col h-[60px] border mt-4 flex items-center justify-center mb-4 bg-[#F4F4F4] rounded-md'>
        <span className='text-[18px] text-gray-800'>{number}</span>
        <span className='text-xs text-gray-200'>{unit}</span>
    </div>
  )
}

export default Countdow
