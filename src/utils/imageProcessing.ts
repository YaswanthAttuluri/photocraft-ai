// High-performance image processing utilities with optimized algorithms
export class ImageProcessor {
  // Fast, optimized cartoonify effect
  static cartoonify(imageData: ImageData, colorLevels: number = 8, edgeStrength: number = 50): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    
    // Step 1: Fast bilateral filter for smooth regions
    this.fastBilateralFilter(data, width, height, 9, 50, 50);
    
    // Step 2: Optimized color quantization
    this.fastColorQuantization(data, colorLevels);
    
    // Step 3: Enhance saturation for vibrant colors
    this.fastSaturationBoost(data, 1.3);
    
    // Step 4: Add clean edges if requested
    if (edgeStrength > 0) {
      this.addCleanEdges(data, width, height, edgeStrength / 100);
    }
    
    return new ImageData(data, width, height);
  }

  // Fast bilateral filter - optimized for performance
  static fastBilateralFilter(data: Uint8ClampedArray, width: number, height: number, d: number, sigmaColor: number, sigmaSpace: number): void {
    const original = new Uint8ClampedArray(data);
    const radius = Math.floor(d / 2);
    
    // Pre-compute spatial weights for performance
    const spatialWeights: number[] = [];
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const spatialDist = dx * dx + dy * dy;
        spatialWeights.push(Math.exp(-spatialDist / (2 * sigmaSpace * sigmaSpace)));
      }
    }
    
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const centerIdx = (y * width + x) * 4;
        
        let sumR = 0, sumG = 0, sumB = 0, sumWeight = 0;
        let weightIdx = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
            
            // Use pre-computed spatial weight
            const spatialWeight = spatialWeights[weightIdx++];
            
            // Fast color weight calculation
            const colorDist = Math.abs(original[centerIdx] - original[neighborIdx]) +
                            Math.abs(original[centerIdx + 1] - original[neighborIdx + 1]) +
                            Math.abs(original[centerIdx + 2] - original[neighborIdx + 2]);
            const colorWeight = Math.exp(-colorDist / sigmaColor);
            
            const weight = spatialWeight * colorWeight;
            
            sumR += original[neighborIdx] * weight;
            sumG += original[neighborIdx + 1] * weight;
            sumB += original[neighborIdx + 2] * weight;
            sumWeight += weight;
          }
        }
        
        if (sumWeight > 0) {
          data[centerIdx] = sumR / sumWeight;
          data[centerIdx + 1] = sumG / sumWeight;
          data[centerIdx + 2] = sumB / sumWeight;
        }
      }
    }
  }

  // Fast color quantization
  static fastColorQuantization(data: Uint8ClampedArray, levels: number): void {
    const step = 255 / (levels - 1);
    const invStep = 1 / step;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] * invStep) * step;         // R
      data[i + 1] = Math.round(data[i + 1] * invStep) * step; // G
      data[i + 2] = Math.round(data[i + 2] * invStep) * step; // B
    }
  }

  // Fast saturation boost
  static fastSaturationBoost(data: Uint8ClampedArray, factor: number): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Fast grayscale calculation
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Apply saturation
      data[i] = Math.max(0, Math.min(255, gray + factor * (r - gray)));
      data[i + 1] = Math.max(0, Math.min(255, gray + factor * (g - gray)));
      data[i + 2] = Math.max(0, Math.min(255, gray + factor * (b - gray)));
    }
  }

  // Add clean edges
  static addCleanEdges(data: Uint8ClampedArray, width: number, height: number, strength: number): void {
    const original = new Uint8ClampedArray(data);
    const edges = this.fastEdgeDetection(original, width, height);
    
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = Math.floor(i / 4);
      const edgeValue = edges[pixelIndex];
      
      if (edgeValue > 30) {
        const darkenAmount = edgeValue * strength * 0.5;
        data[i] = Math.max(0, data[i] - darkenAmount);
        data[i + 1] = Math.max(0, data[i + 1] - darkenAmount);
        data[i + 2] = Math.max(0, data[i + 2] - darkenAmount);
      }
    }
  }

  // Fast edge detection
  static fastEdgeDetection(data: Uint8ClampedArray, width: number, height: number): Uint8Array {
    const edges = new Uint8Array(width * height);
    
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            
            gx += gray * sobelX[kernelIdx];
            gy += gray * sobelY[kernelIdx];
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        edges[y * width + x] = Math.min(255, magnitude);
      }
    }
    
    return edges;
  }

  // Optimized background removal with chroma key
  static removeBackground(
    imageData: ImageData, 
    keyColor: { r: number; g: number; b: number }, 
    tolerance: number = 0.3,
    replacementColor: { r: number; g: number; b: number } = { r: 255, g: 255, b: 255 }
  ): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const toleranceSquared = tolerance * tolerance * 195075; // 255^2 * 3
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Fast distance calculation
      const dr = r - keyColor.r;
      const dg = g - keyColor.g;
      const db = b - keyColor.b;
      const distance = dr * dr + dg * dg + db * db;
      
      if (distance <= toleranceSquared) {
        data[i] = replacementColor.r;
        data[i + 1] = replacementColor.g;
        data[i + 2] = replacementColor.b;
        // Make transparent if white background
        data[i + 3] = (replacementColor.r === 255 && replacementColor.g === 255 && replacementColor.b === 255) ? 0 : 255;
      }
    }
    
    return new ImageData(data, imageData.width, imageData.height);
  }

  // Smart background removal using edge-aware algorithm
  static smartBackgroundRemoval(imageData: ImageData, tolerance: number = 0.3): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    
    // Sample edge colors for background detection
    const edgeColors: Array<{r: number, g: number, b: number}> = [];
    
    // Sample from edges
    for (let x = 0; x < width; x += 10) {
      const topIdx = x * 4;
      const bottomIdx = ((height - 1) * width + x) * 4;
      edgeColors.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });
      edgeColors.push({ r: data[bottomIdx], g: data[bottomIdx + 1], b: data[bottomIdx + 2] });
    }
    
    for (let y = 0; y < height; y += 10) {
      const leftIdx = (y * width) * 4;
      const rightIdx = (y * width + width - 1) * 4;
      edgeColors.push({ r: data[leftIdx], g: data[leftIdx + 1], b: data[leftIdx + 2] });
      edgeColors.push({ r: data[rightIdx], g: data[rightIdx + 1], b: data[rightIdx + 2] });
    }
    
    // Find most common edge color (likely background)
    const colorCounts = new Map<string, number>();
    edgeColors.forEach(color => {
      const key = `${Math.floor(color.r/10)},${Math.floor(color.g/10)},${Math.floor(color.b/10)}`;
      colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
    });
    
    let maxCount = 0;
    let bgColor = { r: 255, g: 255, b: 255 };
    colorCounts.forEach((count, key) => {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = key.split(',').map(n => parseInt(n) * 10);
        bgColor = { r, g, b };
      }
    });
    
    // Remove background
    return this.removeBackground(imageData, bgColor, tolerance, { r: 255, g: 255, b: 255 });
  }

  // Fast image enhancement
  static enhance(
    imageData: ImageData,
    brightness: number = 0,
    contrast: number = 0,
    saturation: number = 0,
    sharpness: number = 0
  ): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    
    // Pre-calculate contrast factor
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const satFactor = 1 + saturation / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply brightness
      r += brightness;
      g += brightness;
      b += brightness;
      
      // Apply contrast
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
      
      // Apply saturation
      if (saturation !== 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + satFactor * (r - gray);
        g = gray + satFactor * (g - gray);
        b = gray + satFactor * (b - gray);
      }
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    // Apply sharpening if needed
    if (sharpness > 0) {
      return this.fastSharpen(new ImageData(data, imageData.width, imageData.height), sharpness);
    }
    
    return new ImageData(data, imageData.width, imageData.height);
  }

  // Fast sharpening filter
  static fastSharpen(imageData: ImageData, strength: number): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    const original = new Uint8ClampedArray(imageData.data);
    
    const factor = strength / 100;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          const idx = (y * width + x) * 4 + c;
          const center = original[idx];
          
          // Simple unsharp mask
          const blur = (
            original[((y-1) * width + x) * 4 + c] +
            original[((y+1) * width + x) * 4 + c] +
            original[(y * width + x-1) * 4 + c] +
            original[(y * width + x+1) * 4 + c]
          ) / 4;
          
          const sharpened = center + factor * (center - blur);
          data[idx] = Math.max(0, Math.min(255, sharpened));
        }
      }
    }
    
    return new ImageData(data, width, height);
  }

  // Add text to image (for memes)
  static addText(
    canvas: HTMLCanvasElement,
    topText: string,
    bottomText: string,
    fontSize: number = 40,
    textColor: string = '#ffffff',
    outlineColor: string = '#000000',
    useOutline: boolean = true,
    fontFamily: string = 'Impact'
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const centerX = canvas.width / 2;
    const margin = 20;
    
    // Function to draw text with outline
    const drawText = (text: string, x: number, y: number) => {
      if (useOutline) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = Math.max(2, fontSize / 15);
        ctx.strokeText(text, x, y);
      }
      ctx.fillStyle = textColor;
      ctx.fillText(text, x, y);
    };
    
    // Draw top text
    if (topText) {
      drawText(topText, centerX, margin);
    }
    
    // Draw bottom text
    if (bottomText) {
      const bottomY = canvas.height - fontSize - margin;
      drawText(bottomText, centerX, bottomY);
    }
  }

  // Crop image for passport photos
  static cropToPassport(
    imageData: ImageData,
    cropRect: { x: number; y: number; width: number; height: number },
    outputSize: { width: number; height: number }
  ): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Create temporary canvas with original image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Could not get temp canvas context');
    
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCtx.putImageData(imageData, 0, 0);
    
    // Set output canvas size
    canvas.width = outputSize.width;
    canvas.height = outputSize.height;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw cropped and scaled image
    ctx.drawImage(
      tempCanvas,
      cropRect.x * imageData.width,
      cropRect.y * imageData.height,
      cropRect.width * imageData.width,
      cropRect.height * imageData.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Color picker helper
  static getColorAtPoint(imageData: ImageData, x: number, y: number): { r: number; g: number; b: number } {
    const index = (y * imageData.width + x) * 4;
    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2]
    };
  }

  // Convert hex color to RGB
  static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  // Photo restoration (basic noise reduction and sharpening)
  static restore(imageData: ImageData): ImageData {
    // Apply noise reduction followed by sharpening
    const denoised = this.fastDenoise(imageData);
    return this.fastSharpen(denoised, 25);
  }

  // Fast denoising filter
  static fastDenoise(imageData: ImageData): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    const original = new Uint8ClampedArray(imageData.data);
    
    // Fast 3x3 Gaussian blur
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          const sum = 
            original[((y-1) * width + x-1) * 4 + c] * 1 +
            original[((y-1) * width + x) * 4 + c] * 2 +
            original[((y-1) * width + x+1) * 4 + c] * 1 +
            original[(y * width + x-1) * 4 + c] * 2 +
            original[(y * width + x) * 4 + c] * 4 +
            original[(y * width + x+1) * 4 + c] * 2 +
            original[((y+1) * width + x-1) * 4 + c] * 1 +
            original[((y+1) * width + x) * 4 + c] * 2 +
            original[((y+1) * width + x+1) * 4 + c] * 1;
          
          data[(y * width + x) * 4 + c] = sum / 16;
        }
      }
    }
    
    return new ImageData(data, width, height);
  }
}

// Passport photo presets
export const PASSPORT_PRESETS = [
  { name: 'US Passport (2×2 in)', width: 600, height: 600, ratio: 1, description: '51×51 mm, square format' },
  { name: 'UK Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'Standard European format' },
  { name: 'Canada Passport (50×70 mm)', width: 590, height: 827, ratio: 0.71, description: 'Larger Canadian format' },
  { name: 'Australia Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'Same as UK standard' },
  { name: 'India Passport (51×51 mm)', width: 600, height: 600, ratio: 1, description: 'Square Indian format' },
  { name: 'China Passport (33×48 mm)', width: 390, height: 567, ratio: 0.69, description: 'Chinese official size' },
  { name: 'Japan Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'Japanese standard' },
  { name: 'Germany Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'German biometric format' },
  { name: 'France Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'French official size' },
  { name: 'Brazil Passport (30×40 mm)', width: 354, height: 472, ratio: 0.75, description: 'Brazilian format' },
  { name: 'Russia Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'Russian Federation' },
  { name: 'South Korea (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'Korean standard' },
  { name: 'Mexico Passport (39×31 mm)', width: 460, height: 366, ratio: 1.26, description: 'Mexican landscape format' },
  { name: 'UAE Passport (43×55 mm)', width: 508, height: 650, ratio: 0.78, description: 'UAE official size' },
  { name: 'Singapore Passport (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'Singapore standard' },
  { name: 'US Visa (50×50 mm)', width: 590, height: 590, ratio: 1, description: 'Square US visa format' },
  { name: 'Schengen Visa (35×45 mm)', width: 413, height: 531, ratio: 0.78, description: 'European visa standard' },
  { name: 'LinkedIn Profile (1:1)', width: 400, height: 400, ratio: 1, description: 'Social media square' },
  { name: 'Custom Size', width: 500, height: 500, ratio: 1, description: 'Define your own dimensions' }
];

// Export quality presets
export const EXPORT_PRESETS = {
  png: { quality: 1, mimeType: 'image/png' },
  jpg: { quality: 0.9, mimeType: 'image/jpeg' },
  webp: { quality: 0.85, mimeType: 'image/webp' }
};