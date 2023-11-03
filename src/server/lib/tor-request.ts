import request from "request"

type Response = {
  success: boolean
  data: string | object | null
  error: string | null
}

export default async function torRequest(
  input: string,
  method: "GET" | "POST" = "GET",
  body?: any
) {
  return await new Promise<Response>((res, rej) => {
    request(
      {
        url: process.env.SERVER_URL! + input,
        method,
        proxy:
          process.env.NODE_ENV !== "development" && "http://127.0.0.1:9080",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
      async function (error, response, body) {
        if (error)
          rej({
            success: false,
            error,
            data: null,
          })
        else {
          try {
            res({
              success: true,
              error: null,
              data: JSON.parse(body),
            })
          } catch (e) {
            res({
              success: true,
              error: null,
              data: body,
            })
          }
        }
      }
    )
  })
}
