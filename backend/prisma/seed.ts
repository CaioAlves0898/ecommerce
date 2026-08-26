import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Eletrodomésticos', slug: 'eletrodomesticos', description: 'Eletrodomésticos para sua casa' },
  { name: 'Computadores', slug: 'computadores', description: 'Notebooks, desktops e acessórios' },
  { name: 'Cozinha', slug: 'cozinha', description: 'Utensílios e eletroportáteis para cozinha' },
  { name: 'Celulares', slug: 'celulares', description: 'Smartphones e acessórios' },
  { name: 'TVs e Áudio', slug: 'tvs-audio', description: 'Televisores, soundbars e fones de ouvido' },
  { name: 'Móveis', slug: 'moveis', description: 'Móveis para sala, quarto e escritório' },
  { name: 'Ferramentas', slug: 'ferramentas', description: 'Ferramentas elétricas e manuais' },
  { name: 'Beleza e Saúde', slug: 'beleza-saude', description: 'Produtos de beleza, cuidados pessoais e saúde' },
];

const products = [
  // Eletrodomésticos
  { name: 'Geladeira Frost Free 400L', description: 'Geladeira duplex com freezer embaixo', price: 2899.90, stock: 15, categorySlug: 'eletrodomesticos', images: [] },
  { name: 'Lava e Seca 11kg', description: 'Lava e seca com tecnologia AI', price: 3499.90, stock: 8, categorySlug: 'eletrodomesticos', images: [] },
  { name: 'Micro-ondas 30L', description: 'Micro-ondas com grill e receitas pré-programadas', price: 599.90, stock: 25, categorySlug: 'eletrodomesticos', images: [] },
  { name: 'Fogão 5 Bocas', description: 'Fogão a gás com acendimento automático', price: 1299.90, stock: 12, categorySlug: 'eletrodomesticos', images: [] },
  { name: 'Ar Condicionado 12000 BTUs', description: 'Split inverter quente/frio', price: 2199.90, stock: 10, categorySlug: 'eletrodomesticos', images: [] },
  
  // Computadores
  { name: 'Notebook Gamer RTX 4060', description: 'Intel i7, 16GB RAM, 512GB SSD, 15.6"', price: 5499.90, stock: 7, categorySlug: 'computadores', images: [] },
  { name: 'Notebook Ultrabook 14"', description: 'Intel i5, 8GB RAM, 256GB SSD, leve e fino', price: 3299.90, stock: 15, categorySlug: 'computadores', images: [] },
  { name: 'PC Gamer Desktop RTX 4070', description: 'Ryzen 7, 32GB RAM, 1TB NVMe', price: 7999.90, stock: 5, categorySlug: 'computadores', images: [] },
  { name: 'Monitor 27" 144Hz', description: 'IPS, 1ms, FreeSync Premium', price: 1199.90, stock: 20, categorySlug: 'computadores', images: [] },
  { name: 'Teclado Mecânico RGB', description: 'Switch Red, ABNT2, iluminação RGB', price: 349.90, stock: 30, categorySlug: 'computadores', images: [] },
  { name: 'Mouse Gamer Sem Fio', description: '25600 DPI, 70h bateria, ultraleve', price: 299.90, stock: 25, categorySlug: 'computadores', images: [] },
  
  // Cozinha
  { name: 'Air Fryer 5.5L', description: 'Cesta quadrada, 10 receitas pré-definidas', price: 449.90, stock: 35, categorySlug: 'cozinha', images: [] },
  { name: 'Liquidificador 1400W', description: '6 lâminas, copo de vidro 3L', price: 279.90, stock: 18, categorySlug: 'cozinha', images: [] },
  { name: 'Batedeira Planetária', description: '10 velocidades, tigela 4.5L', price: 599.90, stock: 12, categorySlug: 'cozinha', images: [] },
  { name: 'Processador de Alimentos', description: '800W, 12 funções, 2.5L', price: 389.90, stock: 15, categorySlug: 'cozinha', images: [] },
  { name: 'Cafeteira Expresso', description: '15 bar, compatível com cápsulas', price: 699.90, stock: 10, categorySlug: 'cozinha', images: [] },
  
  // Celulares
  { name: 'iPhone 15 Pro 128GB', description: 'Titânio, A17 Pro, câmera 48MP', price: 7499.90, stock: 8, categorySlug: 'celulares', images: [] },
  { name: 'Galaxy S24 Ultra 256GB', description: 'Snapdragon 8 Gen 3, S Pen, 200MP', price: 6999.90, stock: 10, categorySlug: 'celulares', images: [] },
  { name: 'Motorola Edge 50 Pro', description: 'Snapdragon 7 Gen 3, 12GB/512GB', price: 2899.90, stock: 15, categorySlug: 'celulares', images: [] },
  { name: 'Xiaomi 14 512GB', description: 'Snapdragon 8 Gen 3, Leica, 120W', price: 4299.90, stock: 12, categorySlug: 'celulares', images: [] },
  
  // TVs e Áudio
  { name: 'TV OLED 55" 4K', description: 'Dolby Vision, HDMI 2.1, 120Hz', price: 4999.90, stock: 8, categorySlug: 'tvs-audio', images: [] },
  { name: 'TV QLED 65" 4K', description: 'Quantum Dot, Gaming Hub, 120Hz', price: 3899.90, stock: 10, categorySlug: 'tvs-audio', images: [] },
  { name: 'Soundbar 3.1 Canais', description: '380W, Dolby Atmos, subwoofer sem fio', price: 1499.90, stock: 12, categorySlug: 'tvs-audio', images: [] },
  { name: 'Fone Bluetooth ANC', description: 'Cancelamento ativo, 30h bateria', price: 899.90, stock: 20, categorySlug: 'tvs-audio', images: [] },
  
  // Móveis
  { name: 'Sofá 3 Lugares Retrátil', description: 'Tecido linho, assento retrátil', price: 2499.90, stock: 6, categorySlug: 'moveis', images: [] },
  { name: 'Mesa de Jantar 6 Lugares', description: 'MDF com tampo de vidro', price: 899.90, stock: 8, categorySlug: 'moveis', images: [] },
  { name: 'Cama Box Casal + Colchão', description: 'Molha ensacada, tecido antiácaro', price: 1899.90, stock: 10, categorySlug: 'moveis', images: [] },
  { name: 'Guarda-Roupa 6 Portas', description: 'MDF, 3 gavetas, espelho', price: 1599.90, stock: 7, categorySlug: 'moveis', images: [] },
  
  // Ferramentas
  { name: 'Furadeira Parafusadeira 18V', description: 'Brushless, 2 baterias, maleta', price: 499.90, stock: 18, categorySlug: 'ferramentas', images: [] },
  { name: 'Serra Circular 1400W', description: 'Disco 7.1/4", base alumínio', price: 389.90, stock: 12, categorySlug: 'ferramentas', images: [] },
  { name: 'Lixadeira Orbital 300W', description: 'Velocidade variável, coletor pó', price: 249.90, stock: 15, categorySlug: 'ferramentas', images: [] },
  
  // Beleza e Saúde
  { name: 'Secador Profissional 2200W', description: 'Íon, 3 temperaturas, 2 velocidades', price: 299.90, stock: 22, categorySlug: 'beleza-saude', images: [] },
  { name: 'Chapinha Cerâmica', description: 'Turmalina, 230°C, bivolt', price: 189.90, stock: 25, categorySlug: 'beleza-saude', images: [] },
  { name: 'Massageador Percussão', description: '20 velocidades, 6 ponteiras', price: 349.90, stock: 15, categorySlug: 'beleza-saude', images: [] },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created: admin@ecommerce.com / admin123');

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@ecommerce.com' },
    update: {},
    create: {
      email: 'customer@ecommerce.com',
      name: 'Cliente Teste',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created: customer@ecommerce.com / customer123');

  // Create categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Create products
  for (const prod of products) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });
    if (category) {
      await prisma.product.upsert({
        where: { 
          id: `${prod.name.toLowerCase().replace(/\s+/g, '-')}-${category.id.slice(0, 8)}` 
        },
        update: {},
        create: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          images: prod.images,
          categoryId: category.id,
        },
      });
    }
  }
  console.log('✅ Products created');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });