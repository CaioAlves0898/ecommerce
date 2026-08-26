import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { productsApi, categoriesApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { slug } = useParams();
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const categoryId = searchParams.get('categoryId') || undefined;

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll({ limit: 50 }),
  });

  const categoryFromSlug = categoryData?.data?.data?.find((c: any) => c.slug === slug);

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', { search, sortBy, sortOrder, categoryId, slug, ...filters }],
    queryFn: () =>
      slug
        ? productsApi.getByCategory(slug, { page: 1, limit: 50, sortBy, sortOrder })
        : productsApi.getAll({
            search,
            sortBy,
            sortOrder,
            categoryId,
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
            inStock: filters.inStock || undefined,
            limit: 50,
          }),
  });

  const products = productsResponse?.data?.data || [];
  const pageTitle = categoryFromSlug?.name || slug?.replace(/-/g, ' ') || 'Todos os Produtos';

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold capitalize">{pageTitle}</h1>
          {search && <p className="text-muted-foreground mt-1">Resultados para &quot;{search}&quot;</p>}
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!slug && (
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={categoryId || 'all'}
                      onValueChange={(v) => {
                        const params = new URLSearchParams(searchParams);
                        if (v === 'all') params.delete('categoryId');
                        else params.set('categoryId', v);
                        navigate({ search: params.toString() });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {categoryData?.data?.data?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Preço mín.</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preço máx.</Label>
                  <Input
                    type="number"
                    placeholder="9999"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="inStock" className="text-sm">Apenas em estoque</Label>
                </div>

                <Button variant="ghost" size="sm" className="w-full" onClick={() => setFilters({ minPrice: '', maxPrice: '', inStock: false })}>
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {products.length} produto{products.length !== 1 && 's'}
              </p>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(v) => {
                  const [sb, so] = v.split('-');
                  const params = new URLSearchParams(searchParams);
                  params.set('sortBy', sb);
                  params.set('sortOrder', so);
                  navigate({ search: params.toString() });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Mais recentes</SelectItem>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                  <SelectItem value="name-asc">Nome A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-lg font-medium">Nenhum produto encontrado</p>
                  <p className="text-sm text-muted-foreground mt-1">Tente ajustar os filtros ou buscar por outro termo.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}