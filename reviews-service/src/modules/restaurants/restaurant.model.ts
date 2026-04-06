import { prisma } from "../../utils/prisma";

export const RestaurantModel = {
  findAll() {
    return prisma.restaurant.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  },

  findById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },

  findByName(name: string) {
    return prisma.restaurant.findUnique({
      where: { name },
    });
  },

  create(data: { name: string }) {
    return prisma.restaurant.create({
      data,
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  },

  update(id: string, data: { name?: string }) {
    return prisma.restaurant.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  },

  delete(id: string) {
    return prisma.restaurant.delete({
      where: { id },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  },
};
