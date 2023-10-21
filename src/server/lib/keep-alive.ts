export async function keepAlive(enable: boolean) {
  // if (enable) {
  //   exec("/home/moe/easy-vpn/client/keep-alive.sh &")
  // } else {
  //   exec("pkill -P $(pgrep keep-alive.sh)")
  // }
  return { ip: await idk() }
}

const ip = "1.1.1.1"

async function idk() {
  const res = await fetch("https://icanhazip.com/", { cache: "no-cache" })
  const currentIP = (await res.text()).trim()

  if (currentIP === ip) {
    return true
  } else {
    return false
  }
}
