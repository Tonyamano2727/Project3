import React from 'react'
import {Outlet , Navigate} from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'
import { Membersidebar } from '../../components'
const MemberLayout = () => {
  const {isLoggedIn , current} = useSelector(state => state.user)

  if(!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true}/>
  // console.log(current);
  return (
    <div className='flex '>
      <div className='w-[327px]'>
      <Membersidebar/>
      </div>
      <div className='flex-aut bg-blue-300 w-full min-h-screen'>
      <Outlet/>
      </div>
    </div>
  )
}

export default MemberLayout