import "./styles/globals.css";
import { AuthProvider } from "@/contexts/auth/AuthContext"
import { UserMapsProvider } from '@/contexts/map/UserMapsContext'
import { TileStyleProvider } from '@/contexts/map/TileStyleContext'
import Navbar from "@/components/pages/Navbar"; // import navbar component
import { NotificationProvider } from '@/contexts/notification/NotificationContext';
import NotificationList from '@/components/elements/NotificationList';

// Root layout component to wrap all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>

        {/* Wrap the app with AuthProvider to provide authentication context */}
        <AuthProvider>
          <UserMapsProvider>
            <TileStyleProvider initialStyle="arcgis_ocean">
              <NotificationProvider>
                <Navbar />
                <main className="">{children}</main>
                <NotificationList />
                <footer className="text-center text-sm text-gray-500 py-4 pr-25 ">
                  {/* <p>2025 My Next.js App</p> */}
                </footer>
              </NotificationProvider>
            </TileStyleProvider>
          </UserMapsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
