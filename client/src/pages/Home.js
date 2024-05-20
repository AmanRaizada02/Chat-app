import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {logout, setOnlineUser, setSocketConnection, setUser} from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user=useSelector(state => state.user)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const location=useLocation()

  const fethUserDetail=async()=>{
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}/api/user-details`;
      const response=await axios({
        url:URL,
        withCredentials:true
      })

      dispatch(setUser(response.data.data))
      
      if(response.data.data.logout){
        dispatch(logout())
        navigate("/email")
      }
      console.log("user details",response)
    } catch (error) {
      console.log("error",error)
    }
  }
  useEffect(()=>{
    fethUserDetail()
  },[])

  // for socket connection
  useEffect(()=>{
    const socketConnection=io(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}`,{
      auth:{
        token: localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser',(data)=>{
      console.log("data",data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])

  const basePath = location.pathname==='/'

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
    <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
      <Sidebar/>
    </section>
    
    <section className={`${basePath && "hidden" }`}>
      <Outlet/>
    </section>


    <div className={`justify-center items-center flex-col col-gap-2 hidden ${!basePath ? "hidden":"lg:flex"}`}>
      <div>
        <img
        src={logo}
        width={250}
        alt="logo"
        />
      </div>
      <p className='text-lgmt-2 text-slate-500'>Select user to chat!</p>
    </div>
    </div>
  )
}

export default Home