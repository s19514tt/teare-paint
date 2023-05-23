import React, { useEffect, useRef, useState } from 'react'
import { handimg } from './img'
import { DateTime } from 'luxon'
import { useSaveImage } from './savehook'

type Tool = 'pen' | 'eraser'

const DrawingApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(new Image())
  const [tool, setTool] = useState<Tool>('pen')
  const [date, setDate] = useState<string>(
    DateTime.local().toFormat('yyyy-MM-dd')
  )

  const { sortedImg, saveImg, resetAll } = useSaveImage()

  useEffect(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    image.src = handimg

    if (canvas && image) {
      const ctx = canvas.getContext('2d')

      image.onload = () => {
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          // Initialize drawing settings
          ctx.lineWidth = 5
          ctx.lineJoin = 'round'
          ctx.lineCap = 'round'
          ctx.strokeStyle = tool === 'pen' ? '#ff0000' : '#ffffff'
        }
      }

      let drawing = false

      const startDrawing = (event: MouseEvent) => {
        drawing = true
        draw(event)
      }

      const stopDrawing = () => {
        drawing = false
        ctx?.beginPath()
      }

      const draw = (event: MouseEvent) => {
        if (!drawing) return
        if (ctx) {
          ctx.strokeStyle = tool === 'pen' ? '#ff0000' : '#ffffff'
          ctx.lineTo(
            event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop
          )
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(
            event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop
          )
        }
      }

      canvas.addEventListener('mousedown', startDrawing)
      canvas.addEventListener('mouseup', stopDrawing)
      canvas.addEventListener('mousemove', draw)

      return () => {
        canvas.removeEventListener('mousedown', startDrawing)
        canvas.removeEventListener('mouseup', stopDrawing)
        canvas.removeEventListener('mousemove', draw)
      }
    }
  }, [tool])

  const logImageData = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL()
      saveImg(date, dataUrl)
    }
  }

  const setImgAndDate = (img: string, date: string) => () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const image = imageRef.current
    image.src = img
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    setDate(date)
  }

  const resetCanvas = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    imageRef.current.src = handimg
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)
  }

  const comfirmResetAll = () => {
    const res = window.confirm('resetAll OK?')
    if (res) {
      resetAll()
      resetCanvas()
    }
  }

  return (
    <div id="wrapper">
      <div id="sidebar">
        <button onClick={comfirmResetAll}>ResetAll</button>
        {sortedImg().map((img, i) => {
          return (
            <button key={i} onClick={setImgAndDate(img.img, img.date)}>
              {img.date}
            </button>
          )
        })}
      </div>
      <div id="main">
        <canvas
          ref={canvasRef}
          width={338}
          height={450}
          style={{ border: '1px solid black' }}
        />
        <button onClick={() => setTool('pen')}>Pen</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <button onClick={logImageData}>Save</button>
        <button onClick={resetCanvas}>Reset</button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
      </div>
    </div>
  )
}

export default DrawingApp
