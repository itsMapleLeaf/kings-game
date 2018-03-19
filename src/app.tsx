import express from "express"
import { resolve } from "path"
import * as React from "react"
import { renderToString } from "react-dom/server"

import { GameNotFoundPage } from "./views/game-not-found.view"
import { GameServer } from "./models/game-server.model"
import { GamePage } from "./views/game.view"
import { HomePage } from "./views/home.view"

export function run() {
  const app = express()
  const port = Number(process.env.PORT) || 3000
  const gameServer = new GameServer()

  app.get("/", (req, res) => {
    res.send(renderToString(<HomePage />))
  })

  app.get("/games/create", (req, res) => {
    const game = gameServer.createGame()
    res.redirect("/games/" + game.id)
  })

  app.get("/games/:id", (req, res) => {
    const game = gameServer.getGame(req.params.id)
    if (game) {
      res.send(renderToString(<GamePage game={game} />))
    } else {
      res.send(renderToString(<GameNotFoundPage id={req.params.id} />))
    }
  })

  app.use("/public", express.static(resolve(__dirname, "../public")))

  app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
  })
}
