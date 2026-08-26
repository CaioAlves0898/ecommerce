import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { categoriesApi } from '@/services/api';
import { slugify } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'react-hot-toast';

interface CategoryForm { name: string; slug: string; description: string; }
const emptyForm: CategoryForm = { name: '', slug: '', description: '' };

export function AdminCategories() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-categories', search, page],
    queryFn: () => categoriesApi.getAll({ limit: 10, search, page }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Categoria criada!'); setDialogOpen(false); setForm(emptyForm); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro ao criar'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoriesApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Categoria atualizada!'); setDialogOpen(false); setEditingId(null); setForm(emptyForm); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro ao atualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Categoria excluída!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro ao excluir'),
  });

  const categories = response?.data?.data || [];
  const meta = response?.data?.meta;

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (c: any) => { setForm({ name: c.name, slug: c.slug, description: c.description || '' }); setEditingId(c.id); setDialogOpen(true); };

  const handleSubmit = () => {
    if (editingId) updateMutation.mutate({ id: editingId, data: form });
    else createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Nova categoria</Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Buscar categoria..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />
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
                    <th className="text-left p-4 font-medium">Nome</th>
                    <th className="text-left p-4 font-medium">Slug</th>
                    <th className="text-left p-4 font-medium">Descrição</th>
                    <th className="text-right p-4 font-medium">Produtos</th>
                    <th className="text-right p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat: any) => (
                    <tr key={cat.id} className="border-b last:border-0">
                      <td className="p-4 font-medium">{cat.name}</td>
                      <td className="p-4 text-muted-foreground">{cat.slug}</td>
                      <td className="p-4 text-muted-foreground max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="p-4 text-right">{cat._count?.products || 0}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir esta categoria?')) deleteMutation.mutate(cat.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhuma categoria encontrada</td></tr>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!form.name || !form.slug}>
              {createMutation.isPending || updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}