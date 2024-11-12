import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content, imageUrl, category } = await request.json();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banger = await prisma.twitterBanger.update({
      where: { id: params.id, userId },
      data: {
        content,
        imageUrl,
        category,
      },
    });
    return NextResponse.json(banger);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update twitter banger" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.twitterBanger.delete({
      where: { id: params.id, userId },
    });
    return NextResponse.json({
      message: "Twitter banger deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete twitter banger" },
      { status: 500 }
    );
  }
}
