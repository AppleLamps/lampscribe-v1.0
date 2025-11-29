import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth-utils';
import { getSignedDownloadUrl, isStorageConfigured, deleteFile } from '@/lib/storage';

/**
 * GET /api/audio/[id] - Get a signed URL for streaming/downloading audio
 */
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

    // Get transcript
    const transcript = await prisma.transcript.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        audioUrl: true,
        name: true,
      },
    });

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Transcript not found' },
        { status: 404 }
      );
    }

    if (!transcript.audioUrl) {
      return NextResponse.json(
        { success: false, error: 'No audio file associated with this transcript' },
        { status: 404 }
      );
    }

    // Check if storage is configured
    if (!isStorageConfigured()) {
      // If storage isn't configured, audioUrl might be an external URL
      // Just return it directly
      return NextResponse.json({
        success: true,
        data: {
          url: transcript.audioUrl,
          name: transcript.name,
        },
      });
    }

    // Generate a fresh signed URL (valid for 1 hour)
    const signedUrl = await getSignedDownloadUrl(transcript.audioUrl);

    return NextResponse.json({
      success: true,
      data: {
        url: signedUrl,
        name: transcript.name,
      },
    });
  } catch (error) {
    console.error('Error getting audio URL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get audio URL' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/audio/[id] - Delete audio file from storage
 */
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

    // Get transcript
    const transcript = await prisma.transcript.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        audioUrl: true,
      },
    });

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Transcript not found' },
        { status: 404 }
      );
    }

    if (!transcript.audioUrl) {
      return NextResponse.json(
        { success: false, error: 'No audio file to delete' },
        { status: 404 }
      );
    }

    // Delete from R2 if storage is configured
    if (isStorageConfigured()) {
      await deleteFile(transcript.audioUrl);
    }

    // Clear the audioUrl in the database
    await prisma.transcript.update({
      where: { id },
      data: { audioUrl: null },
    });

    return NextResponse.json({
      success: true,
      message: 'Audio file deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting audio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete audio' },
      { status: 500 }
    );
  }
}

