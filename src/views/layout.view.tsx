import * as React from "react"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>king's game</title>
      </head>
      <body>
        <h1>King's Game</h1>
        {children}
      </body>
    </html>
  )
}
