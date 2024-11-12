import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bangers = await prisma.twitterBanger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bangers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch twitter bangers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, imageUrl, category } = await request.json();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const banger = await prisma.twitterBanger.create({
      data: {
        userId,
        content,
        imageUrl,
        category,
      },
    });
    return NextResponse.json(banger);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create twitter banger" },
      { status: 500 }
    );
  }
} 