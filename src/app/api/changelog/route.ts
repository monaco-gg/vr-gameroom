import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'CHANGELOG.md');
  try {
    const fileContents = readFileSync(filePath, 'utf8');
    return new NextResponse(fileContents, { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to read the changelog file.' }), { status: 500 });
  }
}
