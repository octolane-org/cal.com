import { PAGINATION } from "@calcom/octolane-ai/constants";
import type { EventType, GetEventTypesQuery, ServiceResponse } from "@calcom/octolane-ai/types";
import prisma from "@calcom/prisma";

export async function getEventTypes(
  userId: string,
  query: GetEventTypesQuery
): Promise<ServiceResponse<EventType[]>> {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where = {
    userId: parseInt(userId),
  };

  const [eventTypes, total] = await Promise.all([
    prisma.eventType.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        length: true,
        slug: true,
        hidden: true,
        schedulingType: true,
        customInputs: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      skip,
      take: limitNumber,
    }),
    prisma.eventType.count({ where }),
  ]);

  const formattedEventTypes: EventType[] = eventTypes.map((eventType) => ({
    ...eventType,
    totalBookings: eventType._count.bookings,
    _count: undefined,
  }));

  return {
    data: formattedEventTypes,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      hasMore: pageNumber * limitNumber < total,
    },
  };
}
