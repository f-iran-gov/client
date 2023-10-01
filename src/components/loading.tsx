import { cn } from "@/lib/utils"

export default function Loading({
  center = false,
  noText = false,
  className = "",
}: {
  center?: boolean
  noText?: boolean
  className?: string
}) {
  const c = cn(
    center
      ? "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-4 text-lg"
      : "flex justify-center items-center",
    className
  )

  return (
    <div className={c}>
      <div
        className={
          (center ? "h-8 w-8" : "h-5 w-5") +
          " inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        }
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
      </div>
      {noText ? <></> : <h1 className="ml-2">Loading...</h1>}
    </div>
  )
}
