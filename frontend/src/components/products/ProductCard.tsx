import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const image = product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  if (compact) {
    return (
      <Link to={`/produtos/${product.id}`} className="flex gap-4 group">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {image ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm font-semibold text-primary mt-1">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-lg">
      <Link to={`/produtos/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium px-3 py-1 rounded bg-destructive">Indisponível</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="flex-1 p-4">
        <Link to={`/produtos/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">{product.name}</h3>
        </Link>
        {product.category && (
          <p className="text-xs text-muted-foreground mb-2">{product.category.name}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Últimas {product.stock} unidades</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={product.stock === 0 ? 'Produto indisponível' : `Adicionar ${product.name} ao carrinho`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? 'Indisponível' : 'Adicionar'}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Adicionar à lista de desejos">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}