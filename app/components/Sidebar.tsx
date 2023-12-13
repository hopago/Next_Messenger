import getCurrentUser from "../actions/getCurrentUser"
import DesktopSidebar from "./DesktopSidebar"
import MobileFooter from "./mobile/MobileFooter"

export default async function Sidebar(
    { children }
    : { children: React.ReactNode 
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}
