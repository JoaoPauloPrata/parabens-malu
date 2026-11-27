import { motion } from 'motion/react'
import { intro } from '../content'

export default function Intro({ onStart }) {
  return (
    <motion.section
      className="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.span
        className="intro-plane"
        aria-hidden
        initial={{ x: '-60vw' }}
        animate={{ x: '60vw' }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        ✈️
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {intro.titulo}
      </motion.h1>
      <motion.button
        className="pill"
        onClick={onStart}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.06, 1] }}
        transition={{ opacity: { delay: 0.6 }, scale: { delay: 0.6, repeat: Infinity, duration: 1.6 } }}
        whileTap={{ scale: 0.94 }}
      >
        {intro.botao} 🔊
      </motion.button>
    </motion.section>
  )
}
