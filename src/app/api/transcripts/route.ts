import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TranscriptionMode, TranscriptStatus } from '@prisma/client';
import { getCurrentUserId } from '@/lib/auth-utils';

// GET /api/transcripts - List all transcripts
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const folderId = searchParams.get('folderId');
    const status = searchParams.get('status') as TranscriptStatus | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {
      userId,
      ...(folderId === 'uncategorized' 
        ? { folderId: null } 
        : folderId 
          ? { folderId } 
          : {}),
      ...(status ? { status } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { text: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
    };

    const [transcripts, total] = await Promise.all([
      prisma.transcript.findMany({
        where,
        include: {
          folder: true,
          _count: {
            select: { segments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transcript.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: transcripts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + transcripts.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transcripts' },
      { status: 500 }
    );
  }
}

// POST /api/transcripts - Create a new transcript
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      originalName,
      text,
      language,
      duration,
      mode = 'DOLPHIN',
      fileSize,
      fileType,
      audioUrl,
      folderId,
      segments,
    } = body;

    // Validate required fields
    if (!name || !originalName || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, originalName, text' },
        { status: 400 }
      );
    }

    // Create transcript with segments if provided
    const transcript = await prisma.transcript.create({
      data: {
        name,
        originalName,
        text,
        language,
        duration,
        mode: mode as TranscriptionMode,
        fileSize,
        fileType,
        audioUrl,
        status: 'COMPLETED',
        completedAt: new Date(),
        userId,
        folderId: folderId || null,
        segments: segments ? {
          create: segments.map((seg: { text: string; speaker?: string; startTime: number; endTime: number }, index: number) => ({
            text: seg.text,
            speaker: seg.speaker,
            startTime: seg.startTime,
            endTime: seg.endTime,
            order: index,
          })),
        } : undefined,
      },
      include: {
        folder: true,
        segments: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: transcript,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transcript:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transcript' },
      { status: 500 }
    );
  }
}
