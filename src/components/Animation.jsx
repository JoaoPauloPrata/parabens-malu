import { useEffect, useRef } from 'react'
import { animacao } from '../content'

// Toca a animação em tela cheia. Começa logo depois do toque da abertura (por isso o som é liberado no celular).
// Ao terminar, o vídeo fica parado no último quadro e avisa o App.
export default function Animation({ onEnd }) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    v.currentTime = 0
    v.play().catch(() => {
      // sem permissão para som (navegador bloqueou): toca mudo em vez de travar
      v.muted = true
      v.play()
    })
  }, [])

  return (
    <video
      ref={ref}
      className="animation"
      src={animacao.src}
      playsInline
      preload="auto"
      onEnded={onEnd}
    />
  )
}
