import React from 'react'
import { Outlet } from 'react-router'
import Redirects from './Redirects'
import { checkIsAuthorized } from '../utils/isAuth'
export default function PrivateRoute() {
  return (
    <>
    {
      checkIsAuthorized()? <Outlet/>:<Redirects/>
    }
    </>
  )
}
