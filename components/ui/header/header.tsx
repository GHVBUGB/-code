/**
 * Header Component - 头部导航组件
 * 基于原项目的header设计，重构为可复用组件
 */

import * as React from 'react'
import { Star, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: {
    icon?: React.ReactNode
    text?: string
    href?: string
  }
  navigation?: Array<{
    label: string
    href: string
    active?: boolean
  }>
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  actions?: React.ReactNode
  variant?: 'default' | 'transparent' | 'glass'
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      logo = { icon: <Star />, text: 'Searcher', href: '/' },
      navigation = [],
      showSearch = true,
      searchPlaceholder = 'Search',
      onSearch,
      actions,
      variant = 'default',
      ...props
    },
    ref
  ) => {

    const variantClasses = {
      default: 'bg-gray-900 border-b border-gray-800',
      transparent: 'bg-transparent',
      glass: 'bg-white/10 backdrop-blur-md border-b border-white/20',
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch?.(e.target.value)
    }

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-50 w-full',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <Container
          className="flex items-center justify-between py-4"
          size="xl"
        >
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {logo.icon && (
              <a
                href={logo.href}
                className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg"
              >
                <div className="text-white">{logo.icon}</div>
              </a>
            )}
            {logo.text && (
              <a
                href={logo.href}
                className="text-xl font-bold text-white hover:text-orange-400 transition-colors"
              >
                {logo.text}
              </a>
            )}
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-full"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          {navigation.length > 0 && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    item.active
                      ? 'text-orange-400'
                      : 'text-gray-300 hover:text-white'
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {actions || (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <div className="w-6 h-6 rounded-full bg-gray-600" />
              </Button>
            )}
          </div>
        </Container>
      </header>
    )
  }
)

Header.displayName = 'Header'

export { Header }
export type { HeaderProps }