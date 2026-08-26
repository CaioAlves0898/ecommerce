import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye } from 'lucide-react';
import { ordersApi } from '@/services/api';
import { formatCurrency, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'react-hot-toast';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pendente', variant: 'secondary' },
  PAID: { label: 'Pago', variant: 'default' },
  SHIPPED: { label: 'Enviado', variant: 'outline' },
  DELIVERED: { label: 'Entregue', variant: 'default' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
};

export function AdminOrders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, page],
    queryFn: () => ordersApi.getAll({ limit: 10, page, status: statusFilter === 'all' ? undefined : statusFilter }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersApi.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Status atualizado!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro ao atualizar status'),
  });

  const orders = response?.data?.data || [];
  const meta = response?.data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(statusMap).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Pedido</th>
                    <th className="text-left p-4 font-medium">Cliente</th>
                    <th className="text-left p-4 font-medium">Data</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Total</th>
                    <th className="text-right p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => {
                    return (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="p-4 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="p-4">{order.user?.name || '-'}</td>
                        <td className="p-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                        <td className="p-4">
                          <Select value={order.status} onValueChange={(v) => updateStatusMutation.mutate({ id: order.id, status: v })}>
                            <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusMap).map(([key, val]) => (
                                <SelectItem key={key} value={key}>{val.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-right font-medium">{formatCurrency(order.total)}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/pedidos/${order.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum pedido encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {meta && (
              <div className="px-4 py-3 border-t text-sm text-muted-foreground">
                Página {meta.page} de {meta.totalPages} · {meta.total} registro{meta.total !== 1 && 's'}
              </div>
            )}
            {meta && (
              <div className="px-4 pb-4">
                <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}