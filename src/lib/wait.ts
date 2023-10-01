export function wait(time: number) {
  return new Promise<void>((res, rej) => setTimeout(res, time * 1000))
}
