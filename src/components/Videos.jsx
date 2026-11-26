import { motion } from 'motion/react'
import { videos } from '../content'

export default function Videos() {
  if (!videos.length) return null

  return (
    <section className="section videos">
      {videos.map((video) => (
        <motion.figure
          key={video.src}
          className="video"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <video src={video.src} poster={video.poster} controls playsInline preload="metadata" />
          {video.legenda && <figcaption>{video.legenda}</figcaption>}
        </motion.figure>
      ))}
    </section>
  )
}
