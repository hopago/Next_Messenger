"use client"

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox";
import axios from "axios";

interface BodyProps {
    initialMessage: FullMessageType[]
}

export default function Body({ initialMessage }: BodyProps) {
  const [messages, setMessages] = useState(initialMessage);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <section className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          key={message.id}
          isLast={index === messages.length - 1}
          message={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </section>
  )
}
