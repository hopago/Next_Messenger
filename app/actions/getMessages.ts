import prisma from '@/app/lib/prismadb';

const getMessages = async(
    conversationId: string
) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId
            },
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return messages;
    } catch (err: any) {
        return [];
    }
}

export default getMessages;