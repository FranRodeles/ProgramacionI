import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

interface QrPreviewProps {
  data: string
  customization?: {
    dot_style?: string
    corner_style?: string
    dot_color?: string
    background_color?: string
    logo?: string
  }
  onDownload?: () => void
  qrCodeRef?: React.MutableRefObject<QRCodeStyling | null>
}

export default function QrPreview({ data, customization, qrCodeRef }: QrPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const localQrCode = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!localQrCode.current) {
      localQrCode.current = new QRCodeStyling({
        width: 300,
        height: 300,
        margin: 10,
        data,
      })
      if (qrCodeRef) {
        qrCodeRef.current = localQrCode.current
      }
    }
    if (ref.current) {
      ref.current.innerHTML = ''
      localQrCode.current.append(ref.current)
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = ''
      }
    }
  }, [data, qrCodeRef])

  useEffect(() => {
    if (localQrCode.current) {
      localQrCode.current.update({
        data,
        dotsOptions: {
          color: customization?.dot_color || '#000000',
          type: (customization?.dot_style as any) || 'square',
        },
        cornersSquareOptions: {
          type: (customization?.corner_style as any) || 'square',
          color: customization?.dot_color || '#000000',
        },
        cornersDotOptions: {
          type: (customization?.corner_style as any) || 'square',
          color: customization?.dot_color || '#000000',
        },
        backgroundOptions: {
          color: customization?.background_color || '#ffffff',
        },
        image: customization?.logo || undefined,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
          imageSize: 0.4,
        }
      })
    }
  }, [data, customization])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div ref={ref} />
    </div>
  )
}
