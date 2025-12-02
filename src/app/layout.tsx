import type { Metadata } from "next";
import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "ComplainCraft - Consumer Rights Complaint Generator",
  description: "Generate formal complaints for consumer rights violations in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="complaincraft-ui-theme">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
