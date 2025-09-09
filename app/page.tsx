"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import liff from '@line/liff';
import { LoaderCircle } from "lucide-react";

import { initLiff } from "@/lib/liff";

export default function Home() {
  const [lineUserId, setlineUserId] = useState<string>("");
  const [lineDisplayName, setLineDisplayName] = useState<string>("...");
  const [idCard, setIdCard] = useState("");
  const [callsign, setCallsign] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const profile = await initLiff(process.env.NEXT_PUBLIC_LIFF_ID!);
        setlineUserId(profile.userId);
        setLineDisplayName(profile.displayName);
        setLoadingInit(true);
      } catch (error) {
        console.log("LIFF Initialization failed", error);
        setLoadingInit(false);
        Swal.fire({
          title: "ผิดพลาด!",
          text: "ไม่สามารถเข้าถึงข้อมูลไลน์ได้ กรุณาติดต่อเจ้าหน้าที่หรือลองใหม่ภายหลัง",
          icon: "error",
          confirmButtonText: "ปิด"
        });
      }
    }
    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineUserId,
          lineDisplayName,
          callsign: callsign.toUpperCase(),
          idCard,
        })
      })

      const data = await response.json();
      console.log(data);
      if (data.success) {
        // setResult("✅ ยืนยันตัวตนสำเร็จ!");
        Swal.fire({
          title: "สำเร็จ!",
          text: `${data.message}`,
          icon: "success",
          confirmButtonText: "ปิด"
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              liff.sendMessages([
                {
                  type: "text",
                  text: "ตรวจสอบข้อมูล"
                }
              ])
              console.log("ส่งข้อความสำเร็จ");
            } catch (error) {
              console.log("ส่งข้อความไม่สำเร็จ:", error);
            } finally {
              liff.closeWindow();
            }
          }
        })
      } else {
        // setResult(`❌ ไม่พบข้อมูลหรือข้อมูลไม่ถูกต้อง กรุณาลองใหม่: ${data.message}`);
        Swal.fire({
          title: "ล้มเหลว!",
          text: `${data.message}`,
          icon: "error",
          confirmButtonText: "ปิด"
        });
      }
    } catch (error) {
      // setResult("⚠️ เกิดข้อผิดพลาด ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      Swal.fire({
          title: "ผิดพลาด!",
          text: "เกิดข้อผิดพลาด ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง",
          icon: "warning",
          confirmButtonText: "ปิด"
        });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <div className="flex flex-row justify-between items-center mb-6">
          <Image 
            src="https://pub-063b4094a46345659aa65fe70448a864.r2.dev/hs6aj-logo-no-bg.png"
            alt="HS6AJ Logo"
            width={50}
            height={50}
            className=""
          />
          <p className="truncate max-w-[200px]">สวัสดี, {lineDisplayName}</p>
        </div>
        <h1 className="text-xl font-bold text-center mb-2 text-green-700">
          ยืนยันตัวตนสมาชิก
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          สมาคมวิทยุสมัครเล่นจังหวัดพิจิตร
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              สัญญาณเรียกขาน
            </label>
            <input 
              type="text" 
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              เลขบัตรประชาชน (4 ตัวท้าย)
            </label>
            <input 
              inputMode="numeric"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              maxLength={4}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !loadingInit}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading || !loadingInit ? <p className="flex flex-row justify-center items-center"><LoaderCircle size={24} className="animate-spin" /> โปรดรอ...</p> : "ยืนยัน"}
          </button>
        </form>

        {result && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {result}
          </p>
        )}
      </div>
    </div>
  );
}
