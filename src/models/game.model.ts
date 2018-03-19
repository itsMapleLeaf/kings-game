export type GameID = string

export class Game {
  id: GameID = String(Math.floor(Math.random() * 10000))
}
