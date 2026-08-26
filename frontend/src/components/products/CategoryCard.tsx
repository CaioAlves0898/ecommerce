import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    icon: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/categoria/${category.slug}`} className="group">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">{category.icon}</div>
          <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
          <span className="inline-flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
            Ver produtos
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}