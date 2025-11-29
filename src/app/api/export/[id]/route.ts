import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth-utils';
import {
  generateTxt,
  generateSrt,
  generatePdf,
  generateDocx,
  TranscriptData,
  ExportOptions,
} from '@/lib/export';

type ExportFormat = 'txt' | 'srt' | 'pdf' | 'docx';

const CONTENT_TYPES: Record<ExportFormat, string> = {
  txt: 'text/plain',
  srt: 'application/x-subrip',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const FILE_EXTENSIONS: Record<ExportFormat, string> = {
  txt: 'txt',
  srt: 'srt',
  pdf: 'pdf',
  docx: 'docx',
};

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
    const { searchParams } = new URL(request.url);
    
    const format = (searchParams.get('format') || 'txt') as ExportFormat;
    const includeTimestamps = searchParams.get('timestamps') === 'true';
    const includeSpeakers = searchParams.get('speakers') === 'true';

    // Validate format
    if (!['txt', 'srt', 'pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Invalid export format. Use: txt, srt, pdf, or docx' },
        { status: 400 }
      );
    }

    // Fetch transcript
    const transcript = await prisma.transcript.findFirst({
      where: {
        id,
        userId,
      },
      include: {
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

    // Prepare transcript data
    const transcriptData: TranscriptData = {
      id: transcript.id,
      name: transcript.name,
      text: transcript.text,
      language: transcript.language,
      duration: transcript.duration,
      createdAt: transcript.createdAt,
      segments: transcript.segments.map((seg) => ({
        text: seg.text,
        speaker: seg.speaker,
        startTime: seg.startTime,
        endTime: seg.endTime,
      })),
    };

    const options: ExportOptions = {
      includeTimestamps,
      includeSpeakers,
      title: transcript.name,
    };

    // Generate export content
    let content: string | Buffer;
    
    switch (format) {
      case 'txt':
        content = generateTxt(transcriptData, options);
        break;
      case 'srt':
        content = generateSrt(transcriptData);
        break;
      case 'pdf':
        content = await generatePdf(transcriptData, options);
        break;
      case 'docx':
        content = await generateDocx(transcriptData, options);
        break;
      default:
        content = generateTxt(transcriptData, options);
    }

    // Create filename
    const safeFileName = transcript.name
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);
    const fileName = `${safeFileName}.${FILE_EXTENSIONS[format]}`;

    // Return response with appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', CONTENT_TYPES[format]);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    if (typeof content === 'string') {
      return new NextResponse(content, { headers });
    } else {
      return new NextResponse(content, { headers });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export transcript' },
      { status: 500 }
    );
  }
}

