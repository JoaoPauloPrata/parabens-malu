// Todo o conteúdo da página fica aqui. Edite à vontade sem mexer nos componentes.

export const nome = 'Malu'

// Tela de abertura: o toque é necessário para o celular liberar o som do vídeo
export const intro = {
  titulo: `Malu, chegou uma entrega pra você!`,
  botao: 'Toque para começar',
}

// Animação gerada em animacao/ (node render.mjs …) e copiada para public/videos/
export const animacao = {
  src: '/videos/aniversario.mp4',
}

export const mensagens = [
  'Mensagem 1 — escreva aqui.',
  'Mensagem 2 — escreva aqui.',
  'Mensagem 3 — escreva aqui.',
]

// Coloque os arquivos em public/videos/ e referencie como '/videos/arquivo.mp4'
export const videos = [
  // { src: '/videos/video-1.mp4', poster: '/images/poster-1.jpg', legenda: 'Legenda opcional' },
]

export const presente = {
  chamada: 'Clique para abrir o presente',
  titulo: 'Vale-presente: 2 sessões de massoterapia',
  imagem: '/images/cartao.jpg',
  denovo: 'Ver a animação de novo',
}
