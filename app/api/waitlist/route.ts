import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Waitlist database is not configured." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email,
        source: "landing_page",
      }),
    });
  } catch (error) {
    console.error("Waitlist Supabase request failed", error);
    return NextResponse.json(
      { error: "Unable to reach waitlist database." },
      { status: 502 },
    );
  }

  if (response.ok || response.status === 409) {
    return NextResponse.json({ ok: true });
  }

  const details = await response.text().catch(() => "");
  console.error("Waitlist Supabase insert failed", {
    status: response.status,
    details,
  });

  return NextResponse.json(
    { error: "Unable to save email address." },
    { status: 500 },
  );
}
