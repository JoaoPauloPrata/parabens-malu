import { motion } from 'motion/react'
import { hero } from '../content'

export default function Hero() {
  return (
    <section className="section hero">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {hero.titulo}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {hero.subtitulo}
      </motion.p>
    </section>
  )
}
