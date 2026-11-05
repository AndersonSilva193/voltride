# Volt Ride — brief criativo (modo enhance: hero + home)

## Contrato de direção
- **TESE:** Volt Ride é a moto que custa centavos por km. A página é uma faixa de sinalização viária: o preço/km é a manchete, não o raio. Recusa o padrão "preto + neon + cards iguais".
- **MUNDO:** sinalização de rua pintada. Amarelo tinta de asfalto (#F2C400) em blocos inteiros (cor comprometida), grafite de asfalto molhado (#17191b), branco de faixa (#f4f1e8). Tipografia condensada de placa (Barlow Condensed, caixa alta); números tabulares. Botões como placas retangulares de quina reta, linhas tracejadas de faixa como divisores.
- **HISTÓRIA:** quem se desloca na cidade entende que gasolina e trânsito são o problema, acredita que rodar elétrico custa R$ 0,05/km, e chama no WhatsApp.
- **PRIMEIRA DOBRA:** vídeo da moto (scrub no scroll, mantido) com título "VOLTRIDE" enorme alinhado à esquerda, uma linha de promessa e o contador km/h como painel. Sem eyebrow, sem pílula.
- **ASSINATURA:** na saída do hero, o amarelo entra como faixa de tinta que cobre a tela (clip-path) e vira a seção "R$ 0,05 / km", gigante. Resto: entradas curtas e distintas por seção, sem o mesmo fade.
- **MÍDIA:** DOM/SVG para tipo e faixas; vídeo existente (ride.mp4) no hero; 1 plano de rua gerado no Higgsfield (sem produto) como textura do fechamento. Fotos do catálogo inalteradas.
- **FIM:** sem crítica externa e sem QA registrado, o site não está pronto.

## Cena e mecanismo
Mecanismo: custo por km irrisório + silêncio. Cena: dia, garoa, ciclofaixa em Curitiba, trânsito parado. Por isso as seções claras (luz do dia); o hero escuro vem do vídeo noturno existente.

## Vício evitado
Categoria: preto + neon ciano/verde. Oposto previsível: branco "eco" com folhas verdes. Ambos fora.

## Pendências / "a preencher"
Preço da gasolina e comparativos não foram inseridos (não inventar). Contato e nome da loja seguem em `data/contact.ts` (STORE_NAME ainda "Loja Exemplo").

## QA (revisão interna — sem subagente revisor externo)
- Build `ng build`: OK. `ng test`: não há specs no projeto.
- Capturas desktop 1440 e mobile 390 conferidas (hero, saída do hero, faixa amarela, técnica, catálogo, FAQ, fechamento, footer). Duas rodadas de correção (título do hero sobre a moto; dica de rolagem cortada; frase repetida no fechamento).
- `prefers-reduced-motion`: ScrollTrigger só registra em `no-preference`; conteúdo visível por padrão.
- Limitações: o vídeo do hero continua noturno com neon ciano/verde (mídia existente); só será recolorido gerando novo vídeo. Páginas /loja e /produto herdam apenas os tokens (amarelo/grafite/fontes), sem redesenho. Imagem de rua gerada no Higgsfield (job b4c4faf1-30b7-4f7b-8386-44f3b22dd1d8, 0,25 crédito) NÃO foi baixada: o host de download foi bloqueado pela rede do ambiente; não é usada no site.
