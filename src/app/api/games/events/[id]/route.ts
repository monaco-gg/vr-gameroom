import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@helpers/dbConnect";
import GameEvent from "@models/GameEvent";
import { GameEventType } from "@app/types/GameEventType";
import { getServerSession } from "next-auth";

/**
 * Handle PATCH request to update a game event.
 *
 * @param {string} eventId - The ID of the event to update.
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>}
 */
const handlePatchRequest = async (
  eventId: string,
  req: NextRequest
): Promise<NextResponse> => {
  await dbConnect();

  try {
    const updateData = (await req.json()) as Partial<GameEventType>;

    if (!updateData) {
      return new NextResponse(
        JSON.stringify({ message: "updateData is required." }),
        { status: 400 }
      );
    }

    const updatedGameEvent = await GameEvent.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, useFindAndModify: false }
    );

    if (!updatedGameEvent) {
      return new NextResponse(
        JSON.stringify({ message: "Game event not found." }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Game event updated successfully.",
        data: updatedGameEvent,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating game event:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
};

/**
 * Handle GET request to retrieve a game event by ID.
 *
 * @param {string} eventId - The ID of the event to retrieve.
 * @returns {Promise<NextResponse>}
 */
const handleGetRequest = async (eventId: string): Promise<NextResponse> => {
  await dbConnect();

  try {
    const gameEvent = await GameEvent.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
      // Add a stage to handle cases where winners might be null or empty
      {
        $addFields: {
          winners: {
            $ifNull: ["$winners", []],
          },
        },
      },

      // Unwind the winners array, preserving empty arrays
      { $unwind: { path: "$winners", preserveNullAndEmptyArrays: true } },

      // Lookup to join with the Users collection
      {
        $lookup: {
          from: "users", // Collection name of the Users
          localField: "winners.userId", // Field in the winners array
          foreignField: "_id", // Field in the Users collection
          as: "userDetails", // Output array field
        },
      },

      // Unwind the userDetails array, preserving null and empty arrays
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

      // Group back the results to reassemble the winners array
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          createdAt: { $first: "$createdAt" },
          startDate: { $first: "$startDate" },
          endDate: { $first: "$endDate" },
          winners: {
            $push: {
              userId: "$winners.userId",
              matches: "$winners.matches",
              tickets: "$winners.tickets",
              position: "$winners.position",
              createdAt: "$winners.createdAt",
              nickname: "$userDetails.nickname",
              photo: "$userDetails.photo",
            },
          },
        },
      },

      // Sort the winners array by position
      {
        $addFields: {
          winners: {
            $sortArray: { input: "$winners", sortBy: { position: 1 } },
          },
        },
      },

      // Project the final fields
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          startDate: 1,
          endDate: 1,
          winners: {
            $cond: {
              if: {
                $eq: [
                  "$winners",
                  [
                    {
                      userId: null,
                      matches: null,
                      tickets: null,
                      position: null,
                      createdAt: null,
                      userDetails: null,
                    },
                  ],
                ],
              },
              then: [],
              else: "$winners",
            },
          },
        },
      },
    ]);

    if (!gameEvent || gameEvent.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Game event not found." }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify({ data: gameEvent[0] }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
};

/**
 * Handle DELETE request to delete a game event by ID.
 *
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Promise<NextResponse>}
 */
const handleDeleteRequest = async (eventId: string): Promise<NextResponse> => {
  await dbConnect();

  try {
    const deletedGameEvent = await GameEvent.findByIdAndDelete(eventId);

    if (!deletedGameEvent) {
      return new NextResponse(
        JSON.stringify({ message: "Game event not found." }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Game event deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting game event:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
};

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }
    const url = new URL(req.url);
    const eventId = url.pathname.split("/").pop();

    if (!eventId) {
      return new NextResponse(
        JSON.stringify({ message: "Event ID is required." }),
        { status: 400 }
      );
    }

    return handlePatchRequest(eventId, req);
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const eventId = url.pathname.split("/").pop();

    if (!eventId) {
      return new NextResponse(
        JSON.stringify({ message: "Event ID is required." }),
        { status: 400 }
      );
    }

    return handleGetRequest(eventId);
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

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const eventId = url.pathname.split("/").pop();

    if (!eventId) {
      return new NextResponse(
        JSON.stringify({ message: "Event ID is required." }),
        { status: 400 }
      );
    }

    return handleDeleteRequest(eventId);
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
