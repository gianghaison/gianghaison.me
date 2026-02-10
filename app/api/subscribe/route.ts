import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.BEEHIIV_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Beehiiv API key not configured" },
        { status: 500 }
      )
    }

    const publicationId = process.env.BEEHIIV_PUBLICATION_ID || "pub_7cdd418e-246a-458d-b83a-f49f91aca672"

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ success: true, data })
    }

    const errorData = await response.json().catch(() => ({}))

    // Handle already subscribed case
    if (response.status === 409 || errorData?.message?.includes("already")) {
      return NextResponse.json({ success: true, alreadySubscribed: true })
    }

    return NextResponse.json(
      { error: errorData?.message || "Subscription failed" },
      { status: response.status }
    )
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
