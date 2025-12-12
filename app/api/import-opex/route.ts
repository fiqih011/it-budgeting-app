// app/api/import-opex/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as any;
    if (!file) return NextResponse.json({ message: "No file" }, { status: 400 });

    // Placeholder: parse file server-side with xlsx or csv parser later
    // For now just return simple preview
    return NextResponse.json({ preview: { filename: file.name, size: file.size } });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
