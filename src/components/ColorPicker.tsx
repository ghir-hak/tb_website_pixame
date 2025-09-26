import React from "react";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const colors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#A52A2A", // Brown
    "#808080", // Gray
    "#C0C0C0", // Silver
    "#FFD700", // Gold
    "#008000", // Dark Green
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Color Picker</h3>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
              selectedColor === color
                ? "border-gray-800 shadow-lg ring-2 ring-primary-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="mt-3 p-2 bg-gray-100 rounded-md">
        <div className="text-sm text-gray-600">Selected:</div>
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          ></div>
          <span className="text-sm font-mono text-gray-800">
            {selectedColor}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
