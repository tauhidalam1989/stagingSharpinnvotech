import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { message: 'Valid email is required' },
                { status: 400 }
            );
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8093/v1';
        const apiKey = 'sdghfnbfvdsdtfjghbfgsgdtfjhgbfdsdgthghbgfestytgjhbgfgtyjg';

        const response = await fetch(`${backendUrl}/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(
                { message: 'Subscribed successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: data.message || 'Subscription failed' },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Newsletter API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
