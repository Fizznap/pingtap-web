import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// 1. GET Request: Used by Facebook to verify the webhook
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }
    return new NextResponse('Bad Request', { status: 400 });
}

// 2. POST Request: Used to receive messages
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if this is a WhatsApp status update or message
        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const from = message.from;
                const msgBody = message.text?.body;

                console.log(`Received WhatsApp message from ${from}: ${msgBody}`);

                // TODO: 
                // 1. Find user by 'from' (phone number) in Supabase.
                // 2. Find active ticket for this user.
                // 3. Append message to the ticket chat.
                // 4. If no active ticket, maybe create one or send auto-reply.
            }

            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        } else {
            return new NextResponse('Not Found', { status: 404 });
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
