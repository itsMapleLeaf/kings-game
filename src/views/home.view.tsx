import * as React from "react"
import { Layout } from "./layout.view"

export function HomePage() {
  return (
    <Layout>
      <a href="/games/create">create new game</a>
    </Layout>
  )
}
