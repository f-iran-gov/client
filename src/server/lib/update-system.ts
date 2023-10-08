import asyncExec from "./async-exec"

export async function isUpdated() {
  // Get the version from online and compare it to the local version
  const res = await fetch(
    "https://raw.githubusercontent.com/f-iran-gov/client/master/package.json",
    { cache: "no-cache" }
  )
  const data = await res.json()

  return process.env.npm_package_version === data.version
}

export async function updateSystem(): Promise<{
  updated: boolean
  message: string
}> {
  const updated = await isUpdated()

  if (updated) {
    return { updated, message: "Already up to date." }
  }

  return await asyncExec("sudo ./update.sh > ./out", (err, _) => {
    if (err) return { updated: false, message: "Error updating." }
    return { updated: true, message: "Updated." }
  })

  // const sc = spawn("sudo", ["./update.sh"])
  // sc.stdout.on("data", progress => {
  //   console.log(progress, "\n")
  // })
  // sc.kill()

  // return { updated: true, message: "Updated." }
}
