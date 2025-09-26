import { Pixel, ChatMessage } from "../types";

export class WebSocketService {
  private canvasSocket: WebSocket | null = null;
  private chatSocket: WebSocket | null = null;
  private canvasCallbacks: ((pixel: Pixel) => void)[] = [];
  private chatCallbacks: ((message: ChatMessage) => void)[] = [];

  async connectCanvas(websocketUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.canvasSocket = new WebSocket(websocketUrl);

        this.canvasSocket.onopen = () => {
          console.log("Canvas WebSocket connected");
          resolve();
        };

        this.canvasSocket.onmessage = (event) => {
          try {
            const pixel: Pixel = JSON.parse(event.data);
            this.canvasCallbacks.forEach((callback) => callback(pixel));
          } catch (error) {
            console.error("Error parsing canvas message:", error);
          }
        };

        this.canvasSocket.onerror = (error) => {
          console.error("Canvas WebSocket error:", error);
          reject(error);
        };

        this.canvasSocket.onclose = () => {
          console.log("Canvas WebSocket disconnected");
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async connectChat(websocketUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.chatSocket = new WebSocket(websocketUrl);

        this.chatSocket.onopen = () => {
          console.log("Chat WebSocket connected");
          resolve();
        };

        this.chatSocket.onmessage = (event) => {
          try {
            const message: ChatMessage = JSON.parse(event.data);
            this.chatCallbacks.forEach((callback) => callback(message));
          } catch (error) {
            console.error("Error parsing chat message:", error);
          }
        };

        this.chatSocket.onerror = (error) => {
          console.error("Chat WebSocket error:", error);
          reject(error);
        };

        this.chatSocket.onclose = () => {
          console.log("Chat WebSocket disconnected");
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  onCanvasUpdate(callback: (pixel: Pixel) => void): void {
    this.canvasCallbacks.push(callback);
  }

  onChatMessage(callback: (message: ChatMessage) => void): void {
    this.chatCallbacks.push(callback);
  }

  disconnect(): void {
    if (this.canvasSocket) {
      this.canvasSocket.close();
      this.canvasSocket = null;
    }
    if (this.chatSocket) {
      this.chatSocket.close();
      this.chatSocket = null;
    }
  }

  isCanvasConnected(): boolean {
    return this.canvasSocket?.readyState === WebSocket.OPEN;
  }

  isChatConnected(): boolean {
    return this.chatSocket?.readyState === WebSocket.OPEN;
  }
}

export const webSocketService = new WebSocketService();
