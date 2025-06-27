import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import { getServerSession } from "next-auth/next";
import { isValidISO8601Date, isStartDateBeforeEndDate } from "@utils/index"; // Ajuste o caminho conforme necessário
import GameEvent from "@models/GameEvent";
import { GameEventType } from "@app/types/GameEventType";

/**
 * Handle GET request to retrieve event information.
 *
 * @returns {Promise<NextResponse>}
 */
const handleGetRequest = async (): Promise<NextResponse> => {
  await dbConnect();

  try {
    const now = new Date();

    // Connect to the database
    await dbConnect();

    // Find the current event
    const currentEvent = await GameEvent.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).lean();

    if (currentEvent) {
      return new NextResponse(JSON.stringify({ data: currentEvent }), {
        status: 200,
      });
    }

    // If no current event, find the next upcoming event
    const nextEvent = await GameEvent.findOne({
      startDate: { $gt: now },
    })
      .sort({ startDate: 1 })
      .lean();

    if (nextEvent) {
      return new NextResponse(JSON.stringify({ data: nextEvent }), {
        status: 200,
      });
    }

    // Return empty object if no events found
    return new NextResponse(JSON.stringify({ data: {} }), {
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
 * Handle POST request to create a new game event.
 *
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>}
 */
const handlePostRequest = async (req: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  try {
    const { title, description, startDate, endDate, winners } =
      (await req.json()) as GameEventType;

    if (!title || !startDate || !endDate) {
      return new NextResponse(
        JSON.stringify({
          message: "Title, startDate, and endDate are required.",
        }),
        { status: 400 }
      );
    }

    if (
      !isValidISO8601Date(startDate.toString()) ||
      !isValidISO8601Date(endDate.toString())
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid date format." }),
        { status: 400 }
      );
    }

    if (!isStartDateBeforeEndDate(startDate.toString(), endDate.toString())) {
      return new NextResponse(
        JSON.stringify({ message: "startDate cannot be after endDate." }),
        { status: 400 }
      );
    }

    const newGameEvent = new GameEvent({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      winners: winners || [],
    });

    await newGameEvent.save();

    return new NextResponse(
      JSON.stringify({
        message: "Game event created successfully.",
        data: newGameEvent,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating game event:", error);
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
 * Main handler function that directs to specific functions based on the HTTP method.
 *
 * @param {NextRequest} req - The request object.
 * @returns {Promise<NextResponse>}
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    return handleGetRequest();
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required." }),
        { status: 401 }
      );
    }

    return handlePostRequest(req);
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

export async function DELETE(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
  });
}
