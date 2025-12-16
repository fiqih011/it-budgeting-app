import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata = {
  title: "IT Budgeting",
  description: "IT Budgeting System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
