"use client"

import { useEffect, useState } from "react"

export default function ConnectionDuration({
  time,
}: {
  time: number | undefined
}) {
  if (!time) return null

  // get the difference between time and current time and update the UI
  const [difference, setDifference] = useState((Date.now() - time) / 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setDifference((Date.now() - time) / 1000)
    }, 1000)

    return () => clearInterval(interval)
  }, [time])

  const hours = Math.floor(difference / 3600)
  const minutes = Math.floor((difference % 3600) / 60)

  return (
    <h1>
      {hours !== 0 && `${hours}h`} {minutes !== 0 && `${minutes}m`}{" "}
      {Math.floor(difference % 60)}s
    </h1>
  )
}
