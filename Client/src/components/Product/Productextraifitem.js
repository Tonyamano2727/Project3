import React, { memo } from 'react'

const Productextraifitem = ({icon,title,sub}) => {
  return (
    <div className='flex items-center p-4 gap-4 w-[50%]'>
      <span>{icon}</span>
      <div className='flex flex-col text-sm text-gray-500'>
      <span className='font-medium'>{title}</span>
      <span>{sub}</span>
      </div>
    </div>
  )
}

export default memo(Productextraifitem)
