import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

export function useSaveImage() {
  const [imgArr, setImgArr] = useState<
    {
      date: string
      img: string
    }[]
  >([])

  const saveImg = (date: string, img: string) => {
    if (imgArr.find((item) => item.date === date)) {
      console.log('dup')
      setImgArr(imgArr.filter((item) => item.date !== date))
      setImgArr((prev) => [...prev, { date, img }])
    } else {
      imgArr.push({ date, img })
    }
    console.log(imgArr.length)
    localStorage.setItem('img', JSON.stringify(imgArr))
  }

  useEffect(() => {
    const img = localStorage.getItem('img')
    if (img) {
      setImgArr(JSON.parse(img))
    }
  }, [])

  const resetAll = () => {
    localStorage.removeItem('img')
    setImgArr([])
  }

  const sortedImg = () => {
    return imgArr.sort((a, b) => {
      return DateTime.fromFormat(a.date, 'yyyy-MM-dd').diff(
        DateTime.fromFormat(b.date, 'yyyy-MM-dd')
      ).milliseconds
    })
  }

  return {
    sortedImg,
    saveImg,
    resetAll
  }
}
