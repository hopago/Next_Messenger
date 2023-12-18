import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/lib/prismadb';

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const {
        name,
        image
    } = body;

    if (!currentUser?.id) {
        return new NextResponse("Unauthorized...", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: currentUser.id,
        },
        data: {
            image,
            name
        }
    });

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    console.log(err, "SETTING_ERROR");
    return new NextResponse("Internal error", { status: 500 });
  }
}
