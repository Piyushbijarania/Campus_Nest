"use client"

import { useState } from "react"

export default function AddRidePage() {
  const [source,setSource] = useState("")
  const [destination,setDestination] = useState("")
  const [date,setDate] = useState("")
  const [seats,setSeats] = useState(1)

  const handleSubmit = async (e:any) => {
    e.preventDefault()

    await fetch("/api/rides",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({
        source,
        destination,
        date,
        seats
      })
    })

    alert("Ride created")
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input placeholder="Source" onChange={e=>setSource(e.target.value)} />
      <input placeholder="Destination" onChange={e=>setDestination(e.target.value)} />
      <input type="date" onChange={e=>setDate(e.target.value)} />
      <input type="number" onChange={e=>setSeats(Number(e.target.value))} />
      <button>Create Ride</button>
    </form>
  )
}
