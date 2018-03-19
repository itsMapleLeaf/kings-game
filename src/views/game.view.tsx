import * as React from "react"
import { Layout } from "./layout.view"
import { Game } from "../models/game.model"

export function GamePage({ game }: { game: Game }) {
  return <Layout>you are in game #{game.id}</Layout>
}
