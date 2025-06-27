import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@helpers/dbConnect';
import User from '@models/User';
import { getServerSession } from 'next-auth/next';

export async function PATCH(req: NextRequest) {
  try {
    if (req.method !== 'PATCH') {
      return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { tokenDevice, enableNotifications } = await req.json();
    const email = session.user?.email;

    await dbConnect();

    const updateFields: Partial<{ tokenDevice: string; enableNotifications: boolean }> = {};
    if (enableNotifications !== undefined) {
      updateFields.enableNotifications = enableNotifications;
    }
    if (tokenDevice !== undefined) {
      updateFields.tokenDevice = tokenDevice;
    }

    const updatedUser = await User.findOneAndUpdate({ email }, updateFields, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'TokenDevice and enableNotifications successfully updated',
      data: updatedUser,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating tokenDevice and enableNotifications:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
