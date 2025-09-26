import { Pixel, ChatMessage, ApiResponse, WebSocketConfig } from "../types";

const API_BASE_URL = "https://95xp3ddq0.blackhole.localtau"; // Replace with your actual Taubyte domain

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Canvas API
  async drawPixel(pixel: Omit<Pixel, "time">): Promise<ApiResponse<Pixel>> {
    return this.request<Pixel>("/drawPixel", {
      method: "POST",
      body: JSON.stringify(pixel),
    });
  }

  async getPixel(x: number, y: number): Promise<ApiResponse<Pixel>> {
    return this.request<Pixel>(`/getPixel?x=${x}&y=${y}`);
  }

  async getCanvas(): Promise<ApiResponse<Pixel[]>> {
    return this.request<Pixel[]>("/getCanvas");
  }

  // Chat API
  async sendMessage(
    message: Omit<ChatMessage, "id" | "time">
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>("/sendMessage", {
      method: "POST",
      body: JSON.stringify(message),
    });
  }

  async getMessages(): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>("/getMessages");
  }

  // WebSocket API
  async getWebSocketURL(
    type: "canvas" | "chat"
  ): Promise<ApiResponse<WebSocketConfig>> {
    return this.request<WebSocketConfig>(`/getWebSocketURL?type=${type}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>("/health");
  }
}

export const apiService = new ApiService();
