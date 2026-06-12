"use client"

import { useState, useCallback, useRef } from "react"
import { PosterCanvas } from "@/components/poster-canvas"
import { ControlsPanel } from "@/components/controls-panel"

interface PhotoState {
  x: number
  y: number
  scale: number
  src: string
  width: number
  height: number
}

const CANVAS_SIZE = 1080

export function PosterEditor() {
  const [photo, setPhoto] = useState<PhotoState | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  // Default will be overwritten by transparent pixel detection from canvas
  const circleInfoRef = useRef({ cx: CANVAS_SIZE * 0.5, cy: CANVAS_SIZE * 0.5, r: CANVAS_SIZE * 0.4 })

  const handleCircleDetected = useCallback((cx: number, cy: number, r: number) => {
    circleInfoRef.current = { cx, cy, r }
  }, [])

  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const { cx, cy, r } = circleInfoRef.current
        const diameter = r * 2
        // Scale photo to fill the circle area
        const ratio = Math.max(diameter / img.width, diameter / img.height)
        const width = img.width * ratio
        const height = img.height * ratio
        setPhoto({
          x: cx - width / 2,
          y: cy - height / 2,
          scale: 1,
          src,
          width,
          height,
        })
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [])

  const handlePhotoUpdate = useCallback((updatedPhoto: PhotoState) => {
    setPhoto(updatedPhoto)
  }, [])

  const handleReset = useCallback(() => {
    if (!photo) return
    const { cx, cy } = circleInfoRef.current
    setPhoto({
      ...photo,
      x: cx - photo.width / 2,
      y: cy - photo.height / 2,
      scale: 1,
    })
  }, [photo])

  const handleDownload = useCallback(() => {
    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = CANVAS_SIZE
    exportCanvas.height = CANVAS_SIZE
    const ctx = exportCanvas.getContext("2d")
    if (!ctx) return

    const bgImg = new Image()
    bgImg.crossOrigin = "anonymous"
    bgImg.onload = () => {
      if (photo) {
        const photoImg = new Image()
        photoImg.crossOrigin = "anonymous"
        photoImg.onload = () => {
          const w = photo.width * photo.scale
          const h = photo.height * photo.scale
          ctx.drawImage(photoImg, photo.x, photo.y, w, h)
          ctx.drawImage(bgImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

          exportCanvas.toBlob((blob) => {
            if (!blob) return
            const url = URL.createObjectURL(blob)
            // Try standard download first
            const link = document.createElement("a")
            link.href = url
            link.download = "forums-lidere-poster.png"
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            // Cleanup after a short delay
            setTimeout(() => URL.revokeObjectURL(url), 100)
          }, "image/png")
        }
        photoImg.src = photo.src
      } else {
        ctx.drawImage(bgImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
        exportCanvas.toBlob((blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = "forums-lidere-poster.png"
          link.style.display = "none"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setTimeout(() => URL.revokeObjectURL(url), 100)
        }, "image/png")
      }
    }
    bgImg.src = "/images/poster-bg.png"
  }, [photo])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-card-foreground tracking-tight">
              Forums LĪDERE
            </h1>
            <p className="text-sm text-muted-foreground">
              Izveido savu individuālo pasākuma plakātu
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            1080 x 1080px
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Canvas Area */}
          <div ref={canvasContainerRef} className="w-full max-w-[640px] mx-auto lg:mx-0">
            <PosterCanvas
              photo={photo}
              onPhotoUpdate={handlePhotoUpdate}
              canvasSize={CANVAS_SIZE}
              onCircleDetected={handleCircleDetected}
            />
            {/* Mobile helper text */}
            {photo && (
              <p className="text-xs text-muted-foreground text-center mt-3 lg:hidden">
                Drag to move your photo. Pinch or scroll to resize.
              </p>
            )}
          </div>

          {/* Controls Sidebar */}
          <div className="w-full max-w-[340px] mx-auto lg:mx-0">
            <ControlsPanel
              photo={photo}
              onPhotoUpload={handlePhotoUpload}
              onPhotoUpdate={handlePhotoUpdate}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>


    </div>
  )
}
