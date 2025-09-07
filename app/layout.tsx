import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ยืนยันตัวตนสมาชิก สมาคมวิทยุสมัครเล่นจังหวัดพิจิตร",
  description: "ยืนยันตัวตนสมาชิก สำหรับใช้ตรวจสอบข้อมูลสมาชิกในไลน์ OA ของทางสมาคมวิทยุสมัครเล่นจังหวัดพิจิตร HS6AJ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={prompt.className}
      >
        {children}
      </body>
    </html>
  );
}
