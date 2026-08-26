import { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, total, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'hsl(var(--background))',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid hsl(var(--border))' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Carrinho ({items.length})</h2>
          <button
            onClick={closeCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <ShoppingCart style={{ width: '64px', height: '64px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }} />
              <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>Seu carrinho está vazio</p>
              <Button onClick={closeCart}>Continuar comprando</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', backgroundColor: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingCart style={{ width: '24px', height: '24px', color: 'hsl(var(--muted-foreground))' }} />
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: 1.3 }}>{item.product.name}</span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px', color: 'hsl(var(--muted-foreground))' }} />
                      </button>
                    </div>

                    <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>{formatCurrency(item.product.price)}</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid hsl(var(--border))', borderRadius: '4px', background: 'hsl(var(--background))', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.5 : 1 }}
                      >
                        <Minus style={{ width: '14px', height: '14px' }} />
                      </button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid hsl(var(--border))', borderRadius: '4px', background: 'hsl(var(--background))', cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer', opacity: item.quantity >= item.product.stock ? 0.5 : 1 }}
                      >
                        <Plus style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid hsl(var(--border))', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ color: 'hsl(var(--primary))' }}>{formatCurrency(total)}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" onClick={clearCart} style={{ flex: 1 }}>Limpar</Button>
              <Button onClick={closeCart} asChild style={{ flex: 1 }}>
                <Link to="/checkout">Finalizar</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}