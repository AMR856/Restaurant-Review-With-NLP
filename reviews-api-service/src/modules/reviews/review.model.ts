import { prisma } from "../../utils/prisma";

export const ReviewModel = {
  findAll() {
    return prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findByRestaurantId(restaurantId: string) {
    return prisma.review.findMany({
      where: { restaurantId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  create(data: {
    content: string;
    restaurantId: string;
    sentiment: string | null;
    confidence: number | null;
  }) {
    return prisma.review.create({
      data,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  update(
    id: string,
    data: {
      content?: string;
      sentiment?: string | null;
      confidence?: number | null;
    },
  ) {
    const reviewData: {
      content?: string;
      sentiment?: { set?: string | null };
      confidence?: { set?: number | null };
    } = {
      content: data.content,
      sentiment: { set: data.sentiment ?? null },
      confidence: { set: data.confidence ?? null },
    };

    return prisma.review.update({
      where: { id },
      data: reviewData,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  delete(id: string) {
    return prisma.review.delete({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
};