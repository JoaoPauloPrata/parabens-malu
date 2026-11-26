import { motion } from 'motion/react'
import { mensagens } from '../content'

export default function Messages() {
  if (!mensagens.length) return null

  return (
    <section className="section messages">
      {mensagens.map((texto, i) => (
        <motion.p
          key={i}
          className="message"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {texto}
        </motion.p>
      ))}
    </section>
  )
}
