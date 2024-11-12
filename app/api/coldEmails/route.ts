import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const coldEmails = await prisma.coldEmailData.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coldEmails);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch emails" },
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
    const coldEmail = await prisma.coldEmailData.create({
      data: {
        userId: userId,
        title: data.title,
        content: data.content,
      },
    });
    return NextResponse.json(coldEmail);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create email" },
      { status: 500 }
    );
  }
}
