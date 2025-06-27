import { authOptions } from "@app/api/auth/[...nextauth]/route";
import dbConnect from "@helpers/dbConnect";
import Ticket from "@models/Ticket";
import { isStartDateBeforeEndDate, isValidISO8601Date } from "@utils/index";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function handleGetRequest(
  gameId?: string,
  startDate?: string,
  endDate?: string,
  userId?: string
): Promise<NextResponse> {
  await dbConnect();

  try {
    const pipeline: any[] = [];

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

    if (userId) {
      const objectUserId = new mongoose.Types.ObjectId(userId);

      pipeline.push(
        {
          $match: {
            user: objectUserId,
            gameId: "4",
          },
        },
        {
          $unwind: "$playerData.avg",
        },
        {
          $group: {
            _id: "$_id",
            user: { $first: "$user" },
            gameId: { $first: "$gameId" },
            minLapTime: { $min: "$playerData.avg" },
            amount: { $first: "$amount" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $sort: { minLapTime: 1 },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            _id: 1,
            gameId: 1,
            minLapTime: 1,
            amount: 1,
            createdAt: 1,
            user: {
              _id: "$userData._id",
              nickname: "$userData.nickname",
              photo: "$userData.photo",
              name: "$userData.name",
            },
          },
        }
      );
    } else {
      pipeline.push(
        {
          $match: { gameId: "4" },
        },
        {
          $unwind: "$playerData.avg",
        },
        {
          $sort: { "playerData.avg": 1 },
        },
        {
          $group: {
            _id: "$user",
            gameId: { $first: "$gameId" },
            minLapTime: { $min: "$playerData.avg" },
            amount: { $first: "$amount" },
            createdAt: { $first: "$createdAt" },
            originalId: { $first: "$_id" },
          },
        },
        {
          $sort: { minLapTime: 1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            _id: "$originalId",
            gameId: 1,
            minLapTime: 1,
            amount: 1,
            createdAt: 1,
            user: {
              _id: "$userData._id",
              nickname: "$userData.nickname",
              photo: "$userData.photo",
              name: "$userData.name",
            },
          },
        }
      );
    }

    const tickets = await Ticket.aggregate(pipeline, {
      maxTimeMS: 60000,
      allowDiskUse: true,
    });

    return NextResponse.json({ data: tickets }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving ranking:", error);
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
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.email) {
    //   return NextResponse.json(
    //     { message: "Autenticação necessária." },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;
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

    return handleGetRequest(gameId, startDate, endDate, userId);
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
