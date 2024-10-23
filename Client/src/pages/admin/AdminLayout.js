import React from 'react'
import { Adminsidebar } from '../../components'
import {Outlet , Navigate} from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'
import Headeradmin from './Headeradmin'

const AdminLayout = () => {
  const {isLoggedIn , current} = useSelector(state => state.user)
  if(!isLoggedIn || !current || +current.role !==1945) return <Navigate to={`/${path.LOGIN}`} replace={true}/>
  return (
    <div className=' flex min-h-screen'>
      <div className='w-[18%] top-0 bottom-0 flex-none bg-gradient-to-t from-[#f9f9f9] to-gray-300'>
        <Adminsidebar/>
      </div>
      <div className='w-[82%] items-center flex   bg-gray-100  flex-col'>
        <Headeradmin/>
        <Outlet/>
      </div>
    </div>
  )
}
export default AdminLayout
