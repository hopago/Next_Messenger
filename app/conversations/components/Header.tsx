"use client";

import Avatar from "@/app/components/users/Avatar";
import useOtherMemberInfo from "@/app/hooks/useFilteredConversationMembers";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfilePopout from "./ProfilePopout";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Header({ conversation }: HeaderProps) {
  const anotherUser = useOtherMemberInfo(conversation);
  const [moreVertOpen, setMoreVertOpen] = useState(false);
  
  const { members } = useActiveList();
  const isActive = members.indexOf(anotherUser?.email!) !== - 1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation.id]);

  return (
    <>
      <ProfilePopout
        conversation={conversation}
        isOpen={moreVertOpen}
        onClose={() => setMoreVertOpen(false)}
      />
      <header className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={anotherUser} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || anotherUser.name}</div>

            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        <HiEllipsisHorizontal
          onClickCapture={() => setMoreVertOpen(true)}
          size={32}
          onClick={() => {}}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </header>
    </>
  );
}
