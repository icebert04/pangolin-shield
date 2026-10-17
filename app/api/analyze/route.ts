import { NextResponse } from "next/server";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Choose an image to assess." }, { status: 400 });
  }
  if (!SUPPORTED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json(
      { error: "Upload a JPEG, PNG, or WebP image." },
      { status: 415 },
    );
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image must be 8 MB or smaller." },
      { status: 413 },
    );
  }

  const upstreamForm = new FormData();
  upstreamForm.append("image", image, image.name);
  const apiUrl = process.env.COFFEE_API_URL ?? "http://127.0.0.1:8000";

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl.replace(/\/$/, "")}/analyze`, {
      method: "POST",
      body: upstreamForm,
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "The image assessment timed out. Please try again." },
        { status: 504 },
      );
    }
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: "The assessment service is unavailable. Please try again shortly." },
        { status: 503 },
      );
    }
    throw error;
  }

  let payload: { analysis?: string; detail?: string };
  try {
    payload = (await upstream.json()) as typeof payload;
  } catch {
    return NextResponse.json(
      { error: "The assessment service returned an unreadable response." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: payload.detail ?? "The image assessment could not be completed." },
      { status: upstream.status },
    );
  }
  if (typeof payload.analysis !== "string" || !payload.analysis.trim()) {
    return NextResponse.json(
      { error: "The assessment service returned no results." },
      { status: 502 },
    );
  }

  return NextResponse.json({ analysis: payload.analysis });
}
