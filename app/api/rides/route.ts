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

    const body = await req.json()
    const { source, destination, date, seats, contactInfo } = body

    const numSeats = Number(seats)
    if (!Number.isInteger(numSeats) || numSeats < 1 || numSeats > 10) {
      return NextResponse.json(
        { success: false, message: "Seats must be between 1 and 10" },
        { status: 400 }
      )
    }
    const rideDate = new Date(date)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    if (rideDate < todayStart) {
      return NextResponse.json(
        { success: false, message: "Ride date must be today or later" },
        { status: 400 }
      )
    }

    await prisma.ride.create({
      data: {
        source: String(source).trim(),
        destination: String(destination).trim(),
        date: rideDate,
        seats: numSeats,
        college: user.college,
        contactInfo: contactInfo && String(contactInfo).trim() ? String(contactInfo).trim() : null,
      }
    })

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
// Get Rides – requires login
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.college) {
      return NextResponse.json(
        { message: "Please log in to view rides" },
        { status: 401 }
      );
    }

    const rides = await prisma.ride.findMany({
      where: {
        college: user.college,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // only upcoming (today or later)
      },
      select: {
        id: true,
        source: true,
        destination: true,
        date: true,
        seats: true,
        contactInfo: true,
      },
      orderBy: [
        { seats: "desc" },  // non-full (more seats) first
        { date: "asc" },    // then soonest date first
      ],
    })

    return NextResponse.json(rides)

  } catch (error) {
    return NextResponse.json([])
  }
}
