import React from 'react';
import './PageLayout.css';
import { checkAuth } from '../../helpers';
import SideBar from '../SideBar/SideBar';
import MainContent from '../MainContent/MainContent';

const PageLayout = (props) => {
  return (
    checkAuth() ?
        <div className='layouts'>
            <div className='mainContent'>
                <SideBar/>
                <MainContent>{props.children}</MainContent>
            </div>
        </div>
    :
        <div className='layouts'>
            <div className='mainContent'>
                <SideBar/>
                <MainContent>{props.children}</MainContent>
            </div>
        </div>
  )
}

export default PageLayout
