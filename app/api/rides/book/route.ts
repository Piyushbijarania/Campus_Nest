import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Please log in to book a ride" },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const { rideId } = body;
    if (!rideId) {
      return NextResponse.json(
        { success: false, message: "rideId is required" },
        { status: 400 }
      );
    }

    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return NextResponse.json(
        { success: false, message: "Ride not found" },
        { status: 404 }
      );
    }

    if (ride.seats <= 0) {
      return NextResponse.json(
        { success: false, message: "Ride full" },
        { status: 400 }
      );
    }

    const updatedRide = await prisma.ride.update({
      where: { id: rideId },
      data: { seats: ride.seats - 1 },
    });

    return NextResponse.json({
      success: true,
      remainingSeats: updatedRide.seats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Booking failed" },
      { status: 500 }
    );
  }
}
