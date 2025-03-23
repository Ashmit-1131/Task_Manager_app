import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch,useAppSelector } from '../app/hooks'
import { clearUser } from '../features/auth/authSlice'

const Navbar:React.FC = () => {
    const navigate=useNavigate()
    const user=useAppSelector((state)=>state.auth.user)
    const dispatch=useAppDispatch()

    const signOut=()=>{
        dispatch(clearUser())
        navigate("/")
    }
    

  return (
    <nav className='navbar'>
        <div className='navbar-logo'>Task Manager system</div>
        {
            user&&(
                <div className='navbar-user'>
                    <span>{user.displayName}</span>
                    <button className='navbar-signout' onClick={signOut}>SignOut</button>

                </div>
            )
        }

    </nav>
  )
}

export default Navbar