import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@helpers/dbConnect';
import GameHistory from '@models/GameHistory';
import User from '@models/User';
import { getServerSession } from 'next-auth/next';

/**
 * Handles the POST request to record game history and update user coins.
 *
 * @param {NextRequest} req - The HTTP request object.
 * @param {string} email - The email of the user making the request.
 * @returns {Promise<NextResponse>}
 */
async function handlePostRequest(req: NextRequest, email: string): Promise<NextResponse> {
  const { gameId } = await req.json();

  try {
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.coinsAvailable < 1) {
      return NextResponse.json({ success: false, message: 'No coins available' }, { status: 400 });
    }

    const gameHistory = await GameHistory.create({
      userId: user._id,
      gameId,
    });

    user.coinsAvailable -= 1;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Game history recorded successfully',
      gameHistory,
    }, { status: 201 });
  } catch (err) {
    console.error('Error recording game history:', err);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}

/**
 * Main handler function for the API endpoint.
 *
 * @param {NextRequest} req - The HTTP request object.
 * @returns {Promise<NextResponse>}
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();


    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const email = session.user.email;
    const username = session.user.name ?? undefined;

    return handlePostRequest(req, email);
  } catch (err) {
    console.error('Server error occurred:', err);
    return NextResponse.json({ message: 'Server error occurred', error: (err as Error).message }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function PATCH(): Promise<NextResponse> {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
