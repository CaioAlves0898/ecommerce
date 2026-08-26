import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';

export function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-20 text-center">
              <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-8">Adicione produtos ao carrinho para continuar comprando.</p>
              <Button asChild size="lg">
                <Link to="/produtos">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver produtos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <Link to="/produtos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar comprando
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Meu Carrinho</h1>
          <p className="text-muted-foreground mt-1">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4 sm:gap-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-32">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            to={`/produtos/${item.product.id}`}
                            className="text-lg font-semibold hover:underline line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                            className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground mt-1">{formatCurrency(item.product.price)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-muted-foreground">Estoque: {item.product.stock}</span>
                        </div>
                        <p className="text-lg font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar carrinho
            </Button>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Resumo</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="w-full" asChild>
                  <Link to="/checkout">Finalizar compra</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}