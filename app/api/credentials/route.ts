import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const credentials = await prisma.credential.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch credentials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const credential = await prisma.credential.create({
      data: {
        title: data.title,
        username: data.username,
        password: data.password,
        url: data.url,
        notes: data.notes,
        userId: userId,
      },
    });
    return NextResponse.json(credential);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create credential" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const credential = await prisma.credential.delete({
    where: { id: data.id, userId: userId },
  });
  return NextResponse.json(credential);
}

export async function PATCH(request: Request) {
  const data = await request.json();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const credential = await prisma.credential.update({
    where: { id: data.id, userId: userId },
    data: data,
  });
  return NextResponse.json(credential);
}
