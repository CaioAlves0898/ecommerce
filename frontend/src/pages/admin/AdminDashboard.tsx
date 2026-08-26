import { useQuery } from '@tanstack/react-query';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { productsApi, ordersApi, usersApi, categoriesApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';

export function AdminDashboard() {
  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: () => productsApi.getAll({ limit: 1 }),
  });

  const { data: ordersRes, isLoading: loadingOrders } = useQuery({
    queryKey: ['admin-orders-count'],
    queryFn: () => ordersApi.getAll({ limit: 1 }),
  });

  const { data: usersRes, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: () => usersApi.getAll({ limit: 1 }),
  });

  const { data: categoriesRes, isLoading: loadingCategories } = useQuery({
    queryKey: ['admin-categories-count'],
    queryFn: () => categoriesApi.getAll({ limit: 1 }),
  });

  const totalProducts = productsRes?.data?.meta?.total || 0;
  const totalOrders = ordersRes?.data?.meta?.total || 0;
  const totalUsers = usersRes?.data?.meta?.total || 0;
  const totalCategories = categoriesRes?.data?.meta?.total || 0;

  const stats = [
    { label: 'Produtos', value: totalProducts, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Pedidos', value: totalOrders, icon: ShoppingCart, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Usuários', value: totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Categorias', value: totalCategories, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const isLoading = loadingProducts || loadingOrders || loadingUsers || loadingCategories;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral</h2>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersRes?.data?.data?.length > 0 ? (
              <div className="space-y-4">
                {ordersRes.data.data.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.name}</p>
                    </div>
                    <p className="font-medium text-primary">{formatCurrency(order.total)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum pedido ainda</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            {productsRes?.data?.data?.length > 0 ? (
              <div className="space-y-4">
                {productsRes.data.data.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                    </div>
                    <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {product.stock} un.
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum produto cadastrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}