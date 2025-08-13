import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Download, 
  Save, 
  RotateCcw, 
  Palette, 
  Scissors, 
  Camera, 
  MessageSquare, 
  Sparkles, 
  Cpu,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Settings,
  Eye,
  EyeOff,
  AlertCircle,
  Crown
} from 'lucide-react';
import { ImageProcessor, PASSPORT_PRESETS } from '../utils/imageProcessing';

interface ProcessingStudioProps {
  user: any;
  onSaveProject: () => void;
  onDownloadImage: () => void;
}

type ProcessingMode = 'cartoonify' | 'background' | 'passport' | 'meme' | 'enhance' | 'restore';
type ExportFormat = 'png' | 'jpg' | 'webp';

export function ProcessingStudio({ user, onSaveProject, onDownloadImage }: ProcessingStudioProps) {
  // Core state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [processedImageData, setProcessedImageData] = useState<ImageData | null>(null);
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('cartoonify');
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(true);

  // Processing settings
  const [cartoonifySettings, setCartoonifySettings] = useState({
    posterizeLevels: 8,
    edgeStrength: 50
  });

  const [backgroundSettings, setBackgroundSettings] = useState({
    tolerance: 30,
    keyColor: '#00ff00',
    replacementColor: '#ffffff',
    useColorPicker: false
  });

  const [passportSettings, setPassportSettings] = useState({
    selectedPreset: 0,
    cropRect: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
  });

  const [memeSettings, setMemeSettings] = useState({
    topText: '',
    bottomText: '',
    fontSize: 40,
    textColor: '#ffffff',
    outlineColor: '#000000',
    useOutline: true,
    fontFamily: 'Impact'
  });

  const [enhanceSettings, setEnhanceSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0
  });

  const [exportSettings, setExportSettings] = useState({
    format: 'png' as ExportFormat,
    quality: 90
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Processing modes configuration
  const processingModes = [
    {
      id: 'cartoonify' as ProcessingMode,
      name: 'Cartoon Art Studio',
      icon: Palette,
      description: 'Transform your photos into stunning cartoon artwork! Adjust the artistic style and edge definition to create your perfect cartoon masterpiece.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'background' as ProcessingMode,
      name: 'Magic Background Eraser',
      icon: Scissors,
      description: 'Remove or replace backgrounds with AI precision! Perfect for product photos, portraits, and creative compositions.',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'passport' as ProcessingMode,
      name: 'ID Photo Studio',
      icon: Camera,
      description: 'Create professional passport and ID photos that meet official requirements for any country. Perfect for visa applications!',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'meme' as ProcessingMode,
      name: 'Viral Meme Maker',
      icon: MessageSquare,
      description: 'Create internet-breaking memes with custom text and styling. From classic formats to trending templates!',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'enhance' as ProcessingMode,
      name: 'Photo Enhancer Pro',
      icon: Sparkles,
      description: 'Transform ordinary photos into extraordinary masterpieces with professional-grade enhancement tools.',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'restore' as ProcessingMode,
      name: 'Time Machine Restorer',
      icon: Cpu,
      description: 'Bring precious memories back to life! Restore old, damaged, or faded photos with advanced AI technology.',
      gradient: 'from-amber-500 to-red-600'
    }
  ];

  // Load image and extract ImageData
  const loadImageData = useCallback((imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setOriginalImageData(imageData);
      setProcessedImageData(imageData);
      
      // Update display canvas
      if (canvasRef.current) {
        const displayCtx = canvasRef.current.getContext('2d');
        if (displayCtx) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          displayCtx.putImageData(imageData, 0, 0);
        }
      }
    };
    img.src = imageSrc;
  }, []);

  // Process image based on current mode and settings
  const processImage = useCallback(async () => {
    if (!originalImageData) return;

    setIsProcessing(true);
    
    try {
      let processed: ImageData;
      
      switch (currentMode) {
        case 'cartoonify':
          processed = ImageProcessor.cartoonify(
            originalImageData,
            cartoonifySettings.posterizeLevels,
            cartoonifySettings.edgeStrength
          );
          break;
          
        case 'background':
          const keyColor = ImageProcessor.hexToRgb(backgroundSettings.keyColor);
          const replacementColor = ImageProcessor.hexToRgb(backgroundSettings.replacementColor);
          processed = ImageProcessor.removeBackground(
            originalImageData,
            keyColor,
            backgroundSettings.tolerance / 100,
            replacementColor
          );
          break;
          
        case 'passport':
          const preset = PASSPORT_PRESETS[passportSettings.selectedPreset];
          processed = ImageProcessor.cropToPassport(
            originalImageData,
            passportSettings.cropRect,
            { width: preset.width, height: preset.height }
          );
          break;
          
        case 'enhance':
          processed = ImageProcessor.enhance(
            originalImageData,
            enhanceSettings.brightness,
            enhanceSettings.contrast,
            enhanceSettings.saturation,
            enhanceSettings.sharpness
          );
          break;
          
        case 'restore':
          processed = ImageProcessor.restore(originalImageData);
          break;
          
        case 'meme':
          // For memes, we need to work with canvas directly
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.putImageData(originalImageData, 0, 0);
              ImageProcessor.addText(
                canvasRef.current,
                memeSettings.topText,
                memeSettings.bottomText,
                memeSettings.fontSize,
                memeSettings.textColor,
                memeSettings.outlineColor,
                memeSettings.useOutline,
                memeSettings.fontFamily
              );
              processed = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            } else {
              processed = originalImageData;
            }
          } else {
            processed = originalImageData;
          }
          break;
          
        default:
          processed = originalImageData;
      }
      
      setProcessedImageData(processed);
      
      // Update display canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.putImageData(processed, 0, 0);
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [originalImageData, currentMode, cartoonifySettings, backgroundSettings, passportSettings, memeSettings, enhanceSettings]);

  // Auto-process when settings change
  useEffect(() => {
    if (originalImageData) {
      // Use requestAnimationFrame for smooth performance
      const frameId = requestAnimationFrame(() => {
        processImage();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [processImage]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setSelectedImage(imageSrc);
        loadImageData(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setSelectedImage(imageSrc);
        loadImageData(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Download processed image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    // Check if user has enough credits (unless admin)
    if (!user?.is_admin && user?.credits_remaining < 4) {
      alert('Insufficient credits! You need 4 credits to download. Please upgrade your plan.');
      return;
    }
    
    const canvas = canvasRef.current;
    const format = exportSettings.format;
    const quality = exportSettings.quality / 100;
    
    let mimeType: string;
    switch (format) {
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      default:
        mimeType = 'image/png';
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `photocraft-${currentMode}-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Trigger credit deduction
        onDownloadImage();
      }
    }, mimeType, quality);
  };

  // Reset to original
  const handleReset = () => {
    if (originalImageData && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(originalImageData, 0, 0);
        setProcessedImageData(originalImageData);
      }
    }
  };

  // Color picker for background removal
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentMode === 'background' && backgroundSettings.useColorPicker && originalImageData) {
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
      const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
      
      const color = ImageProcessor.getColorAtPoint(originalImageData, x, y);
      const hexColor = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
      
      setBackgroundSettings(prev => ({
        ...prev,
        keyColor: hexColor,
        useColorPicker: false
      }));
    }
  };

  const currentModeConfig = processingModes.find(mode => mode.id === currentMode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Processing Studio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transform your images with professional AI-powered tools
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Mode Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Processing Modes
              </h2>
              <div className="space-y-3">
                {processingModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setCurrentMode(mode.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      currentMode === mode.id
                        ? `bg-gradient-to-r ${mode.gradient} text-white shadow-lg`
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <mode.icon className="w-5 h-5" />
                      <span className="font-medium">{mode.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              {/* Canvas Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                  
                  {selectedImage && (
                    <>
                      <button
                        onClick={handleReset}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                      
                      <button
                        onClick={onSaveProject}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </>
                  )}
                </div>

                {selectedImage && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(25, zoom - 25))}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(200, zoom + 25))}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Canvas */}
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center">
                {selectedImage ? (
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className={`max-w-full max-h-[600px] rounded-lg shadow-lg ${
                        currentMode === 'background' && backgroundSettings.useColorPicker 
                          ? 'cursor-crosshair' 
                          : 'cursor-default'
                      }`}
                      style={{ transform: `scale(${zoom / 100})` }}
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Processing...</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mb-4" />
                    <p className="text-lg font-medium mb-2">Drop your image here</p>
                    <p className="text-sm">or click to browse files</p>
                    <p className="text-xs mt-2">Supports JPG, PNG, WebP</p>
                  </div>
                )}
              </div>

              {/* Download Section */}
              {selectedImage && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <select
                        value={exportSettings.format}
                        onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value as ExportFormat }))}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="webp">WebP</option>
                      </select>
                      
                      {exportSettings.format !== 'png' && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quality:</span>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={exportSettings.quality}
                            onChange={(e) => setExportSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                            className="w-20"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                            {exportSettings.quality}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {!user?.is_admin && user?.credits_remaining < 4 && (
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Need 4 credits</span>
                        </div>
                      )}
                      
                      <button
                        onClick={handleDownload}
                        disabled={!user?.is_admin && user?.credits_remaining < 4}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                          user?.is_admin
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                            : !user?.is_admin && user?.credits_remaining < 4
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          {user?.is_admin ? (
                            <>
                              <Crown className="w-4 h-4 inline mr-1" />
                              Download (Free)
                            </>
                          ) : (
                            'Download (4 Credits)'
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings
                </h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {currentModeConfig && (
                <div className={`p-4 rounded-xl mb-6 bg-gradient-to-r ${currentModeConfig.gradient}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <currentModeConfig.icon className="w-6 h-6 text-white" />
                    <h3 className="font-semibold text-white">{currentModeConfig.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {currentModeConfig.description}
                  </p>
                </div>
              )}

              {/* Mode-specific settings */}
              <div className="space-y-6">
                {currentMode === 'cartoonify' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎨 Color Levels: {cartoonifySettings.posterizeLevels}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Lower = Fewer colors (more cartoon-like), Higher = More colors
                      </p>
                      <input
                        type="range"
                        min="3"
                        max="12"
                        value={cartoonifySettings.posterizeLevels}
                        onChange={(e) => setCartoonifySettings(prev => ({ ...prev, posterizeLevels: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ✏️ Edge Lines: {cartoonifySettings.edgeStrength}%
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        0 = No outlines, 100 = Strong black outlines
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cartoonifySettings.edgeStrength}
                        onChange={(e) => setCartoonifySettings(prev => ({ ...prev, edgeStrength: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </>
                )}

                {currentMode === 'background' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        🎯 Background Removal Method
                      </label>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            if (originalImageData) {
                              const processed = ImageProcessor.smartBackgroundRemoval(originalImageData, backgroundSettings.tolerance / 100);
                              setProcessedImageData(processed);
                              if (canvasRef.current) {
                                const ctx = canvasRef.current.getContext('2d');
                                if (ctx) {
                                  ctx.putImageData(processed, 0, 0);
                                }
                              }
                            }
                          }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                        >
                          🤖 Smart Auto-Remove Background
                        </button>
                        
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                          or manually select color
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={backgroundSettings.keyColor}
                            onChange={(e) => setBackgroundSettings(prev => ({ ...prev, keyColor: e.target.value }))}
                            className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <button
                            onClick={() => setBackgroundSettings(prev => ({ ...prev, useColorPicker: !prev.useColorPicker }))}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              backgroundSettings.useColorPicker
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {backgroundSettings.useColorPicker ? '✓ Click Image' : 'Pick from Image'}
                          </button>
                        </div>
                        
                        {backgroundSettings.useColorPicker && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              👆 Click on the background area in your image to select the color to remove
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎚️ Tolerance: {backgroundSettings.tolerance}%
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Lower = Remove exact colors only, Higher = Remove similar colors too
                      </p>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={backgroundSettings.tolerance}
                        onChange={(e) => setBackgroundSettings(prev => ({ ...prev, tolerance: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎨 New Background Color
                      </label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          { color: '#ffffff', name: 'White' },
                          { color: '#000000', name: 'Black' },
                          { color: '#ff0000', name: 'Red' },
                          { color: '#00ff00', name: 'Green' }
                        ].map((preset) => (
                          <button
                            key={preset.color}
                            onClick={() => setBackgroundSettings(prev => ({ ...prev, replacementColor: preset.color }))}
                            className={`w-full h-10 rounded-lg border-2 transition-all ${
                              backgroundSettings.replacementColor === preset.color
                                ? 'border-blue-500 scale-110'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={backgroundSettings.replacementColor}
                        onChange={(e) => setBackgroundSettings(prev => ({ ...prev, replacementColor: e.target.value }))}
                        className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </>
                )}

                {currentMode === 'passport' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🌍 Country/Format
                      </label>
                      <select
                        value={passportSettings.selectedPreset}
                        onChange={(e) => setPassportSettings(prev => ({ ...prev, selectedPreset: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      >
                        {PASSPORT_PRESETS.map((preset, index) => (
                          <option key={index} value={index}>
                            {preset.name}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          📏 {PASSPORT_PRESETS[passportSettings.selectedPreset].description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Size: {PASSPORT_PRESETS[passportSettings.selectedPreset].width} × {PASSPORT_PRESETS[passportSettings.selectedPreset].height} pixels
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {currentMode === 'meme' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📝 Top Text
                      </label>
                      <input
                        type="text"
                        value={memeSettings.topText}
                        onChange={(e) => setMemeSettings(prev => ({ ...prev, topText: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        placeholder="WHEN YOU..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📝 Bottom Text
                      </label>
                      <input
                        type="text"
                        value={memeSettings.bottomText}
                        onChange={(e) => setMemeSettings(prev => ({ ...prev, bottomText: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        placeholder="...BOTTOM TEXT"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📏 Font Size: {memeSettings.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={memeSettings.fontSize}
                        onChange={(e) => setMemeSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          🎨 Text Color
                        </label>
                        <input
                          type="color"
                          value={memeSettings.textColor}
                          onChange={(e) => setMemeSettings(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          🖤 Outline Color
                        </label>
                        <input
                          type="color"
                          value={memeSettings.outlineColor}
                          onChange={(e) => setMemeSettings(prev => ({ ...prev, outlineColor: e.target.value }))}
                          className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ✏️ Text Outline
                      </span>
                      <button
                        onClick={() => setMemeSettings(prev => ({ ...prev, useOutline: !prev.useOutline }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          memeSettings.useOutline ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            memeSettings.useOutline ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </>
                )}

                {currentMode === 'enhance' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ☀️ Brightness: {enhanceSettings.brightness > 0 ? '+' : ''}{enhanceSettings.brightness}
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={enhanceSettings.brightness}
                        onChange={(e) => setEnhanceSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🌓 Contrast: {enhanceSettings.contrast > 0 ? '+' : ''}{enhanceSettings.contrast}
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={enhanceSettings.contrast}
                        onChange={(e) => setEnhanceSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎨 Saturation: {enhanceSettings.saturation > 0 ? '+' : ''}{enhanceSettings.saturation}
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={enhanceSettings.saturation}
                        onChange={(e) => setEnhanceSettings(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🔍 Sharpness: {enhanceSettings.sharpness}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={enhanceSettings.sharpness}
                        onChange={(e) => setEnhanceSettings(prev => ({ ...prev, sharpness: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </>
                )}

                {currentMode === 'restore' && (
                  <div className="text-center py-8">
                    <Cpu className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      🔮 AI Photo Restoration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Our AI will automatically restore your photo by reducing noise, enhancing details, and improving overall quality. Perfect for old or damaged photos!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}