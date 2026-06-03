# SnakeSaintGer

A minimal browser-based Snake game with an abstract Saint-Germain-en-Laye map-inspired background.

## Open and play locally

No installation or external dependencies are required.

1. Clone or download this repository.
2. Open `index.html` directly in a modern web browser.
3. Use the arrow keys on desktop, swipe on mobile and tablet, or tap the on-screen direction buttons to start and steer the snake.
4. Eat the red food to increase your score.
5. Avoid the walls and the snake's body.
6. Click **Restart** to play again after a game over or to reset the board.

You can also serve the folder with any local static file server, for example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Mobile testing on iPhone Safari

1. Serve the folder from your computer with a local static server, such as `python3 -m http.server 8000`.
2. Open the site in iPhone Safari using the computer's local network address, for example `http://192.168.1.10:8000`.
3. Confirm the initial message says, "Use arrow keys, swipe, or buttons to move."
4. Swipe on the board and on the message overlay to confirm both gestures start and steer the game.
5. Tap each on-screen direction button to confirm buttons start the game and change direction.
6. Use **Restart** between checks if the snake hits a wall or itself.
