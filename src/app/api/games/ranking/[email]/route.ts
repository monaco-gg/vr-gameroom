import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Ticket from "@models/Ticket";
import { getServerSession } from "next-auth/next";
import { isValidISO8601Date, isStartDateBeforeEndDate } from "@utils/index";

/**
 * Handle GET request to retrieve ticket information.
 *
 * @param {string} email - The email of the user making the request.
 * @param {string} [gameId] - The gameId to filter tickets.
 * @param {string} [startDate] - The start date for the date range filter.
 * @param {string} [endDate] - The end date for the date range filter.
 * @returns {Promise<NextResponse>}
 */
const handleGetRequest = async (
  email: string,
  gameId?: string,
  startDate?: string,
  endDate?: string
): Promise<NextResponse> => {
  await dbConnect();

  try {
    const matchStage: any = {};
    if (gameId) {
      matchStage.gameId = gameId;
    }
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    const tickets = await Ticket.aggregate(
      [
        { $match: matchStage },
        {
          $group: {
            _id: "$user",
            totalMatches: {
              $sum: {
                $cond: [{ $ifNull: ["$gameId", false] }, 1, 0],
              },
            },
            totalTickets: { $sum: "$amount" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $project: {
            _id: 0,
            user: "$_id",
            totalMatches: 1,
            totalTickets: 1,
            createdAt: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  photo: 1,
                  nickname: 1,
                  email: 1,
                  name: 1,
                },
              },
            ],
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $sort: {
            totalTickets: -1,
            totalMatches: -1,
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: null,
            allDocs: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            rankedDocs: {
              $map: {
                input: "$allDocs",
                as: "doc",
                in: {
                  $mergeObjects: [
                    "$$doc",
                    { rank: { $indexOfArray: ["$allDocs", "$$doc"] } },
                  ],
                },
              },
            },
          },
        },
        { $unwind: "$rankedDocs" },
        { $replaceRoot: { newRoot: "$rankedDocs" } },
        { $addFields: { rank: { $add: ["$rank", 1] } } },
        { $match: { "user.email": email } },
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    );

    const headers = new Headers({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    return new NextResponse(JSON.stringify({ data: tickets }), {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving tickets:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Ocorreu um erro no servidor",
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
};

/**
 * Main handler function that directs to specific functions based on the HTTP method.
 *
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>}
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = req.nextUrl.pathname.split("/").pop();
    const gameId = searchParams.get("gameId") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    if (typeof email !== "string") {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email parameter." }),
        { status: 400 }
      );
    }

    if (startDate && !isValidISO8601Date(startDate)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid startDate parameter." }),
        { status: 400 }
      );
    }

    if (endDate && !isValidISO8601Date(endDate)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid endDate parameter." }),
        { status: 400 }
      );
    }

    if (startDate && endDate && !isStartDateBeforeEndDate(startDate, endDate)) {
      return new NextResponse(
        JSON.stringify({ message: "startDate cannot be after endDate." }),
        { status: 400 }
      );
    }

    return handleGetRequest(email, gameId, startDate, endDate);
  } catch (error) {
    console.error("A server error occurred:", error);
    return new NextResponse(
      JSON.stringify({
        message: "A server error occurred",
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
  });
}

export async function PATCH(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
  });
}
