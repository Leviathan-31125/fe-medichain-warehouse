import React from 'react'
import NavBar from '../NavBar/NavBar'
import './MainContent.css'

const MainContent = (props) => {
  return (
    <div className='layout'>
      <NavBar/>
      <div className='layoutMainContent'>
        {props.children}
      </div>
    </div>
  )
}

export default MainContent
