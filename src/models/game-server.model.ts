import ws from "ws"
import { Game, GameID } from "./game.model"

export class GameServer {
  // server = new ws.Server({ port: 4000 })
  games = new Map<GameID, Game>()

  createGame(): Game {
    const game = new Game()
    this.games.set(game.id, game)
    return game
  }

  getGame(id: GameID): Game | undefined {
    return this.games.get(id)
  }
}
