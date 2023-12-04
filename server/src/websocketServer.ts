import { WebSocketServer } from 'ws';
import { isWithinGoalRadius } from './utils/gameLogic';

export function startWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });
  const goalPosition: [number, number] = [51.515, -0.1];

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log(message.toString());
      const { position } = JSON.parse(message.toString());
      console.log(position);
      const lat = position['lat'];
      const lng = position['lng'];
      const positionArray: any = [lat, lng];
      const goalReached = isWithinGoalRadius(positionArray, goalPosition);

      ws.send(JSON.stringify({ goalReached }));
    });
  });

  console.log(`WebSocket server started on port ${port}`);
}
