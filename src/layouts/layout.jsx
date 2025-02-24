import React, { Children } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
    <div>
      <Header /> {/* El Header está aquí */}
      <div className="content">
        <Outlet /> {/* Las rutas se renderizan aquí */}
      </div>
    </div>
    </>
  )
}
