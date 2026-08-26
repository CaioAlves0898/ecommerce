import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, FormEvent } from 'react';

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary" aria-label="Home">
            E-Shop
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link to="/categorias" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Categorias
            </Link>
            <Link to="/produtos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Produtos
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full" role="search">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              aria-label="Buscar produtos"
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" asChild aria-label={`Carrinho (${itemCount} itens)`}>
            <Link to="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </Button>

          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" aria-hidden="true" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="w-full">Minha Conta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pedidos" className="w-full">Meus Pedidos</Link>
                </DropdownMenuItem>
                {user?.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full">Painel Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/cadastro">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-4">
          <div className="flex flex-col gap-4">
            <Link to="/categorias" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Categorias
            </Link>
            <Link to="/produtos" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Produtos
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Entrar</Button>
                </Link>
                <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}