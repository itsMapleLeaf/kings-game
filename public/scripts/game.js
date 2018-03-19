const gameId = document.currentScript.dataset.gameId

let name = window.prompt("Your name?")
while (!name) {
  name = window.prompt("Please enter a valid name.")
}

const socket = new WebSocket("ws://localhost:4000")

const players = []

socket.onopen = () => {
  socket.send(
    JSON.stringify({
      type: "join-game",
      id: gameId,
      name,
    }),
  )
}

socket.onmessage = message => {
  const command = JSON.parse(message.data)

  switch (command.type) {
    case "update-players": {
      const playerList = document.querySelector("#player-list")
      playerList.innerHTML = command.players.map(player => `<li>${player.name}</li>`).join("")
      break
    }

    case "error": {
      window.alert(`Socket error: ${command.message}`)
      break
    }
  }
}
