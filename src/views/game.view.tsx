import * as React from "react"
import { Layout } from "./layout.view"
import { Game } from "../models/game.model"

export function GamePage({ game }: { game: Game }) {
  return (
    <Layout>
      <h2>you are in game #{game.id}</h2>
      <button id="ready-button">Ready</button>
      <h3>players:</h3>
      <ul id="player-list" />
      <script data-game-id={game.id} src="/public/scripts/game.js" />
    </Layout>
  )
}
