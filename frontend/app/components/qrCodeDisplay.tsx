// components/QRCodeDisplay.tsx
import React from "react";
// FIX: Change named import {QRCode} to a default import, and alias it
import * as QrCode from "qrcode.react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  fgColor?: string;
  bgColor?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 64,
  level = "H",
  fgColor = "#000000",
  bgColor = "#ffffff",
}) => {
  return (
    <div className="p-4 bg-white rounded-lg flex justify-center items-center">
      {/* Use the aliased name for the component */}
      <QrCode.QRCodeSVG
        value={value}
        size={size}
        level={level}
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </div>
  );
};

export default QRCodeDisplay;
