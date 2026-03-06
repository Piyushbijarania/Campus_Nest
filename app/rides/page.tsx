"use client"

import { useEffect, useState } from "react"
import RideCard from "@/components/rides/RideCard"

export default function RidesPage() {

  const [rides,setRides] = useState([])

  const loadRides = async () => {
    const res = await fetch("/api/rides")
    const data = await res.json()
    setRides(data)
  }

  useEffect(()=>{
    loadRides()
  },[])

  return (
    <div className="p-6 space-y-4">
      {rides.map((ride:any)=>(
        <RideCard key={ride.id} ride={ride} refresh={loadRides}/>
      ))}
    </div>
  )
}
