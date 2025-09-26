import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import Chat from "./components/Chat";
import ColorPicker from "./components/ColorPicker";
import UserInfo from "./components/UserInfo";
import { apiService } from "./services/api";

function App() {
  const [userId, setUserId] = useState("Anonymous");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isConnected, setIsConnected] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 50, height: 50 });
  const [pixelSize, setPixelSize] = useState(10);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await apiService.healthCheck();
        setIsConnected(response.success);
        if (response.success) {
          console.log("Backend is healthy");
        } else {
          console.error("Backend health check failed:", response.error);
        }
      } catch (error) {
        console.error("Failed to check backend health:", error);
        setIsConnected(false);
      }
    };

    checkHealth();
  }, []);

  const generateRandomUserId = () => {
    const adjectives = [
      "Happy",
      "Creative",
      "Artistic",
      "Colorful",
      "Bright",
      "Vibrant",
      "Cool",
      "Amazing",
    ];
    const nouns = [
      "Artist",
      "Painter",
      "Creator",
      "Designer",
      "Maker",
      "Builder",
      "Craftsman",
      "Genius",
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
  };

  // Generate random user ID on first load
  useEffect(() => {
    if (userId === "Anonymous") {
      setUserId(generateRandomUserId());
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Pixame</h1>
              <span className="text-sm text-gray-600">
                Collaborative Pixel Art
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserInfo userId={userId} onUserIdChange={setUserId} />
            <ColorPicker
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />

            {/* Canvas Controls */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Canvas Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canvas Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={canvasSize.width}
                      onChange={(e) =>
                        setCanvasSize((prev) => ({
                          ...prev,
                          width: parseInt(e.target.value) || 50,
                        }))
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      min="10"
                      max="100"
                    />
                    <input
                      type="number"
                      value={canvasSize.height}
                      onChange={(e) =>
                        setCanvasSize((prev) => ({
                          ...prev,
                          height: parseInt(e.target.value) || 50,
                        }))
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      min="10"
                      max="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pixel Size
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={pixelSize}
                    onChange={(e) => setPixelSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    {pixelSize}px
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Canvas</h2>
                <div className="text-sm text-gray-600">
                  {canvasSize.width} × {canvasSize.height} pixels
                </div>
              </div>
              <Canvas
                width={canvasSize.width}
                height={canvasSize.height}
                pixelSize={pixelSize}
                userId={userId}
                selectedColor={selectedColor}
              />
            </div>
          </div>

          {/* Right Sidebar - Chat */}
          <div className="lg:col-span-1">
            <Chat userId={userId} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Pixame - Collaborative Pixel Art Platform</p>
            <p className="mt-1">Built with Taubyte, React, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
