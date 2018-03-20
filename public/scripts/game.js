const gameId = document.currentScript.dataset.gameId

// let name = window.prompt("Your name?")
// while (!name) {
//   name = window.prompt("Please enter a valid name.")
// }

const name = "testname" + Math.random()

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
      playerList.innerHTML = command.players
        .map(player => `<li>${player.name} - ${player.ready ? "ready" : "not ready"}</li>`)
        .join("")
      break
    }

    case "show-drawing": {
      const drawingDisplay = document.querySelector("#drawing")
      drawingDisplay.innerText = `Your drawing is: ${command.drawing}`
      break
    }

    case "error": {
      window.alert(`Socket error: ${command.message}`)
      break
    }
  }
}

const readyButton = document.querySelector("#ready-button")

readyButton.addEventListener("click", () => {
  socket.send(
    JSON.stringify({
      type: "ready-up",
    }),
  )
  readyButton.disabled = true
})
