import React from 'react'
import './SideBar.css'
import { LogoMedichain } from '../../assets';
import { useLocation, useNavigate } from 'react-router-dom'

const SideBar = () => {
    const location = useLocation();
    const currentLocation = location.pathname.split('/')[1];
    const navigate = useNavigate();

    const userLogout = () => {
        setTimeout(() => {
            localStorage.removeItem('accessToken')
            navigate('/')
        }, 200)
    }

    return (
        <div className='sideBar' name="sideBar">
            <img src={LogoMedichain} alt="Logo-Medichain" height="60px" />
            <div className='sidebarMenu'>
                <a href="/dashboard">
                    <div className={currentLocation === "dashboard" ? "activeMenu" : "inactiveMenu"}>Dashboard</div>
                </a>
                <a href="/master-brand">
                    <div className={currentLocation === "master-brand" ? "activeMenu" : "inactiveMenu"}>Master Brand</div>
                </a>
                <a href="/master-stock">
                    <div className={currentLocation === "master-stock" ? "activeMenu" : "inactiveMenu"}>Master Stok</div>
                </a>
                <a href="/master-warehouse">
                    <div className={currentLocation === "master-warehouse" ? "activeMenu" : "inactiveMenu"}>Master Warehouse</div>
                </a>
                <a href="/inventory">
                    <div className={currentLocation === "inventory" ? "activeMenu" : "inactiveMenu"}>Persediaan Stok</div>
                </a>
                {/* <a href="/stock-opname">
                    <div className={currentLocation === "stock-opname" ? "activeMenu" : "inactiveMenu"}>Stok Opname</div>
                </a>
                <a href="/stock-convert">
                    <div className={currentLocation === "stock-convert" ? "activeMenu" : "inactiveMenu"}>Konversi Stok</div>
                </a> */}
                <a href="/inquiri-stock">
                    <div className={currentLocation === "inquiri-stock" ? "activeMenu" : "inactiveMenu"}>Tracking Stok</div>
                </a>
                <a href="/master-do">
                    <div className={currentLocation === "master-do" ? "activeMenu" : "inactiveMenu"}>Master DO</div>
                </a>
                <a href="/delivery-order">
                    <div className={currentLocation === "delivery-order" ? "activeMenu" : "inactiveMenu"}>Delivery Order</div>
                </a>
            </div>
            <div className='logoutContainer'>
                <button className="logoutButton" onClick={userLogout}>Logout</button>
            </div>
        </div>

    )
}

export default SideBar
