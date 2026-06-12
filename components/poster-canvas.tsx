"use client"

import { useRef, useState, useCallback, useEffect } from "react"

interface PhotoState {
  x: number
  y: number
  scale: number
  src: string
  width: number
  height: number
}

interface PosterCanvasProps {
  photo: PhotoState | null
  onPhotoUpdate: (photo: PhotoState) => void
  canvasSize: number
  onCircleDetected?: (cx: number, cy: number, r: number) => void
}

export function PosterCanvas({ photo, onPhotoUpdate, canvasSize, onCircleDetected }: PosterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const photoStart = useRef({ x: 0, y: 0 })
  const bgImageRef = useRef<HTMLImageElement | null>(null)
  const photoImageRef = useRef<HTMLImageElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  // Touch pinch-to-zoom state
  const lastPinchDistance = useRef<number | null>(null)
  const pinchStartScale = useRef<number>(1)
  // Default will be overwritten by transparent pixel detection
  const circleRef = useRef({ cx: canvasSize * 0.5, cy: canvasSize * 0.5, r: canvasSize * 0.4 })

  // Load background image and detect transparent circle
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      bgImageRef.current = img

      // Detect the transparent circle by sampling the image pixels
      const tempCanvas = document.createElement("canvas")
      const w = img.naturalWidth
      const h = img.naturalHeight
      tempCanvas.width = w
      tempCanvas.height = h
      const tempCtx = tempCanvas.getContext("2d")
      if (tempCtx) {
        tempCtx.drawImage(img, 0, 0, w, h)
        const imageData = tempCtx.getImageData(0, 0, w, h)
        const alpha = imageData.data

        // Find all transparent pixels (alpha < 10)
        let minX = w, maxX = 0, minY = h, maxY = 0
        let count = 0
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4
            if (alpha[idx + 3] < 10) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
              count++
            }
          }
        }

        if (count > 100) {
          const cx = (minX + maxX) / 2
          const cy = (minY + maxY) / 2
          const rx = (maxX - minX) / 2
          const ry = (maxY - minY) / 2
          const r = Math.max(rx, ry)
          // Scale from image native size to canvas size
          const scaleX = canvasSize / w
          const scaleY = canvasSize / h
          const detectedCx = cx * scaleX
          const detectedCy = cy * scaleY
          const detectedR = r * Math.min(scaleX, scaleY)
          
          circleRef.current = {
            cx: detectedCx,
            cy: detectedCy,
            r: detectedR,
          }
          onCircleDetected?.(detectedCx, detectedCy, detectedR)
        }
      }

      setIsReady(true)
    }
    img.src = "/images/poster-bg.png"
  }, [canvasSize, onCircleDetected])

  // Load photo image when it changes
  useEffect(() => {
    if (!photo) {
      photoImageRef.current = null
      return
    }
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      photoImageRef.current = img
      drawCanvas()
    }
    img.src = photo.src
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo?.src])

  // Draw everything to canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !bgImageRef.current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Draw photo FIRST (behind the poster) - no clipping needed since poster has transparent hole
    if (photo && photoImageRef.current) {
      const w = photo.width * photo.scale
      const h = photo.height * photo.scale
      ctx.drawImage(photoImageRef.current, photo.x, photo.y, w, h)
    }

    // Draw the poster PNG on top - the transparent circle in the PNG will reveal the photo behind
    ctx.drawImage(bgImageRef.current, 0, 0, canvasSize, canvasSize)
  }, [photo, canvasSize])

  // Redraw when photo state or readiness changes
  useEffect(() => {
    if (isReady) {
      drawCanvas()
    }
  }, [isReady, drawCanvas])

  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return { x: 0, y: 0 }
    const rect = container.getBoundingClientRect()
    const displayScale = canvasSize / rect.width
    return {
      x: (clientX - rect.left) * displayScale,
      y: (clientY - rect.top) * displayScale,
    }
  }, [canvasSize])

  // Mouse/touch handlers for dragging
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!photo) return
    e.preventDefault()
    const coords = getCanvasCoords(e.clientX, e.clientY)
    isDragging.current = true
    dragStart.current = coords
    photoStart.current = { x: photo.x, y: photo.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [photo, getCanvasCoords])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !photo) return
    e.preventDefault()
    const coords = getCanvasCoords(e.clientX, e.clientY)
    const dx = coords.x - dragStart.current.x
    const dy = coords.y - dragStart.current.y
    onPhotoUpdate({
      ...photo,
      x: photoStart.current.x + dx,
      y: photoStart.current.y + dy,
    })
  }, [photo, onPhotoUpdate, getCanvasCoords])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Mouse wheel for scaling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!photo) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.max(0.1, Math.min(3, photo.scale + delta))
    onPhotoUpdate({ ...photo, scale: newScale })
  }, [photo, onPhotoUpdate])

  // Touch handlers for pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!photo) return
    if (e.touches.length === 2) {
      // Pinch gesture start
      const distance = getTouchDistance(e.touches)
      lastPinchDistance.current = distance
      pinchStartScale.current = photo.scale
    }
  }, [photo])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!photo) return
    if (e.touches.length === 2 && lastPinchDistance.current !== null) {
      // Pinch gesture
      e.preventDefault()
      const distance = getTouchDistance(e.touches)
      if (distance !== null) {
        const scaleFactor = distance / lastPinchDistance.current
        const newScale = Math.max(0.1, Math.min(3, pinchStartScale.current * scaleFactor))
        onPhotoUpdate({ ...photo, scale: newScale })
      }
    }
  }, [photo, onPhotoUpdate])

  const handleTouchEnd = useCallback(() => {
    lastPinchDistance.current = null
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square cursor-grab active:cursor-grabbing select-none rounded-lg overflow-hidden shadow-xl"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="w-full h-full"
      />

    </div>
  )
}
