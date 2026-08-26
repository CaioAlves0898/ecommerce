import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { ordersApi } from '@/services/api';
import { formatCurrency, formatDate } from '@/utils/format';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pendente', variant: 'secondary' },
  PAID: { label: 'Pago', variant: 'default' },
  SHIPPED: { label: 'Enviado', variant: 'outline' },
  DELIVERED: { label: 'Entregue', variant: 'default' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
};

export function OrdersPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAll({ limit: 50 }),
  });

  const orders = response?.data?.data || [];

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Nenhum pedido encontrado</h2>
              <p className="text-muted-foreground mt-2">Faça sua primeira compra!</p>
              <Button asChild className="mt-6">
                <Link to="/produtos">Ver produtos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const status = statusMap[order.status] || statusMap.PENDING;
              return (
                <Link key={order.id} to={`/pedidos/${order.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 && 's'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{formatCurrency(order.total)}</p>
                          <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 ml-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}