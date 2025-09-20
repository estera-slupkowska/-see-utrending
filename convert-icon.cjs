const fs = require('fs');
const path = require('path');

// Create HTML file that will render SVG and allow manual screenshot
const svgContent = fs.readFileSync('./public/icon.svg', 'utf8');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 50px;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .icon-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
            align-items: center;
        }
        .icon {
            border: 1px solid #ccc;
            background: white;
        }
        .size-label {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="icon-container">
        <div>
            <div class="size-label">512x512 (High Resolution)</div>
            <div class="icon" style="width: 512px; height: 512px;">
                ${svgContent}
            </div>
        </div>

        <div>
            <div class="size-label">256x256 (Standard)</div>
            <div class="icon" style="width: 256px; height: 256px;">
                ${svgContent}
            </div>
        </div>

        <div>
            <div class="size-label">162x162 (TikTok Branded Effect)</div>
            <div class="icon" style="width: 162px; height: 162px;">
                ${svgContent}
            </div>
        </div>

        <div>
            <div class="size-label">144x144 (TikTok Safe Area)</div>
            <div class="icon" style="width: 144px; height: 144px;">
                ${svgContent}
            </div>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('./icon-preview.html', htmlContent);
console.log('Icon preview created! Open icon-preview.html in your browser and take screenshots of each size.');
console.log('Or right-click each icon and "Save image as" to download as PNG.');