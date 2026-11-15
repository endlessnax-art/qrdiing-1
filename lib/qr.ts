import QRCode from "qrcode";

export interface QRCanvasOptions {
  restaurantName: string;
  tableNumber: string;
  tableName?: string;
  location?: string;
  qrDataUrl: string;
  slug: string;
}

/**
 * Generate a high-resolution base64 PNG data URL of the given target URL.
 * Error correction level 'H' ensures scannability even in harsh lighting or if partially smudged.
 */
export async function generateQRCodeDataURL(
  url: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: options?.width || 512,
    margin: options?.margin ?? 2,
    errorCorrectionLevel: options?.errorCorrectionLevel || "H",
    color: {
      dark: "#090d16",
      light: "#ffffff",
    },
    ...options,
  });
}

/**
 * Generate an SVG string representation of the QR code.
 */
export async function generateQRCodeSVG(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#090d16",
      light: "#ffffff",
    },
  });
}

/**
 * High-resolution PNG download: draws an elegant, printable table placard on a canvas
 * and triggers immediate file download in the browser.
 */
export async function downloadTableQRPNG({
  restaurantName,
  tableNumber,
  tableName,
  location,
  qrDataUrl,
  slug,
}: QRCanvasOptions): Promise<void> {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 2x Retina resolution: 800 x 1060 px
  canvas.width = 800;
  canvas.height = 1060;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border & card frame
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Top Accent Banner
  ctx.fillStyle = "#10b981"; // Emerald-500
  ctx.fillRect(20, 20, canvas.width - 40, 18);

  // Brand Name
  ctx.textAlign = "center";
  ctx.fillStyle = "#0f172a"; // Slate-900
  ctx.font = "900 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(restaurantName.toUpperCase(), 400, 95);

  // Table Identification Pill
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(240, 120, 320, 68, 16) : ctx.rect(240, 120, 320, 68);
  ctx.fill();

  ctx.fillStyle = "#10b981";
  ctx.font = "900 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`TABLE ${tableNumber}`, 400, 168);

  // Location / Section subtitle
  const subtitle = [tableName, location].filter(Boolean).join(" • ");
  if (subtitle) {
    ctx.fillStyle = "#64748b";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(subtitle, 400, 222);
  }

  // Draw QR Image
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // White container for QR with shadow effect
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(140, 250, 520, 520, 24) : ctx.rect(140, 250, 520, 520);
      ctx.fill();
      ctx.stroke();

      // Draw QR at 480 x 480 px
      ctx.drawImage(img, 160, 270, 480, 480);
      resolve();
    };
    img.onerror = reject;
    img.src = qrDataUrl;
  });

  // Call to action headline
  ctx.fillStyle = "#0f172a";
  ctx.font = "900 30px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SCAN TO VIEW MENU & ORDER", 400, 830);

  // Instructions
  ctx.fillStyle = "#475569";
  ctx.font = "500 19px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("1. Open phone camera  •  2. Scan QR  •  3. Instant UPI / Cash", 400, 875);

  // No app required badge
  ctx.fillStyle = "#059669";
  ctx.font = "700 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("✓ No App Download Required • Direct Contactless Ordering", 400, 915);

  // Divider
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 955);
  ctx.lineTo(700, 955);
  ctx.stroke();

  // Platform footer
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Powered by QRDening Smart Restaurant Platform", 400, 995);

  // Trigger download
  const dataUri = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `${slug}-table-${tableNumber}-qr.png`;
  link.href = dataUri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * High-resolution SVG download
 */
export function downloadTableQRSVG({
  restaurantName,
  tableNumber,
  tableName,
  svgString,
  slug,
}: {
  restaurantName: string;
  tableNumber: string;
  tableName?: string;
  svgString: string;
  slug: string;
}): void {
  if (typeof window === "undefined") return;

  // Wrap SVG in a complete scalable card format
  const wrappedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%" style="background:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <rect x="15" y="15" width="470" height="620" rx="16" fill="none" stroke="#e2e8f0" stroke-width="4"/>
  <rect x="15" y="15" width="470" height="12" fill="#10b981"/>
  
  <text x="250" y="65" text-anchor="middle" font-size="22" font-weight="900" fill="#0f172a">${restaurantName.toUpperCase()}</text>
  <rect x="150" y="80" width="200" height="42" rx="10" fill="#0f172a"/>
  <text x="250" y="108" text-anchor="middle" font-size="22" font-weight="900" fill="#10b981">TABLE ${tableNumber}</text>
  ${tableName ? `<text x="250" y="142" text-anchor="middle" font-size="13" font-weight="600" fill="#64748b">${tableName}</text>` : ""}

  <g transform="translate(75, 160)">
    ${svgString.replace(/<\?xml[^>]*\?>/, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")}
  </g>

  <text x="250" y="540" text-anchor="middle" font-size="18" font-weight="900" fill="#0f172a">SCAN TO ORDER &amp; PAY</text>
  <text x="250" y="568" text-anchor="middle" font-size="12" font-weight="500" fill="#64748b">Point camera at QR code • Instant digital menu</text>
  <text x="250" y="592" text-anchor="middle" font-size="11" font-weight="700" fill="#059669">Powered by QRDening Platform</text>
</svg>`;

  const blob = new Blob([wrappedSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `${slug}-table-${tableNumber}-qr.svg`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers PDF export / print dialog with an optimized printable table standee.
 */
export function downloadTableQRPDF({
  restaurantName,
  tableNumber,
  tableName,
  location,
  qrDataUrl,
}: QRCanvasOptions): void {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate and print PDF placard.");
    return;
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>${restaurantName} - Table ${tableNumber} QR Standee</title>
  <style>
    @page {
      size: A5 portrait;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafc;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .card {
      width: 130mm;
      background: #ffffff;
      border: 3px solid #0f172a;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-sizing: border-box;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .brand {
      font-size: 20pt;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      background: #0f172a;
      color: #10b981;
      font-size: 22pt;
      font-weight: 900;
      padding: 6px 24px;
      border-radius: 10px;
      margin-bottom: 8px;
    }
    .loc {
      font-size: 11pt;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .qr-box {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px;
      display: inline-block;
      margin-bottom: 16px;
    }
    .qr-box img {
      width: 75mm;
      height: 75mm;
      display: block;
    }
    .cta {
      font-size: 15pt;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .sub {
      font-size: 10pt;
      color: #475569;
      margin-bottom: 16px;
    }
    .foot {
      font-size: 8pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-weight: 600;
    }
    @media print {
      body {
        background: transparent;
      }
      .card {
        border: 2px solid #0f172a;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">${restaurantName}</div>
    <div class="badge">TABLE ${tableNumber}</div>
    <div class="loc">${[tableName, location].filter(Boolean).join(" • ") || "Dine-In Area"}</div>
    <div class="qr-box">
      <img src="${qrDataUrl}" alt="QR Code" />
    </div>
    <div class="cta">SCAN WITH CAMERA TO ORDER</div>
    <div class="sub">1. Point phone camera • 2. View digital menu • 3. Pay via UPI or Cash</div>
    <div class="foot">No app needed • Powered by QRDening Multi-Restaurant SaaS</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `);
  printWindow.document.close();
}

/**
 * Printable Sticker Sheet: A4 sheet with 12 stickers (3 columns x 4 rows)
 */
export function printStickerSheet({
  restaurantName,
  tables,
}: {
  restaurantName: string;
  tables: { tableNumber: string; qrDataUrl: string; location?: string }[];
}): void {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print sticker sheet.");
    return;
  }

  const stickersHtml = tables
    .map(
      (t) => `
    <div class="sticker">
      <div class="st-brand">${restaurantName}</div>
      <div class="st-badge">TABLE ${t.tableNumber}</div>
      <div class="st-qr"><img src="${t.qrDataUrl}" alt="Table ${t.tableNumber}" /></div>
      <div class="st-cta">SCAN TO ORDER</div>
    </div>
  `
    )
    .join("");

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>${restaurantName} - Sticker Sheet</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #f8fafc;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8mm;
    }
    .sticker {
      background: #ffffff;
      border: 1.5px dashed #94a3b8;
      border-radius: 12px;
      padding: 10px;
      text-align: center;
      box-sizing: border-box;
      page-break-inside: avoid;
    }
    .st-brand {
      font-size: 10pt;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .st-badge {
      display: inline-block;
      background: #0f172a;
      color: #10b981;
      font-size: 11pt;
      font-weight: 900;
      padding: 2px 10px;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .st-qr img {
      width: 44mm;
      height: 44mm;
      display: block;
      margin: 0 auto;
    }
    .st-cta {
      font-size: 8.5pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }
    @media print {
      body { background: transparent; }
      .sticker { border: 1px dashed #cbd5e1; }
    }
  </style>
</head>
<body>
  <div class="grid">
    ${stickersHtml}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>
  `);
  printWindow.document.close();
}
