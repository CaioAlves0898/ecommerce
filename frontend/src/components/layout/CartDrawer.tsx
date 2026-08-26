import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, total, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300',
          animate ? 'opacity-100' : 'opacity-0'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-sm bg-background shadow-xl transition-transform duration-300',
          animate ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-label="Carrinho de compras"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Carrinho ({items.length})</h2>
            <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Fechar carrinho">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="h-16 w-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="mt-4 text-muted-foreground">Seu carrinho está vazio</p>
                <Button onClick={closeCart} className="mt-4">Continuar comprando</Button>
              </div>
            ) : (
              <ul className="space-y-4" role="list" aria-label="Itens do carrinho">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          aria-label={`Remover ${item.product.name}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Diminuir quantidade"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground ml-2">Estoque: {item.product.stock}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart} className="flex-1" disabled={items.length === 0}>
                  Limpar carrinho
                </Button>
                <Button className="flex-1" asChild>
                  <Link to="/checkout">Finalizar compra</Link>
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={closeCart}>
                Continuar comprando
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}