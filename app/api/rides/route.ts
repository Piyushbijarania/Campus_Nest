// Member 4: GET rides, POST create ride
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

// Create Ride
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    if (!user.college) {
      return NextResponse.json(
        { success: false, message: "User has no college assigned" },
        { status: 400 }
      )
    }

    const { source, destination, date, seats } = await req.json()

    await prisma.ride.create({
      data: {
        source,
        destination,
        date: new Date(date),
        seats,
        college: user.college
      }
    })

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
// Get Rides
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || !user.college) {
      return NextResponse.json([])
    }

    const rides = await prisma.ride.findMany({
      where: {
        college: user.college
      },
      select: {
        id: true,
        source: true,
        destination: true,
        date: true,
        seats: true
      }
    })

    return NextResponse.json(rides)

  } catch (error) {
    return NextResponse.json([])
  }
}
