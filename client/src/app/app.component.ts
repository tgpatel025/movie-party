import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(private websocketService: WebsocketService) {
    this.websocketService.webSocket = new WebSocket('ws://localhost:3001', 'movie-party');
    this.websocketService.webSocket.onopen = () => this.websocketService.onWebsocketOpen();
    this.websocketService.webSocket.onclose = () => this.websocketService.onWebSoketClose();
    this.websocketService.webSocket.onerror = (event) => this.websocketService.onWebSocketError(event)
    this.websocketService.webSocket.onmessage = (event) => this.websocketService.onWebSocketMessage(event);
  }
}
