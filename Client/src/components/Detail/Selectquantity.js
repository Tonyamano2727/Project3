import React,{memo} from 'react'

const Selectquantity = ({quantity, handleQuantity , handlechangequantity}) => {
  return (
    <div className='flex items-center'>
        <span className='cursor-pointer p-2 border-r border-black' onClick={() => handlechangequantity('minus')}>-</span>
      <input type='text' className='py-2 outline-none w-[30px] text-center' value={quantity} onChange={e => handleQuantity(e.target.value)}></input>
      <span onClick={() => handlechangequantity('Plus')} className='p-2 border-l cursor-pointer border-black'>+</span>
    </div>
  )
}

export default memo(Selectquantity)
