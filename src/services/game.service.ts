import { IncomingMessage } from "http"
import WebSocket from "ws"

import { Game, GameID } from "../models/game.model"
import { Player } from "../models/user.model"

export class GameService {
  private server = new WebSocket.Server({ port: 4000 })
  private games = new Map<GameID, Game>()

  constructor() {
    this.server.on("connection", (client, request) => this.handleConnection(client, request))
  }

  createGame(): Game {
    const game = new Game()
    this.games.set(game.id, game)
    return game
  }

  getGame(id: GameID): Game | undefined {
    return this.games.get(id)
  }

  private handleConnection(client: WebSocket, request: IncomingMessage) {
    console.log(`client connected from ${request.connection.remoteAddress}`)

    client.on("message", (data: WebSocket.Data) => {
      const command = JSON.parse(data.toString())

      switch (command.type) {
        case "join-game": {
          this.handleJoinGameCommand(command, client)
          break
        }
      }
    })

    client.on("close", () => {
      console.log("client disconnected")

      this.games.forEach(game => {
        game.removePlayer(client)
        this.broadcastPlayerUpdate(game)
      })
    })
  }

  private handleJoinGameCommand(command: any, client: WebSocket) {
    const game = this.getGame(command.id)
    if (!game) {
      this.sendErrorCommand(client, `Could not find game "${command.id}"`)
    } else {
      game.addPlayer(client, new Player(command.name))
      this.broadcastPlayerUpdate(game)
    }
  }

  private sendErrorCommand(client: WebSocket, message: string) {
    client.send(
      JSON.stringify({
        type: "error",
        message,
      }),
    )
  }

  private broadcastPlayerUpdate(game: Game) {
    this.server.clients.forEach(other => {
      other.send(
        JSON.stringify({
          type: "update-players",
          players: game.getPlayers(),
        }),
      )
    })
  }
}
