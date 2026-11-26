import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { presente } from '../content'

export default function GiftCard() {
  const [aberto, setAberto] = useState(false)

  return (
    <section className="section gift">
      <AnimatePresence mode="wait">
        {!aberto ? (
          <motion.button
            key="fechado"
            className="gift-box"
            onClick={() => setAberto(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: [0, -3, 3, -3, 0] }}
            transition={{ rotate: { repeat: Infinity, repeatDelay: 2, duration: 0.5 } }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <span className="gift-emoji" aria-hidden>🎁</span>
            <span>{presente.chamada}</span>
          </motion.button>
        ) : (
          <motion.div
            key="aberto"
            className="gift-card"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {presente.imagem && <img src={presente.imagem} alt={presente.titulo} />}
            <h2>{presente.titulo}</h2>
            {presente.valor && <p className="gift-valor">{presente.valor}</p>}
            <p>{presente.descricao}</p>
            {presente.codigo && <code className="gift-codigo">{presente.codigo}</code>}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
