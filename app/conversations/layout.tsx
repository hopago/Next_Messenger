import { signOut } from 'next-auth/react';
import getConversations from '../actions/getConversations'
import getUsers from '../actions/getUsers';
import Sidebar from '../components/Sidebar'
import ConversationList from './components/ConversationList'

export default async function ConversationLayout({
    children
}: {
    children: React.ReactNode
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <section className="h-full">
        <ConversationList
          users={users}
          initialConversations={conversations}
        />
        {children}
      </section>
    </Sidebar>
  )
}
