import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/lib/prismadb';

interface Params {
    conversationId?: string;
}

export async function DELETE(
    req: Request,
    { params }: { params: Params }
) {
    try {
        const { conversationId } = params;
        if (!conversationId) {
            return new NextResponse("Conversation Id required...", { status: 400 });
        }

        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return new NextResponse("Unauthorized...", { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });
        if (!existingConversation) return new NextResponse("Invalid Id", { status: 400 });

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        return NextResponse.json(deletedConversation);
    } catch (err: any) {
        console.log(err, "ERROR_CONVERSATION_DELETE");
        return new NextResponse("Internal Error", { status: 500 });
    }
}