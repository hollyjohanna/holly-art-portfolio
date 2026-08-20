import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "hollyjohanna.robbins@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Holly Johanna Art <hello@hollyjohanna.com>";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_PHONE_LENGTH = 30;

// A genuine visitor takes at least a few seconds to fill the form in.
const MIN_FILL_MS = 3000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

// Per-instance only: serverless means several instances may run at once, so
// this throttles bursts rather than enforcing a strict global quota.
const recentSubmissions = new Map<string, number[]>();

function pruneExpired(now: number) {
  for (const [key, timestamps] of recentSubmissions) {
    const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) {
      recentSubmissions.delete(key);
    } else {
      recentSubmissions.set(key, fresh);
    }
  }
}

function isRateLimited(ip: string) {
  const now = Date.now();

  if (recentSubmissions.size > 1000) {
    pruneExpired(now);
  }

  const fresh = (recentSubmissions.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (fresh.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    recentSubmissions.set(ip, fresh);
    return true;
  }

  fresh.push(now);
  recentSubmissions.set(ip, fresh);
  return false;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    phone?: string;
    website?: string;
    startedAt?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot and timing traps report success so bots don't learn to adapt.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof body.startedAt === "number") {
    const elapsed = Date.now() - body.startedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
      return NextResponse.json({ ok: true });
    }
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email) || email.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Please keep your name under ${MAX_NAME_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  if (phone.length > MAX_PHONE_LENGTH) {
    return NextResponse.json(
      { error: `Please keep your phone number under ${MAX_PHONE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY is not set. Add it in your Vercel project's Environment Variables."
    );
    return NextResponse.json(
      { error: "The contact form isn't configured yet. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>${phone ? `\nPhone: ${phone}` : ""}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Something went wrong sending your message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
