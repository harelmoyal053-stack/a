import { MAX_IMAGE_CHARS } from './messages'

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('not-an-image'))
    }
    img.src = url
  })
}

// Downscales a photo to a JPEG data URL small enough to store with the message.
export async function compressImage(file) {
  const { img, url } = await loadImage(file)
  try {
    for (const [maxSide, quality] of [[1280, 0.75], [1024, 0.65], [800, 0.6], [640, 0.5]]) {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      if (dataUrl.length <= MAX_IMAGE_CHARS) return dataUrl
    }
    throw new Error('too-large')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function currentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('unsupported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: Number(pos.coords.latitude.toFixed(5)), lng: Number(pos.coords.longitude.toFixed(5)) }),
      reject,
      { enableHighAccuracy: true, timeout: 15000 },
    )
  })
}
