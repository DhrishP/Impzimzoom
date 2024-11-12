import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    console.log(body);
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const coldEmail = await prisma.coldEmailData.update({
      where: { id: params.id, userId: userId },
      data: body,
    });
    return NextResponse.json(coldEmail);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.coldEmailData.delete({
      where: { id: params.id, userId: userId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
