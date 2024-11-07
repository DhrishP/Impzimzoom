import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const emails = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(emails);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const email = await prisma.emailTemplate.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
      },
    });
    return NextResponse.json(email);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create email' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const email = await prisma.emailTemplate.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(email)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.emailTemplate.delete({
      where: { id: params.id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}