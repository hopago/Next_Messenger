import getConversationById from "@/app/actions/getConversationById"
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "../components/Header";
import Body from "../components/Body";
import MessageForm from "../components/Form";

interface Params {
  params: {
    conversationId: string
  }
}

export default async function page({ params }: Params) {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <EmptyState />
      </div>
    </div>
  )



  return (
    <section className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body />
        <MessageForm />
      </div>
    </section>
  )
}
