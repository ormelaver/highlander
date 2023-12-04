// src/websocketServer.ts

import { WebSocketServer } from 'ws';
import { isWithinGoalRadius } from './utils/gameLogic';

export function startWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });
  const goalPosition: [number, number] = [51.515, -0.1]; // Set your goal position

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const { userPosition } = JSON.parse(message.toString());
      const goalReached = isWithinGoalRadius(userPosition, goalPosition);

      ws.send(JSON.stringify({ goalReached }));
    });
  });

  console.log(`WebSocket server started on port ${port}`);
}
