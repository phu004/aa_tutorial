function isPointInside(x, y, triangle) {
    const denominator = (triangle.vertex2.y - triangle.vertex3.y) * (triangle.vertex1.x - triangle.vertex3.x) + (triangle.vertex3.x - triangle.vertex2.x) * (triangle.vertex1.y - triangle.vertex3.y);
    const a = ((triangle.vertex2.y - triangle.vertex3.y) * (x - triangle.vertex3.x) + (triangle.vertex3.x - triangle.vertex2.x) * (y - triangle.vertex3.y)) / denominator;
    const b = ((triangle.vertex3.y - triangle.vertex1.y) * (x - triangle.vertex3.x) + (triangle.vertex1.x - triangle.vertex3.x) * (y - triangle.vertex3.y)) / denominator;
    const c = 1 - a - b;

    return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
}

function doesRectangleIntersect(x, y, width, height, triangle) {
    const rectVertices = [
        { x: x, y: y },
        { x: x + width, y: y },
        { x: x, y: y + height },
        { x: x + width, y: y + height }
    ];

    if(isPointInsideRectangle(triangle.vertex1, rectVertices) ||  
       isPointInsideRectangle(triangle.vertex2, rectVertices) || 
       isPointInsideRectangle(triangle.vertex3, rectVertices)){
        return true;
    }

    const isPointInsideTriangle = (p) => {
        const b1 = ((triangle.vertex2.y - triangle.vertex3.y) * (p.x - triangle.vertex3.x) + (triangle.vertex3.x - triangle.vertex2.x) * (p.y - triangle.vertex3.y)) <= 0;
        const b2 = ((triangle.vertex3.y - triangle.vertex1.y) * (p.x - triangle.vertex3.x) + (triangle.vertex1.x - triangle.vertex3.x) * (p.y - triangle.vertex3.y)) <= 0;
        const b3 = ((triangle.vertex1.y - triangle.vertex2.y) * (p.x - triangle.vertex1.x) + (triangle.vertex2.x - triangle.vertex1.x) * (p.y - triangle.vertex1.y)) <= 0;
        return ((b1 === b2) && (b2 === b3));
    };

    for (const vertex of rectVertices) {
        if (isPointInsideTriangle(vertex)) {
            return true;
        }
    }

    return false;
}

function isPointInsideRectangle(point, rectVertices) {
    const [topLeft, topRight, bottomLeft, bottomRight] = rectVertices;
    
    return (
        point.x >= topLeft.x && point.x <= topRight.x &&
        point.y >= topLeft.y && point.y <= bottomLeft.y
    );
}

function hexToRgb(hex) {
    // Remove the '#' if present
    hex = hex.replace('#', '');

    // Parse the hex value into RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

function rgbToHex(rgb) {
    // Convert RGB components to hex values
    const rHex = rgb.r.toString(16).padStart(2, '0');
    const gHex = rgb.g.toString(16).padStart(2, '0');
    const bHex = rgb.b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

function averageColors(colors) {
    const numColors = colors.length;
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    // Sum up the RGB components of all colors
    for (const color of colors) {
        const rgb = hexToRgb(color);
        totalR += rgb.r;
        totalG += rgb.g;
        totalB += rgb.b;
    }

    // Calculate the average RGB components
    const avgR = Math.round(totalR / numColors);
    const avgG = Math.round(totalG / numColors);
    const avgB = Math.round(totalB / numColors);

    // Combine the averaged components into a new color
    const averagedColor = rgbToHex({ r: avgR, g: avgG, b: avgB });

    return averagedColor;
}

function drawOutline(triangle){
    if(triangle.outlineAlpha < 0.35)
    triangle.outlineAlpha+=0.05;

    ctx.save();
    ctx.lineWidth = 3;
    ctx.globalAlpha = triangle.outlineAlpha;
    ctx.beginPath();
    ctx.moveTo(triangle.vertex1.x, triangle.vertex1.y);
    ctx.lineTo(triangle.vertex2.x, triangle.vertex2.y);
    ctx.lineTo(triangle.vertex3.x, triangle.vertex3.y);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.restore();
}



function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpColor(color1, color2, t) {
    const r1 = parseInt(color1.substr(0, 2), 16);
    const g1 = parseInt(color1.substr(2, 2), 16);
    const b1 = parseInt(color1.substr(4, 2), 16);

    const r2 = parseInt(color2.substr(0, 2), 16);
    const g2 = parseInt(color2.substr(2, 2), 16);
    const b2 = parseInt(color2.substr(4, 2), 16);

    const lerpedR = Math.round(lerp(r1, r2, t));
    const lerpedG = Math.round(lerp(g1, g2, t));
    const lerpedB = Math.round(lerp(b1, b2, t));

    return `${lerpedR.toString(16).padStart(2, '0')}${lerpedG.toString(16).padStart(2, '0')}${lerpedB.toString(16).padStart(2, '0')}`;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function rotate(angleDegrees, triangle) {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const cosA = Math.cos(angleRadians);
    const sinA = Math.sin(angleRadians);

    const rotatePoint = (point, centerX, centerY) => {
        const translatedX = point.x - centerX;
        const translatedY = point.y - centerY;

        const rotatedX = translatedX * cosA - translatedY * sinA;
        const rotatedY = translatedX * sinA + translatedY * cosA;

        point.x = rotatedX + centerX;
        point.y = rotatedY + centerY;
    };

    const { vertex1, vertex2, vertex3, centerX, centerY } = triangle;

    rotatePoint(vertex1, centerX, centerY);
    rotatePoint(vertex2, centerX, centerY);
    rotatePoint(vertex3, centerX, centerY);
}

function rotatePointDegrees(pixel, triangle, angleDegrees) {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const cosAngle = Math.cos(angleRadians);
    const sinAngle = Math.sin(angleRadians);

    // Translate the point back to the origin
    const translatedX = pixel.borderX - triangle.centerX;
    const translatedY = pixel.borderY - triangle.centerY;

    // Rotate the point
    const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
    const rotatedY = translatedX * sinAngle + translatedY * cosAngle;

    // Translate the point back to its original position
    pixel.borderX = rotatedX + triangle.centerX;
    pixel.borderY = rotatedY + triangle.centerY;
}

function rotatePointDegrees2(x, y, triangle, angleDegrees) {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const cosAngle = Math.cos(angleRadians);
    const sinAngle = Math.sin(angleRadians);

    // Translate the point back to the origin
    const translatedX = x - triangle.centerX;
    const translatedY = y - triangle.centerY;

    // Rotate the point
    const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
    const rotatedY = translatedX * sinAngle + translatedY * cosAngle;

    // Translate the point back to its original position
    const finalX = rotatedX + triangle.centerX;
    const finalY = rotatedY + triangle.centerY;

    return { x: finalX, y: finalY };
}

function getClampedColor(currentColorHex, nearColorsHex, historyColorHex) {
    const currentColor = hexToRgb(currentColorHex);
    const nearColors = nearColorsHex.map(hexToRgb);
    const historyColor = hexToRgb(historyColorHex);

    const boxMin = nearColors.reduce((minColor, nearColor) => ({
        r: Math.min(minColor.r, nearColor.r),
        g: Math.min(minColor.g, nearColor.g),
        b: Math.min(minColor.b, nearColor.b)
    }), currentColor);

    const boxMax = nearColors.reduce((maxColor, nearColor) => ({
        r: Math.max(maxColor.r, nearColor.r),
        g: Math.max(maxColor.g, nearColor.g),
        b: Math.max(maxColor.b, nearColor.b)
    }), currentColor);

    const clampedColor = {
        r: Math.max(boxMin.r, Math.min(boxMax.r, historyColor.r)),
        g: Math.max(boxMin.g, Math.min(boxMax.g, historyColor.g)),
        b: Math.max(boxMin.b, Math.min(boxMax.b, historyColor.b))
    };

    return rgbToHex(clampedColor);
}

function colorDistance(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
  
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
  
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }

  function colorDifference(color1, color2) {
    const rDiff = Math.abs(color1.r - color2.r);
    const gDiff = Math.abs(color1.g - color2.g);
    const bDiff = Math.abs(color1.b - color2.b);
    return (rDiff + gDiff + bDiff) / 3; // Average color difference
}

