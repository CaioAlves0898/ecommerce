import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingBag, Sparkles, Truck, Shield, Headphones } from 'lucide-react';
import { productsApi } from '@/services/api';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryCard } from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { name: 'Eletrodomésticos', slug: 'eletrodomesticos', icon: '🏠' },
  { name: 'Computadores', slug: 'computadores', icon: '💻' },
  { name: 'Cozinha', slug: 'cozinha', icon: '🍳' },
  { name: 'Celulares', slug: 'celulares', icon: '📱' },
  { name: 'TVs e Áudio', slug: 'tvs-audio', icon: '📺' },
  { name: 'Móveis', slug: 'moveis', icon: '🛋️' },
];

export function HomePage() {
  const { data: productsResponse } = useQuery({
    queryKey: ['products', { limit: 8 }],
    queryFn: () => productsApi.getAll({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' }),
  });

  const featuredProducts = productsResponse?.data?.data || [];

  return (
    <div className="space-y-16 py-8">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Tudo para sua casa <span className="text-primary">em um só lugar</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Descubra milhares de produtos com os melhores preços, entrega rápida e compra segura.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/produtos">Ver todos os produtos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/categorias">Explorar categorias</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Categorias populares</h2>
              <p className="text-muted-foreground">Encontre o que você precisa</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/categorias">Ver todas <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Novidades</h2>
              <p className="text-muted-foreground">Produtos recém-chegados</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/produtos?sortBy=createdAt&sortOrder=desc">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {featuredProducts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Frete Grátis</h3>
                <p className="text-sm text-muted-foreground mt-1">Acima de R$ 299,00 para todo Brasil</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Compra Segura</h3>
                <p className="text-sm text-muted-foreground mt-1">Seus dados protegidos com criptografia</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Suporte 24/7</h3>
                <p className="text-sm text-muted-foreground mt-1">Atendimento humanizado sempre disponível</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Cadastre-se e ganhe 10% OFF</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Receba ofertas exclusivas, novidades e cupons de desconto diretamente no seu email.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
              aria-label="Email para newsletter"
            />
            <Button size="lg">Cadastrar</Button>
          </form>
        </div>
      </section>
    </div>
  );
}