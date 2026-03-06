"use client"

export default function RideCard({ ride, refresh }: any) {

  const bookRide = async () => {
    await fetch("/api/rides/book",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ rideId: ride.id })
    })

    refresh()
  }

  return (
    <div className="border p-4 rounded">
      <h3>{ride.source} → {ride.destination}</h3>
      <p>Date: {new Date(ride.date).toDateString()}</p>
      <p>Seats: {ride.seats}</p>

      <button
        disabled={ride.seats === 0}
        onClick={bookRide}
      >
        {ride.seats === 0 ? "Full" : "Book"}
      </button>
    </div>
  )
}
