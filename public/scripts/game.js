const gameId = document.currentScript.dataset.gameId

const drawingDisplay = document.querySelector("#drawing")
const playerListDisplay = document.querySelector("#player-list")
const readyButton = document.querySelector("#ready-button")

// let name = window.prompt("Your name?")
// while (!name) {
//   name = window.prompt("Please enter a valid name.")
// }

const name = "testname" + Math.random()

const socket = new WebSocket("ws://localhost:4000")

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
      playerListDisplay.innerHTML = command.players
        .map(player => `<li>${player.name} - ${player.ready ? "ready" : "not ready"}</li>`)
        .join("")
      break
    }

    case "show-drawing": {
      drawingDisplay.innerText = `Your drawing is: ${command.drawing}`
      readyButton.disabled = false
      break
    }

    case "error": {
      window.alert(`Socket error: ${command.message}`)
      break
    }
  }
}

socket.onclose = () => {
  window.alert("Socket connection lost. Returning to home...")
  window.location.assign("/")
}

readyButton.addEventListener("click", () => {
  socket.send(
    JSON.stringify({
      type: "ready-up",
    }),
  )
  readyButton.disabled = true
})
