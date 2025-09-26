export interface Pixel {
  x: number;
  y: number;
  color: string;
  userId: string;
  time: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  time: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WebSocketConfig {
  websocketUrl: string;
  channel: string;
}
