# Checklist OMNI — Caderno Unificado v7

PWA offline para execução dos checklists normais da frota OMNI Táxi Aéreo,
com controle visual de itens cumpridos, progresso por perna e retomada após
interrupção.

## Fonte do dataset

- Documento: `caderno-checklists-frota-omni-padronizado-v7.docx`
- Título: CADERNO UNIFICADO DE CHECKLISTS NORMAIS
- Padronização Operacional da Frota (7 Frotas) — OMNI Táxi Aéreo
- Frotas: H-160, S-92, AW189, H145, H175, AW139, H225
- Arquivo gerado: `src/data/fleets.js` (texto copiado literalmente do documento)

Para uma nova revisão do caderno:

```bash
python3 tools/build-fleets.py caderno-checklists-frota-omni-padronizado-vX.docx
```

O script valida a estrutura de cada tabela (título, gatilho, itens, linha de
"Checklist complete") e interrompe com erro se algo não bater.

## Mudanças da v3 (caderno unificado)

- **Um único checklist por frota.** Não há mais separação Normal / Offshore:
  os itens offshore estão incorporados nos checklists do caderno.
- **Modelo de aeronave nas Configurações (⚙).** A escolha vale para os
  próximos voos; um voo em andamento continua na frota em que foi iniciado.
- **Menu inicial: só a quantidade de pousos.** O app monta as pernas:
  - Perna 1: PREFLIGHT → AFTER LANDING
  - Pernas intermediárias: BEFORE TAKEOFF → AFTER LANDING
  - Última perna: BEFORE TAKEOFF → SHUT DOWN (com 1 pouso: PREFLIGHT → SHUT DOWN)
- **Visual idêntico ao caderno.** Barra de título azul-marinho `#1B365D`,
  linha "Gatilho" e linha "► Checklist complete" em `#D9E1F2`, itens em linhas
  alternadas branco / cinza `#C8C8C8`, Arial, desafio à esquerda e resposta à
  direita.
  - **Caderno** (visão geral): páginas Carta em duas colunas com linha
    separadora, cabeçalho e rodapé do documento, paginadas como no Word
    (tabelas nunca quebram entre colunas). Em telas estreitas, uma coluna por
    página. O seletor **Perna** no topo escolhe qual perna aparece marcada.
  - **Checklist** (detalhe): a tabela do grupo ampliada, com toque por item.
  - A tabela nunca muda com o estado dos itens: as marcações ficam na margem,
    fora da tabela — ✓ cumprido e ⚠ não cumprido à direita, ▶ próximo item à
    esquerda; na visão Caderno, barra âmbar ao lado do grupo aberto e ✓ ao lado
    do título dos grupos concluídos.
  - **Não cumprido é automático:** um item sem marcação vira ⚠ assim que algum
    item abaixo dele no mesmo grupo é marcado. O ▶ fica no item logo após o
    último marcado.
- Relatório de voo (PDF) no mesmo estilo de tabela, com perna, status e
  horário de cada item.
- Marcação de tempos por perna: ACIONAMENTO (fim do BEFORE START), DECOLAGEM
  (fim do BEFORE TAKEOFF), POUSO (início do AFTER LANDING), CORTE (fim do
  SHUT DOWN).
- Removidos: campo de indicativo da unidade marítima (não existe no caderno) e
  o construtor de voo onshore/offshore.
- LocalStorage com chaves novas (`omni-checklist-state-v4-caderno-v7`,
  `omni-flight-log-v3-caderno-v7`); voo em andamento e histórico da versão
  AW139 anterior não são migrados. Preferências (matrícula, modo noite,
  barreiras, tempos) são mantidas.

## Como rodar localmente

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

## Como usar

- ⚙ → **Modelo de aeronave**: escolher a frota.
- Informar matrícula, observações e a **quantidade de pousos**; tocar em
  **Iniciar voo**.
- Toque em uma linha para marcar como cumprida; toque de novo para desmarcar.
- Pular um item e marcar o de baixo deixa o item pulado como ⚠ não cumprido;
  marcá-lo depois remove o ⚠.
- Com o grupo completo, **Próximo →** avança para o grupo seguinte.
- Barra inferior: Início, Reset do grupo, **Atual** (volta ao grupo em
  andamento — o último com itens marcados, ou o seguinte se já estiver
  completo), Grupos (cartões) e Caderno (visão do documento).

## Checklist de validação antes de uso operacional

- [x] Conferir todas as frotas e grupos contra o caderno v7 (gerado do .docx).
- [ ] Conferir a sequência de pernas com a operação (pousos intermediários
      reiniciam em BEFORE TAKEOFF).
- [ ] Testar PWA offline no iPad.
- [ ] Testar persistência após fechar/reabrir.
- [ ] Testar reset de grupo e reset voo.
