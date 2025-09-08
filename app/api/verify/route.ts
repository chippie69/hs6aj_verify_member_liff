import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    
    const response = await fetch(process.env.NEXT_PUBLIC_GAS_API!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data);
};

export const runtime = 'edge'