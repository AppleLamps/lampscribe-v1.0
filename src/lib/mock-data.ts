import { Transcript, Folder, User } from "./types";

export const mockUser: User = {
  id: "1",
  email: "demo@lampscribe.com",
  name: "Demo User",
  plan: "unlimited",
  avatarUrl: undefined,
};

export const mockFolders: Folder[] = [
  { id: "1", name: "Interviews", transcriptCount: 5, createdAt: new Date("2025-11-01") },
  { id: "2", name: "Podcasts", transcriptCount: 12, createdAt: new Date("2025-11-05") },
  { id: "3", name: "Meetings", transcriptCount: 8, createdAt: new Date("2025-11-10") },
  { id: "4", name: "Lectures", transcriptCount: 3, createdAt: new Date("2025-11-15") },
];

export const mockTranscripts: Transcript[] = [
  {
    id: "1",
    title: "Product Strategy Meeting Q4 2025",
    originalFileName: "meeting-q4-strategy.mp3",
    audioUrl: "/audio/sample.mp3",
    duration: 3678, // 61 minutes
    language: "en-US",
    mode: "whale",
    status: "completed",
    recognizeSpeakers: true,
    translateToEnglish: false,
    restoreAudio: false,
    folderId: "3",
    createdAt: new Date("2025-11-29T14:30:00"),
    updatedAt: new Date("2025-11-29T14:45:00"),
    speakers: [
      { id: "s1", name: "Speaker 1" },
      { id: "s2", name: "Speaker 2" },
      { id: "s3", name: "Speaker 3" },
    ],
    content: [
      {
        speakerId: "s1",
        text: "Welcome everyone to our Q4 product strategy meeting. Today we're going to discuss our roadmap for the next quarter and prioritize the key features we want to ship.",
        startTime: 0,
        endTime: 12,
      },
      {
        speakerId: "s2",
        text: "Thanks for organizing this. I've prepared some data on user feedback from the last quarter that I think will help inform our decisions.",
        startTime: 12,
        endTime: 22,
      },
      {
        speakerId: "s3",
        text: "Great, I'm particularly interested in the mobile app improvements. Our analytics show that mobile usage has grown 40% since last quarter.",
        startTime: 22,
        endTime: 35,
      },
      {
        speakerId: "s1",
        text: "That's excellent news. Let's start by reviewing the current backlog and then we can dive into the specific feature requests.",
        startTime: 35,
        endTime: 45,
      },
    ],
  },
  {
    id: "2",
    title: "Podcast Interview - Tech Trends 2025",
    originalFileName: "podcast-tech-trends.mp4",
    audioUrl: "/audio/sample2.mp3",
    duration: 2847, // 47 minutes
    language: "en-US",
    mode: "dolphin",
    status: "completed",
    recognizeSpeakers: true,
    translateToEnglish: false,
    restoreAudio: false,
    folderId: "2",
    createdAt: new Date("2025-11-28T10:15:00"),
    updatedAt: new Date("2025-11-28T10:45:00"),
    speakers: [
      { id: "s1", name: "Host" },
      { id: "s2", name: "Guest" },
    ],
    content: [
      {
        speakerId: "s1",
        text: "Welcome back to Tech Forward! I'm your host, and today we have a very special guest joining us to discuss the biggest tech trends of 2025.",
        startTime: 0,
        endTime: 10,
      },
      {
        speakerId: "s2",
        text: "Thanks for having me. I'm really excited to be here and share my thoughts on where the industry is heading.",
        startTime: 10,
        endTime: 18,
      },
    ],
  },
  {
    id: "3",
    title: "Customer Support Call - Account Issues",
    originalFileName: "support-call-12345.wav",
    duration: 423, // 7 minutes
    language: "en-US",
    mode: "cheetah",
    status: "completed",
    recognizeSpeakers: true,
    translateToEnglish: false,
    restoreAudio: true,
    createdAt: new Date("2025-11-27T16:20:00"),
    updatedAt: new Date("2025-11-27T16:25:00"),
    speakers: [
      { id: "s1", name: "Agent" },
      { id: "s2", name: "Customer" },
    ],
    content: [
      {
        speakerId: "s1",
        text: "Thank you for calling support. How can I help you today?",
        startTime: 0,
        endTime: 5,
      },
      {
        speakerId: "s2",
        text: "Hi, I'm having trouble accessing my account. It keeps saying my password is incorrect but I'm sure I'm using the right one.",
        startTime: 5,
        endTime: 14,
      },
    ],
  },
  {
    id: "4",
    title: "Spanish Webinar - Marketing Digital",
    originalFileName: "webinar-marketing-es.mp3",
    duration: 5420, // 90 minutes
    language: "es",
    mode: "whale",
    status: "completed",
    recognizeSpeakers: false,
    translateToEnglish: true,
    restoreAudio: false,
    folderId: "4",
    createdAt: new Date("2025-11-26T09:00:00"),
    updatedAt: new Date("2025-11-26T10:35:00"),
    content: [
      {
        speakerId: "s1",
        text: "Bienvenidos al webinar de marketing digital. Hoy vamos a hablar sobre las últimas tendencias en redes sociales y cómo pueden ayudar a tu negocio.",
        startTime: 0,
        endTime: 12,
      },
    ],
  },
  {
    id: "5",
    title: "Team Standup - November 25",
    originalFileName: "standup-nov-25.m4a",
    duration: 892, // 15 minutes
    language: "en-US",
    mode: "cheetah",
    status: "completed",
    recognizeSpeakers: true,
    translateToEnglish: false,
    restoreAudio: false,
    folderId: "3",
    createdAt: new Date("2025-11-25T09:30:00"),
    updatedAt: new Date("2025-11-25T09:35:00"),
    speakers: [
      { id: "s1", name: "Speaker 1" },
      { id: "s2", name: "Speaker 2" },
      { id: "s3", name: "Speaker 3" },
      { id: "s4", name: "Speaker 4" },
    ],
    content: [],
  },
  {
    id: "6",
    title: "Interview - Senior Developer Position",
    originalFileName: "interview-senior-dev.mp3",
    duration: 3245, // 54 minutes
    language: "en-US",
    mode: "whale",
    status: "completed",
    recognizeSpeakers: true,
    translateToEnglish: false,
    restoreAudio: false,
    folderId: "1",
    createdAt: new Date("2025-11-24T14:00:00"),
    updatedAt: new Date("2025-11-24T15:00:00"),
    speakers: [
      { id: "s1", name: "Interviewer" },
      { id: "s2", name: "Candidate" },
    ],
    content: [],
  },
  {
    id: "7",
    title: "Processing Audio File...",
    originalFileName: "new-recording.mp3",
    duration: 1800, // 30 minutes
    language: "en-US",
    mode: "dolphin",
    status: "processing",
    recognizeSpeakers: true,
    translateToEnglish: false,
    restoreAudio: false,
    createdAt: new Date("2025-11-29T15:00:00"),
    updatedAt: new Date("2025-11-29T15:00:00"),
  },
];

