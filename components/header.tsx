'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/store'
import { toggleMobileMenu } from '@/lib/slices/uiSlice'
import { logout } from '@/lib/slices/authSlice'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const mobileMenuOpen = useSelector((state: RootState) => state.ui.mobileMenuOpen)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const navItems = [
    { name: 'Services', href: '/services' },
    { name: 'For Business', href: '/for-business' },
    { name: 'Stories', href: '/stories' }, // Updated link
    { name: 'About', href: '/about' }
  ]

  const handleLogout = () => {
    dispatch(logout())
    if (mobileMenuOpen) {
      dispatch(toggleMobileMenu())
    }
  }

  return (
    <header className="bg-[#060608] border-b border-[#4a4b4d]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#fbbf24] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#060608] rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-white">BikeService</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href
                    ? 'text-[#fbbf24]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#fbbf24]" />
                  <span className="text-white text-sm">{user?.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-[#4a4b4d] text-white hover:bg-[#3c3d3f]"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black">
                  Account
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-[#3c3d3f]"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-[#4a4b4d] pt-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 transition-colors ${
                  pathname === item.href
                    ? 'text-[#fbbf24]'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => dispatch(toggleMobileMenu())}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="pt-4 border-t border-[#4a4b4d] mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-[#fbbf24]" />
                  <span className="text-white">{user?.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-[#4a4b4d] text-white hover:bg-[#3c3d3f]"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#4a4b4d] mt-4">
                <Link href="/login" className="block">
                  <Button
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black"
                  >
                    Account
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
