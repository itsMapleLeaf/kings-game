import WebSocket from "ws"

import { Player } from "./user.model"

export type GameID = string

export class Game {
  id: GameID = String(Math.floor(Math.random() * 10000))
  players = new Map<WebSocket, Player>()

  addPlayer(socket: WebSocket, player: Player) {
    this.players.set(socket, player)
  }

  removePlayer(socket: WebSocket) {
    this.players.delete(socket)
  }

  getPlayers(): Player[] {
    return [...this.players.values()]
  }
}
