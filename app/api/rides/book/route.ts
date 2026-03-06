// Member 4: POST book ride
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { rideId } = await req.json()

    const ride = await prisma.ride.findUnique({
      where: { id: rideId }
    })

    if (!ride) {
      return NextResponse.json(
        { success: false, message: "Ride not found" },
        { status: 404 }
      )
    }

    if (ride.seats <= 0) {
      return NextResponse.json(
        { success: false, message: "Ride full" },
        { status: 400 }
      )
    }

    const updatedRide = await prisma.ride.update({
      where: { id: rideId },
      data: {
        seats: ride.seats - 1
      }
    })

    return NextResponse.json({
      success: true,
      remainingSeats: updatedRide.seats
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Booking failed" },
      { status: 500 }
    )
  }
}
  } catch (error) {
    return Response.json({
      success: false
    })
  }
}
