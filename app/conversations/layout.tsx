import getConversations from '../actions/getConversations'
import Sidebar from '../components/Sidebar'
import ConversationList from './components/ConversationList'

export default async function ConversationLayout({
    children
}: {
    children: React.ReactNode
}) {
  const conversations = await getConversations();

  return (
    <Sidebar>
      <section className="h-full">
        <ConversationList
          initialConversations={conversations}
        />
        {children}
      </section>
    </Sidebar>
  )
}