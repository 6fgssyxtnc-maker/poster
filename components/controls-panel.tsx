"use client"

import { useRef } from "react"
import { Upload, Download, ZoomIn, ZoomOut, RotateCcw, Move, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface PhotoState {
  x: number
  y: number
  scale: number
  src: string
  width: number
  height: number
}

interface ControlsPanelProps {
  photo: PhotoState | null
  onPhotoUpload: (file: File) => void
  onPhotoUpdate: (photo: PhotoState) => void
  onDownload: () => void
  onReset: () => void
}

export function ControlsPanel({
  photo,
  onPhotoUpload,
  onPhotoUpdate,
  onDownload,
  onReset,
}: ControlsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onPhotoUpload(file)
      // Reset the input so re-uploading the same file works
      e.target.value = ""
    }
  }

  const handleScaleChange = (value: number[]) => {
    if (!photo) return
    onPhotoUpdate({ ...photo, scale: value[0] })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Section */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Tavs fotoattēls</h3>
            <p className="text-sm text-muted-foreground">
              {photo ? "Fotoattēls ielādēts" : "Augšupielādē fotoattēlu, lai sāktu"}
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload your photo"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          {photo ? "Mainīt foto" : "Augšupielādē foto"}
        </Button>
      </div>

      {/* Controls Section */}
      {photo && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Move className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Adjust Photo</h3>
              <p className="text-sm text-muted-foreground">Drag to move, scroll to zoom</p>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Size</label>
              <span className="text-sm text-muted-foreground font-mono">
                {Math.round(photo.scale * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-8 w-8"
                onClick={() => onPhotoUpdate({ ...photo, scale: Math.max(0.1, photo.scale - 0.1) })}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Slider
                value={[photo.scale]}
                onValueChange={handleScaleChange}
                min={0.1}
                max={3}
                step={0.01}
                className="flex-1"
                aria-label="Photo scale"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-8 w-8"
                onClick={() => onPhotoUpdate({ ...photo, scale: Math.min(3, photo.scale + 0.1) })}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            className="w-full mt-4 text-muted-foreground hover:text-card-foreground"
            onClick={onReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Position
          </Button>
        </div>
      )}

      {/* Download Section */}
      <Button
        onClick={onDownload}
        disabled={!photo}
        size="lg"
        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-40"
      >
        <Download className="w-4 h-4 mr-2" />
        Lejuplādē plakātu
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        {"Rezult\u0101ts: 1080 \u00D7 1080 px \u2014 optimiz\u0113ts Facebook / Instagram ierakstiem"}
      </p>
    </div>
  )
}
