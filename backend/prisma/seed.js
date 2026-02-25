const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const services = [
    {
      name: "Plumbing Repair",
      description: "Fix leaks, clogged drains, and broken fixtures.",
      imageUrl:
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
      basePrice: 90,
      durationMin: 90,
    },
    {
      name: "Tile Installation",
      description: "Floor and wall tile installation for kitchens and bathrooms.",
      imageUrl:
        "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=1200",
      basePrice: 140,
      durationMin: 180,
    },
    {
      name: "Interior Painting",
      description: "Wall prep and painting for rooms and hallways.",
      imageUrl:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80",
      basePrice: 120,
      durationMin: 240,
    },
    {
      name: "Electrical Maintenance",
      description: "Sockets, switches, and basic electrical troubleshooting.",
      imageUrl:
        "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1200",
      basePrice: 100,
      durationMin: 120,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      create: service,
      update: {
        description: service.description,
        imageUrl: service.imageUrl,
        basePrice: service.basePrice,
        durationMin: service.durationMin,
        active: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
