import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // 3 submissions per visitor per hour
  if (!(await rateLimit(request, 'contact', 3, 60 * 60))) {
    return NextResponse.json(
      { error: 'Too many messages. Try again in an hour.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Simulate network delay for sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, integrate Resend, Sendgrid, or nodemailer here.
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
