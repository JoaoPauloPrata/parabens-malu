import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { presente } from '../content'

// Primeiro o botão "Clique para abrir o presente" sobre o último quadro da animação; ao tocar, o cartão em tela cheia.
export default function GiftCard({ onReplay }) {
  const [aberto, setAberto] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!aberto ? (
        <motion.button
          key="fechado"
          className="gift-cta"
          onClick={() => setAberto(true)}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.span
            className="gift-emoji"
            aria-hidden
            animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 1.2, duration: 0.6 }}
          >
            🎁
          </motion.span>
          <span className="pill">{presente.chamada}</span>
        </motion.button>
      ) : (
        <motion.div
          key="aberto"
          className="gift-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img
            src={presente.imagem}
            alt={presente.titulo}
            initial={{ rotateY: 90, scale: 0.6 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          />
          <motion.button
            className="replay"
            onClick={onReplay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            ↺ {presente.denovo}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
