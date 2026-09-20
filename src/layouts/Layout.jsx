import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isPropertyDetails = pathname.startsWith('/properties/')

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <Navbar isHome={isHome} />
      <main>
        <Outlet />
      </main>
      {!isPropertyDetails && <Footer />}
    </div>
  )
}
