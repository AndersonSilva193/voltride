# Storyboard — hero "Um dia de bairro"

Tempo narrativo (scroll 0..1) separado do tempo de vídeo. Seção presa (pin) por 320% de scroll no
desktop e 220% no celular; `scrub: 0.6`. Frames num canvas (`src/app/lib/frame-scrub.ts`), com
mistura entre frames vizinhos.

| Scroll | Relógio | Texto HTML | Vídeo (0..1) | Mapa / hodômetro |
|---|---|---|---|---|
| 0–0,06 | 07:30 | Título "Um dia inteiro de bairro. Uma carga." + CTA | 0 (= poster) | 0 km, bateria cheia |
| 0,10 | 07:30 | "Sai de casa." | 0 | marcador em Casa |
| 0,26 | 07:48 | "Passa na padaria." | 0,02 | 1,2 km |
| 0,42 | 08:20 | "Chega no trabalho." | 0,05 | 6,8 km |
| 0,58 | 12:40 | "Resolve o almoço." | 0,29 | 8,9 km |
| 0,74 | 17:10 | "Volta pela feira." | 0,60 (antes do cabo) | 13,7 km |
| 0,88 | 18:00 | "Liga na tomada." | 1,0 (cabo + farol) | 19,6 km |
| ≥0,925 | 18:00 | "19,6 km no dia. Sobra bateria." + CTA | 1,0 | trajeto completo |

- **Continuidade:** câmera travada; a ponte entre os estados é a luz (manhã pela esquerda → tarde
  dourada pela direita) e a sombra da moto que aparece no muro.
- **Remapeamento:** o vídeo liga o cabo em ~62%. Até a feira usamos 0–0,60 do vídeo; o último trecho
  (feira → casa) usa 0,60–1,0, para o plugue coincidir com "Liga na tomada".
- **Celular:** o frame inteiro (16:9) fica no topo; texto e painel abaixo dele. Sem corte da moto.
- **Movimento reduzido:** sem pin nem scrub. Poster da manhã, roteiro como lista, mapa completo.
- **Falha da sequência:** fica o poster da manhã e o poster da tarde entra por opacidade.
- **Dados:** horários e km são ilustrativos e aparecem rotulados assim; 60 km é a autonomia de
  referência do catálogo.
