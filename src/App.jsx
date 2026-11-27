import { useState } from 'react'
import Intro from './components/Intro'
import Animation from './components/Animation'
import GiftCard from './components/GiftCard'

// abertura → animação (com som) → botão do presente sobre o último quadro → cartão em tela cheia
export default function App() {
  const [etapa, setEtapa] = useState('intro')
  const [rodada, setRodada] = useState(0)

  return (
    <main className="stage">
      {etapa !== 'intro' && (
        <Animation key={rodada} onEnd={() => setEtapa('presente')} />
      )}
      {etapa === 'intro' && <Intro onStart={() => setEtapa('animacao')} />}
      {etapa === 'presente' && (
        <GiftCard
          onReplay={() => {
            setRodada((r) => r + 1)
            setEtapa('animacao')
          }}
        />
      )}
    </main>
  )
}
