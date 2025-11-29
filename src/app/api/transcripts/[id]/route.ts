import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth-utils';

// GET /api/transcripts/[id] - Get a single transcript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const transcript = await prisma.transcript.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        folder: true,
        segments: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Transcript not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transcript,
    });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}

// PATCH /api/transcripts/[id] - Update a transcript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      text,
      folderId,
      language,
    } = body;

    // Check if transcript exists and belongs to user
    const existing = await prisma.transcript.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Transcript not found' },
        { status: 404 }
      );
    }

    const transcript = await prisma.transcript.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(text !== undefined && { text }),
        ...(folderId !== undefined && { folderId: folderId || null }),
        ...(language !== undefined && { language }),
      },
      include: {
        folder: true,
        segments: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: transcript,
    });
  } catch (error) {
    console.error('Error updating transcript:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transcript' },
      { status: 500 }
    );
  }
}

// DELETE /api/transcripts/[id] - Delete a transcript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if transcript exists and belongs to user
    const existing = await prisma.transcript.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Transcript not found' },
        { status: 404 }
      );
    }

    await prisma.transcript.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Transcript deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transcript:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transcript' },
      { status: 500 }
    );
  }
}
