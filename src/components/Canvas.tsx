import React, { useRef, useEffect, useState, useCallback } from "react";
import { Pixel } from "../types";
import { apiService } from "../services/api";
import { webSocketService } from "../services/websocket";

interface CanvasProps {
  width: number;
  height: number;
  pixelSize: number;
  userId: string;
  selectedColor: string;
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  pixelSize,
  userId,
  selectedColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setPixels] = useState<Map<string, Pixel>>(new Map());
  const [isDrawing, setIsDrawing] = useState(false);

  // Load initial canvas
  useEffect(() => {
    const loadCanvas = async () => {
      const response = await apiService.getCanvas();
      if (response.success && response.data) {
        const pixelMap = new Map<string, Pixel>();
        response.data.forEach((pixel) => {
          const key = `${pixel.x},${pixel.y}`;
          pixelMap.set(key, pixel);
        });
        setPixels(pixelMap);
        drawPixels(pixelMap);
      }
    };

    loadCanvas();
  }, []);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        const response = await apiService.getWebSocketURL("canvas");
        if (response.success && response.data) {
          await webSocketService.connectCanvas(response.data.websocketUrl);

          webSocketService.onCanvasUpdate((pixel: Pixel) => {
            setPixels((prev) => {
              const newPixels = new Map(prev);
              const key = `${pixel.x},${pixel.y}`;
              newPixels.set(key, pixel);
              drawPixels(newPixels);
              return newPixels;
            });
          });
        }
      } catch (error) {
        console.error("Failed to setup canvas WebSocket:", error);
      }
    };

    setupWebSocket();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const drawPixels = useCallback(
    (pixelMap: Map<string, Pixel>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width * pixelSize, height * pixelSize);

      // Draw grid
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * pixelSize, 0);
        ctx.lineTo(x * pixelSize, height * pixelSize);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * pixelSize);
        ctx.lineTo(width * pixelSize, y * pixelSize);
        ctx.stroke();
      }

      // Draw pixels
      pixelMap.forEach((pixel) => {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(
          pixel.x * pixelSize + 1,
          pixel.y * pixelSize + 1,
          pixelSize - 2,
          pixelSize - 2
        );
      });
    },
    [width, height, pixelSize]
  );

  const getPixelCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      return { x, y };
    }
    return null;
  };

  const drawPixel = async (x: number, y: number) => {
    try {
      const response = await apiService.drawPixel({
        x,
        y,
        color: selectedColor,
        userId,
      });

      if (response.success && response.data) {
        // Pixel will be updated via WebSocket
        console.log("Pixel drawn successfully");
      } else {
        console.error("Failed to draw pixel:", response.error);
      }
    } catch (error) {
      console.error("Error drawing pixel:", error);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoordinates(event);
    if (coords) {
      setIsDrawing(true);
      drawPixel(coords.x, coords.y);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const coords = getPixelCoordinates(event);
      if (coords) {
        drawPixel(coords.x, coords.y);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={width * pixelSize}
        height={height * pixelSize}
        className="border-2 border-gray-300 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <div className="text-sm text-gray-600">
        Canvas: {width} × {height} pixels
      </div>
    </div>
  );
};

export default Canvas;
