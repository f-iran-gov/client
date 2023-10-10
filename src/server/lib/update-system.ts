import asyncExec from "./async-exec"

export const dynamic = "force-dynamic"
export const runtime = "edge"

export async function isUpdated() {
  // Get the version from online and compare it to the local version
  const res = await fetch(
    "https://raw.githubusercontent.com/f-iran-gov/client/master/package.json",
    { cache: "no-cache" }
  )
  const data = await res.json()

  const updating = await asyncExec(
    "ps aux | pgrep update.sh",
    (err, stdout) => {
      if (stdout) return true
      else return false
    }
  )

  return process.env.npm_package_version === data.version || updating
}

export async function updateSystem(): Promise<{
  updated: boolean
  message: string
}> {
  const updated = await isUpdated()

  if (updated) {
    return { updated, message: "Already up to date." }
  }

  // we save a copy of update.sh, and then we run it
  await asyncExec("sudo cp ./update.sh /usr/local/bin/update.sh")
  asyncExec("sudo /usr/local/bin/update.sh &")

  return { updated: true, message: "Updating..." }
}
