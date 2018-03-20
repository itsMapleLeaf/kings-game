import express from "express"
import { resolve } from "path"
import * as React from "react"
import { renderToString } from "react-dom/server"
import WebSocket from "ws"

import { GameManager } from "./models/game-manager.model"
import { GameNotFoundPage } from "./views/game-not-found.view"
import { GamePage } from "./views/game.view"
import { HomePage } from "./views/home.view"
import { Player } from "./models/user.model"
import { Game } from "./models/game.model"

export function run() {
  const app = express()
  const port = Number(process.env.PORT) || 3000
  const gameService = new GameManager()

  app.get("/", (req, res) => {
    res.send(renderToString(<HomePage />))
  })

  app.get("/games/create", (req, res) => {
    const game = gameService.createGame()
    res.redirect("/games/" + game.id)
  })

  app.get("/games/:id", (req, res) => {
    const game = gameService.getGame(req.params.id)
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

  const socket = new WebSocket.Server({ port: 4000 })

  socket.on("connection", (client, request) => {
    const ip = request.connection.remoteAddress || request.connection.localAddress
    console.log(`[${ip}] connected`)

    let game: Game | undefined
    let player: Player | undefined

    client.on("message", data => {
      const command = JSON.parse(data.toString())

      if (command.type === "join-game") {
        const { id, name } = command
        game = gameService.getGame(id)

        if (!game) {
          client.send(
            JSON.stringify({
              type: "error",
              message: `Could not find game #${id}`,
            }),
          )
          client.close()
          return
        }

        player = new Player(name)

        game.addPlayer(client, player)

        for (const otherClient of game.getPlayerClients()) {
          otherClient.send(
            JSON.stringify({
              type: "update-players",
              players: game.getPlayers(),
            }),
          )
        }
      } else if (command.type === "ready-up") {
        if (player) {
          player.ready = true
        }
        if (game) {
          for (const otherClient of game.getPlayerClients()) {
            otherClient.send(
              JSON.stringify({
                type: "update-players",
                players: game.getPlayers(),
              }),
            )
          }
        }
      } else {
        console.log(`[${ip}] received invalid message: ${data}`)
      }
    })

    client.on("close", () => {
      console.log(`[${ip}] disconnected`)
      if (game) {
        game.removePlayer(client)

        for (const otherClient of game.getPlayerClients()) {
          otherClient.send(
            JSON.stringify({
              type: "update-players",
              players: game.getPlayers(),
            }),
          )
        }
      }
    })
  })
}
