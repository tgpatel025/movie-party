import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketStatus } from '../enums/websocket-status';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  webSocket: WebSocket;
  webSocketConnectionId: string;
  videoStatusSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  onWebsocketOpen() {
    // TODO
  }

  onWebSoketClose() {
    // TODO
  }

  onWebSocketMessage(event) {
    const data = JSON.parse(event.data);
    if (data.status === WebSocketStatus.CONNECTED) {
      this.webSocketConnectionId = data.connectionId;
    }
    if (data.status === WebSocketStatus.VIDEO_STATUS) {
      this.videoStatusSubject.next(data);
    }
  }

  onWebSocketError(event) {
    console.log(event);
  }

  sendMessageViaWebSocket(message: any) {
    const data = { ...message, connectionId: this.webSocketConnectionId }
    this.webSocket.send(data);
  }

}
