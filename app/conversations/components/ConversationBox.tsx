"use client";

import { FullConversationType } from "@/app/types";

import { Conversation, Message, User } from "@prisma/client";

import { useCallback, useMemo } from "react";

import { format } from "date-fns";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import useOtherMemberInfo from "@/app/hooks/useFilteredConversationMembers";
import Avatar from "@/app/components/users/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

type Props = {
  conversation: FullConversationType;
  selected?: boolean;
};

export default function ConversationBox({ conversation, selected }: Props) {
  const anotherUser = useOtherMemberInfo(conversation);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];

    return messages[messages.length - 1];
  }, []);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenMessage = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenMessage.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent and image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {conversation?.isGroup ? (
        <AvatarGroup users={conversation.users} />
      ) : (
        <Avatar user={anotherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between mb-1">
            <p className="text-md font-medium text-gray-900">
              {conversation.name || anotherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm`,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
}
