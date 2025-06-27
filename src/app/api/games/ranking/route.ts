import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Ticket from "@models/Ticket";
import { getServerSession } from "next-auth/next";
import { isValidISO8601Date, isStartDateBeforeEndDate } from "@utils/index";

async function handleGetRequest(
  gameId?: string,
  startDate?: string,
  endDate?: string
): Promise<NextResponse> {
  await dbConnect();

  try {
    const pipeline: any[] = [];

    if (gameId) {
      pipeline.push({
        $match: { gameId },
      });
    }

    if (startDate || endDate) {
      const dateMatch: any = {};
      if (startDate) {
        dateMatch.$gte = new Date(startDate);
      }
      if (endDate) {
        dateMatch.$lte = new Date(endDate);
      }
      pipeline.push({
        $match: { createdAt: dateMatch },
      });
    }

    pipeline.push(
      {
        $group: {
          _id: "$user",
          totalMatches: {
            $sum: {
              $cond: [{ $ifNull: ["$gameId", false] }, 1, 0],
            },
          },
          totalTickets: { $sum: "$amount" },
          createdAt: { $first: "$createdAt" }, // Adiciona o primeiro createdAt encontrado
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
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "user._id": 1,
          "user.nickname": 1,
          "user.photo": 1,
          "user.name": 1,
          totalMatches: 1,
          totalTickets: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          totalTickets: -1,
          totalMatches: -1,
          createdAt: 1, // Ordena por createdAt, em ordem ascendente
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
      {
        $unwind: "$rankedDocs",
      },
      {
        $replaceRoot: { newRoot: "$rankedDocs" },
      },
      {
        $addFields: { rank: { $add: ["$rank", 1] } }, // Adjusting rank to start from 1
      },
      { $limit: 10 }
    );

    const tickets = await Ticket.aggregate(pipeline, {
      maxTimeMS: 60000,
      allowDiskUse: true,
    });

    return NextResponse.json({ data: tickets }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving tickets:", error);
    return NextResponse.json(
      {
        message: "Ocorreu um erro no servidor",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Autenticação necessária." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    if (startDate && !isValidISO8601Date(startDate)) {
      return NextResponse.json(
        { message: "Invalid startDate parameter." },
        { status: 400 }
      );
    }

    if (endDate && !isValidISO8601Date(endDate)) {
      return NextResponse.json(
        { message: "Invalid endDate parameter." },
        { status: 400 }
      );
    }

    if (startDate && endDate && !isStartDateBeforeEndDate(startDate, endDate)) {
      return NextResponse.json(
        { message: "startDate cannot be after endDate." },
        { status: 400 }
      );
    }

    return handleGetRequest(gameId, startDate, endDate);
  } catch (error) {
    console.error("Server error occurred:", error);
    return NextResponse.json(
      {
        message: "Ocorreu um erro no servidor",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
