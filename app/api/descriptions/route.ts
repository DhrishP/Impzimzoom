import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const descriptions = await prisma.description.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(descriptions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch descriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const description = await prisma.description.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
      },
    });
    return NextResponse.json(description);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create description' }, { status: 500 });
  }
}