/**
 * NFT Card Component - NFT卡片组件
 * 专门用于显示NFT信息的卡片组件
 */

import * as React from 'react'
import { Heart, Eye, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardImage } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface NFTCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /* NFT基本信息 */
  name: string
  id?: string
  image?: string
  price?: string | number
  currency?: string
  likes?: number
  views?: number

  /* 集合信息 */
  collection?: string
  creator?: string
  verified?: boolean

  /* 价格信息 */
  floorPrice?: string | number
  priceChange?: number
  priceChangePercent?: string

  /* 状态信息 */
  isLiked?: boolean
  isVerified?: boolean
  isAuction?: boolean
  isSold?: boolean

  /* 交互回调 */
  onLike?: () => void
  onView?: () => void
  onBuy?: () => void
  onBid?: () => void

  /* 样式变体 */
  size?: 'sm' | 'md' | 'lg'
  showStats?: boolean
  showActions?: boolean
  interactive?: boolean
}

/**
 * NFTCard Component - NFT卡片组件
 */
export const NFTCard = React.forwardRef<HTMLDivElement, NFTCardProps>(
  (
    {
      className,
      name,
      id,
      image,
      price,
      currency = 'ETH',
      likes = 0,
      views = 0,
      collection,
      creator,
      verified = false,
      floorPrice,
      priceChange,
      priceChangePercent,
      isLiked = false,
      isVerified = false,
      isAuction = false,
      isSold = false,
      onLike,
      onView,
      onBuy,
      onBid,
      size = 'md',
      showStats = true,
      showActions = true,
      interactive = true,
      ...props
    },
    ref
  ) => {

    const sizeClasses = {
      sm: 'max-w-xs',
      md: 'max-w-sm',
      lg: 'max-w-md',
    }

    const handleLike = (e: React.MouseEvent) => {
      e.stopPropagation()
      onLike?.()
    }

    const handleBuy = (e: React.MouseEvent) => {
      e.stopPropagation()
      onBuy?.()
    }

    const handleBid = (e: React.MouseEvent) => {
      e.stopPropagation()
      onBid?.()
    }

    const formatPrice = (priceValue: string | number | undefined) => {
      if (priceValue === undefined) return null
      return `${priceValue} ${currency}`
    }

    const formatNumber = (num: number) => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`
      }
      return num.toString()
    }

    return (
      <Card
        ref={ref}
        className={cn(
          'group cursor-pointer transition-all duration-300 hover:scale-[1.02]',
          sizeClasses[size],
          className
        )}
        variant="elevated"
        interactive={interactive ? 'clickable' : 'none'}
        {...props}
      >
        {/* NFT图片 */}
        {image && (
          <CardImage
            src={image}
            alt={name}
            aspectRatio="square"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          >
            {/* 状态徽章 */}
            {(isAuction || isSold) && (
              <div className="absolute top-3 left-3">
                <Badge variant={isSold ? 'error' : 'warning'} size="sm">
                  {isSold ? 'Sold' : 'Auction'}
                </Badge>
              </div>
            )}

            {/* 喜欢按钮 */}
            {showStats && (
              <button
                onClick={handleLike}
                className={cn(
                  'absolute top-3 right-3 p-2 rounded-full',
                  'bg-black/20 backdrop-blur-sm',
                  'hover:bg-black/40 transition-colors',
                  'text-white'
                )}
              >
                <Heart
                  className={cn(
                    'w-4 h-4',
                    isLiked && 'fill-red-500 text-red-500'
                  )}
                />
              </button>
            )}
          </CardImage>
        )}

        {/* 内容区域 */}
        <CardContent className="p-4">
          {/* 头部信息 */}
          <div className="space-y-2">
            {/* 名称和ID */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                  {name}
                </h3>
                {id && (
                  <p className="text-sm text-neutral-500">{id}</p>
                )}
              </div>

              {/* 验证标识 */}
              {isVerified && (
                <div className="ml-2 flex-shrink-0">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>

            {/* 集合和创建者信息 */}
            {(collection || creator) && (
              <div className="text-sm text-neutral-600">
                {collection && <span>{collection}</span>}
                {collection && creator && <span className="mx-1">•</span>}
                {creator && <span>{creator}</span>}
              </div>
            )}
          </div>

          {/* 统计信息 */}
          {showStats && (
            <div className="flex items-center justify-between text-sm text-neutral-500 mt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{formatNumber(likes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(views)}</span>
                </div>
              </div>

              {/* 价格趋势 */}
              {priceChangePercent && (
                <div className={cn(
                  'flex items-center gap-1',
                  priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{priceChangePercent}</span>
                </div>
              )}
            </div>
          )}

          {/* 价格信息 */}
          {price && (
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Price</p>
                  <p className="text-lg font-semibold text-neutral-900">{formatPrice(price)}</p>
                </div>

                {floorPrice && (
                  <div className="text-right">
                    <p className="text-sm text-neutral-500">Floor</p>
                    <p className="text-sm font-medium text-neutral-700">{formatPrice(floorPrice)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          {showActions && !isSold && (
            <div className="mt-4 flex gap-2">
              {isAuction ? (
                <Button
                  variant="accent"
                  size="sm"
                  className="flex-1"
                  onClick={handleBid}
                >
                  Place Bid
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={handleBuy}
                >
                  Buy Now
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onView?.()
                }}
              >
                View
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

NFTCard.displayName = 'NFTCard'

/**
 * NFT Collection Card - NFT集合卡片组件
 * 用于显示NFT集合信息的卡片
 */
export interface NFTCollectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  description?: string
  image?: string
  floorPrice?: string | number
  totalVolume?: string | number
  owners?: number
  totalItems?: number
  verified?: boolean
  trending?: boolean
  onExplore?: () => void
}

export const NFTCollectionCard = React.forwardRef<HTMLDivElement, NFTCollectionCardProps>(
  (
    {
      className,
      name,
      description,
      image,
      floorPrice,
      totalVolume,
      owners,
      totalItems,
      verified = false,
      trending = false,
      onExplore,
      ...props
    },
    ref
  ) => {

    return (
      <Card
        ref={ref}
        className={cn(
          'cursor-pointer transition-all duration-300 hover:scale-[1.02]',
          className
        )}
        variant="elevated"
        interactive="clickable"
        onClick={onExplore}
        {...props}
      >
        {/* 趋势标识 */}
        {trending && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="accent" size="sm" className="animate-pulse">
              🔥 Trending
            </Badge>
          </div>
        )}

        {/* 验证标识 */}
        {verified && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        )}

        {/* 集合图片 */}
        {image && (
          <CardImage
            src={image}
            alt={name}
            aspectRatio="square"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* 内容区域 */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* 名称 */}
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
              {name}
            </h3>

            {/* 描述 */}
            {description && (
              <p className="text-sm text-neutral-600 line-clamp-2">{description}</p>
            )}

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {floorPrice && (
                <div>
                  <p className="text-neutral-500">Floor Price</p>
                  <p className="font-semibold text-neutral-900">{floorPrice} ETH</p>
                </div>
              )}

              {totalVolume && (
                <div>
                  <p className="text-neutral-500">Total Volume</p>
                  <p className="font-semibold text-neutral-900">{totalVolume} ETH</p>
                </div>
              )}

              {owners && (
                <div>
                  <p className="text-neutral-500">Owners</p>
                  <p className="font-semibold text-neutral-900">{owners.toLocaleString()}</p>
                </div>
              )}

              {totalItems && (
                <div>
                  <p className="text-neutral-500">Items</p>
                  <p className="font-semibold text-neutral-900">{totalItems.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

NFTCollectionCard.displayName = 'NFTCollectionCard'

/**
 * NFT Grid - NFT网格组件
 * 用于展示多个NFT的网格布局
 */
export interface NFTGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<NFTCardProps>[]
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const NFTGrid = React.forwardRef<HTMLDivElement, NFTGridProps>(
  ({ className, children, columns = 4, gap = 'md', ...props }, ref) => {

    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    }

    const gapClasses = {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          columnClasses[columns],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NFTGrid.displayName = 'NFTGrid'

export { NFTCard, NFTCollectionCard, NFTGrid }
export type { NFTCardProps, NFTCollectionCardProps, NFTGridProps }