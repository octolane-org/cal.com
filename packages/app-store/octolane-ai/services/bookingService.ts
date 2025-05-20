import { PAGINATION } from "@calcom/octolane-ai/constants";
import type { GetBookingsQuery, ServiceResponse, Booking } from "@calcom/octolane-ai/types";
import prisma from "@calcom/prisma";

export async function getBookings(
  userId: string,
  query: GetBookingsQuery
): Promise<ServiceResponse<Booking[]>> {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, event_type_id } = query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where = {
    userId: parseInt(userId),
    ...(event_type_id && { eventTypeId: parseInt(event_type_id) }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      select: {
        id: true,
        uid: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        status: true,
        eventType: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        attendees: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      skip,
      take: limitNumber,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: bookings,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      hasMore: pageNumber * limitNumber < total,
    },
  };
}
