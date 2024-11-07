import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const credentials = await prisma.credential.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const credential = await prisma.credential.create({
      data: {
        title: data.title,
        username: data.username,
        password: data.password,
        url: data.url,
        notes: data.notes,
      },
    });
    return NextResponse.json(credential);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create credential' }, { status: 500 });
  }
}