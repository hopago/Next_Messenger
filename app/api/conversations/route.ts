import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.email || !currentUser?.id)
      return new NextResponse("Unauthorized.", { status: 401 });

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid credentials...", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    }

    const existingConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
                equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
                equals: [userId, currentUser.id]
            }
          }
        ],
      }
    });
    const foundConversation = existingConversation[0];

    if (foundConversation) {
        return NextResponse.json(foundConversation)
    }

    const newConversation = await prisma.conversation.create({
        data: {
            users: {
                connect: [
                    {
                        id: currentUser.id
                    },
                    {
                        id: userId
                    }
                ]
            }
        },
        include: {
            users: true
        }
    });

    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (err: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
