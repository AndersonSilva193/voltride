# Voltride — briefing criativo

## Contexto
- **O que é:** loja demonstrativa (marca fictícia) de scooters elétricas urbanas, 7 modelos, 500–1000 W.
- **Para que serve:** peça de portfólio para vender criação de sites. Quem precisa se impressionar é o
  dono de um negócio que olha e pensa "quero um site assim".
- **Ação principal:** abrir o catálogo e falar no WhatsApp. Ação secundária (rodapé): contratar um site.
- **Provas reais:** só as do catálogo (preço e autonomia são *referência de pesquisa*, rotulados assim).
  O trajeto do hero é **ilustrativo** e diz isso na tela.
- **Não pode mudar:** honestidade dos dados, rotas `/`, `/loja`, `/produto/:id`, contato por WhatsApp.

## Mecanismo e cena
- **Mecanismo:** uma scooter que faz o dia inteiro de bairro numa carga e recarrega na tomada de casa.
- **Cena física do público:** de dia, rua residencial brasileira, muro pintado, calçada com meio-fio
  amarelo, padaria na esquina. Logo: **claro**, não escuro.

## Vício proibido
- Categoria: "veículo elétrico" = fundo preto, neon verde/ciano, raio, fonte futurista, garagem com fumaça.
- Oposto previsível: branco clínico de startup com cards flutuando. Os dois estão fora.

## Mundos considerados
1. **Guia de bairro / mapa de linha de ônibus** (papel impresso + placa de rua) — escolhido.
2. Folheto de concessionária anos 80 (papel, retícula).
3. Mostruário de esmalte automotivo (tinta, superfície encharcada).
4. Muros pintados de bairro (pintura, cal, tijolinho) — incorporado às fotos.
5. Placa de rua esmaltada azul (metal esmaltado) — incorporado à UI.

## Contrato de direção
**TESE:** a página é um dia de bairro: o scroll é o relógio. Recusa o hero escuro com produto
girando em estúdio e frases de clima.

**MUNDO:** papel de mapa cinza-quente claro, azul de placa de rua em blocos inteiros, amarelo de
meio-fio como único acento, tinta quase-preta. Componentes são placas: retângulos azuis com filete
branco interno e cantos levemente arredondados; trajetos são linhas grossas com paradas em círculo.
Tipografia Overpass (desenho de sinalização viária), Overpass Mono só para horas, km e preços.

**HISTÓRIA:** o visitante vê a moto no muro de casa às 7h30, acompanha o dia até ela voltar e
carregar na tomada; entende que um dia comum cabe numa carga (ilustrativo), escolhe uma "linha" de
modelos e chama no WhatsApp.

**PRIMEIRA DOBRA:** foto em tela cheia (frame 0, manhã). Título grande em duas linhas sobre o muro
vazio à esquerda; relógio 07:30 em placa no canto inferior esquerdo; CTA "Ver os modelos" abaixo do
título; moto ocupa o terço direito.

**ASSINATURA:** o scroll controla a passagem do dia (sequência de frames em canvas, pin): a luz
atravessa o muro, o farol acende, o cabo liga na tomada; por cima, placas de parada entram e saem,
mini-mapa desenha o trajeto e o hodômetro sobe. Resto da página: linhas que se desenham (stroke),
nada de fade+sobe genérico.

**MÍDIA:** Higgsfield = quadros A/B, vídeo do dia (MiniMax H3 2K), 7 fotos de catálogo em muros
de bairro. DOM/SVG = textos, placas, mapa, linhas de modelos, CTA.

**FIM:** sem crítica externa e sem QA registrado, o site não está pronto.
