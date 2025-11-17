/**
 * =====================================================
 * GIFT HISTORY PAGE
 * =====================================================
 * View history of sent and received gifts
 * =====================================================
 */

'use client'

import { useState } from 'react'
import { Gift, Heart, Package, Calendar, MapPin, Truck, CheckCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/common/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/components/ui/tabs'
import { Badge } from '@/shared/common/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import { Separator } from '@/shared/common/components/ui/separator'
import { EmptyState } from '@/shared/common/components/shared/EmptyState'
import { LoadingSpinner } from '@/shared/common/components/shared/LoadingSpinner'
import { useGiftHistory } from '@/features/gift-flow/hooks/use-gift-flow'
import { formatGiftAmount, formatGiftDate, getShippingStatusColor, formatShippingStatus } from '@/features/gift-flow/lib/gift-utils'
import { cn } from '@/shared/common/lib/utils'

export default function GiftHistoryPage() {
  const { sentGifts, receivedGifts, totalSent, totalReceived, isLoading } = useGiftHistory()
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Cargando historial..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Historial de Regalos</h1>
        <p className="text-muted-foreground mt-2">
          Revisa los regalos que has enviado y recibido
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regalos Enviados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-3xl font-bold">{totalSent}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regalos Recibidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gift className="h-8 w-8 text-violet-500" />
              <span className="text-3xl font-bold">{totalReceived}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'sent' | 'received')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sent">
            Enviados ({totalSent})
          </TabsTrigger>
          <TabsTrigger value="received">
            Recibidos ({totalReceived})
          </TabsTrigger>
        </TabsList>

        {/* Sent Gifts Tab */}
        <TabsContent value="sent" className="mt-6">
          {sentGifts.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No has enviado regalos aún"
              description="Cuando envíes regalos a tus amigos, aparecerán aquí"
              actionLabel="Ver Amigos"
              actionHref="/friends"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentGifts.map((gift) => (
                <Card key={gift.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                    <img
                      src={
                        gift.product.image_url ||
                        `https://placehold.co/400x400/e5e7eb/6b7280?text=${encodeURIComponent(gift.product.name)}`
                      }
                      alt={gift.product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-medium',
                          `bg-${getShippingStatusColor(gift.shipping_status)}-100 text-${getShippingStatusColor(gift.shipping_status)}-800 border-${getShippingStatusColor(gift.shipping_status)}-300`
                        )}
                      >
                        {formatShippingStatus(gift.shipping_status)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{gift.product.name}</h3>
                      {gift.product.brand && (
                        <p className="text-sm text-muted-foreground">{gift.product.brand}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={gift.recipient.avatar_url || undefined}
                          alt={gift.recipient.name}
                        />
                        <AvatarFallback className="text-xs">
                          {gift.recipient.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Para {gift.recipient.name}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatGiftDate(gift.created_at)}</span>
                      </div>
                      <span className="font-bold text-lime-600 dark:text-lime-400">
                        {formatGiftAmount(gift.amount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Received Gifts Tab */}
        <TabsContent value="received" className="mt-6">
          {receivedGifts.length === 0 ? (
            <EmptyState
              icon={Gift}
              title="No has recibido regalos aún"
              description="Cuando tus amigos te regalen productos, aparecerán aquí"
            />
          ) : (
            <div className="space-y-4">
              {receivedGifts.map((gift) => (
                <Card key={gift.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={
                            gift.product.image_url ||
                            `https://placehold.co/400x400/e5e7eb/6b7280?text=${encodeURIComponent(gift.product.name)}`
                          }
                          alt={gift.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">{gift.product.name}</h3>
                          {gift.product.brand && (
                            <p className="text-sm text-muted-foreground">{gift.product.brand}</p>
                          )}
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span>Talla: {gift.product.size}</span>
                            <span>•</span>
                            <span>Color: {gift.product.color}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-rose-500" />
                          <span className="text-sm">
                            Regalo de <span className="font-medium">{gift.buyer.name}</span>
                          </span>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">{gift.store.name}</p>
                              <p className="text-muted-foreground">{gift.store.address}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">{formatShippingStatus(gift.shipping_status)}</p>
                              {gift.delivered_at ? (
                                <p className="text-muted-foreground">
                                  Entregado {formatGiftDate(gift.delivered_at)}
                                </p>
                              ) : (
                                <p className="text-muted-foreground">
                                  Comprado {formatGiftDate(gift.created_at)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-start">
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-medium',
                            gift.shipping_status === 'delivered'
                              ? 'bg-lime-100 text-lime-800 border-lime-300'
                              : 'bg-sky-100 text-sky-800 border-sky-300'
                          )}
                        >
                          {gift.shipping_status === 'delivered' ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Entregado
                            </>
                          ) : (
                            <>
                              <Package className="mr-1 h-3 w-3" />
                              En camino
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
