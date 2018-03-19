import * as React from "react"
import { GameID } from "../models/game.model"
import { Layout } from "./layout.view"

export function GameNotFoundPage({ id }: { id: GameID }) {
  return <Layout>couldn't find game {id}</Layout>
}
