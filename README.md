# Simulador de Remuneração Judiciário/MPU

## Objetivo
Este projeto permite que servidores do Judiciário e do MPU simulem sua remuneração detalhada, considerando vencimentos, adicionais, descontos obrigatórios e propostas de reajuste. O simulador facilita a comparação entre a situação atual e diferentes cenários de aumento salarial, mostrando o impacto real no valor líquido recebido.

## Público-alvo
- Servidores do Judiciário Federal e do MPU
- Interessados em concursos dessas carreiras
- Sindicatos, associações e analistas de políticas salariais

## Funcionalidades
- Simulação da remuneração bruta e líquida para cargos do Judiciário e MPU
- Cálculo automático de:
  - PSS (Previdência)
  - IRRF (Imposto de Renda)
  - GAS/GAE (Gratificações)
  - Adicionais de qualificação, treinamento, penosidade, ATS, VPNI
  - Abono de permanência
  - Auxílios (alimentação, pré-escolar)
  - Contribuições Funpresp (patrocinada e facultativa)
  - Outros descontos personalizados
- Comparação entre situação atual e propostas de reajuste (GAJ 165%, Novo AQ, etc.)
- Exibição do aumento percentual (líquido e bruto) ao lado de cada proposta
- Interface amigável, responsiva e de fácil preenchimento

## Regras de Cálculo (Resumo)
- **Vencimento Básico:** conforme cargo e classe/padrão
- **GAJ:** percentual sobre o vencimento (140% ou 165% conforme proposta)
- **GAS/GAE:** 35% do vencimento para cargos elegíveis
- **PSS:** cálculo progressivo conforme tabela vigente (2025)
- **IRRF:** cálculo progressivo, com desconto simplificado de R$ 528,00 se vantajoso
- **Adicionais:** calculados sobre o vencimento, conforme titulação e regras específicas
- **Funpresp:** contribuições sobre o que exceder o teto do RGPS
- **Propostas:** cada cenário de reajuste altera vencimento, GAJ e adicionais conforme regras

## Instruções de Uso
1. Baixe todos os arquivos do projeto para uma pasta local
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, Safari)
3. Preencha os campos do formulário conforme seu perfil (órgão, cargo, classe, adicionais, etc.)
4. Veja o resultado da remuneração atual e das propostas, com todos os cálculos detalhados
5. Compare os percentuais de aumento e, se desejar, altere os parâmetros para simular outros cenários

## Exemplo de Uso
- Selecione "Judiciário", "Ativo", "Agente de Polícia", "Classe 13"
- Preencha adicionais e descontos conforme sua situação
- Veja o valor líquido atual e o impacto de cada proposta de reajuste

## Estrutura dos Arquivos
- `index.html` — Interface principal do simulador
- `style.css` — Estilos visuais e responsividade
- `script.js` — Lógica de cálculo e interação
- `README.md` — Este manual detalhado

## Tecnologias Utilizadas
- HTML5
- CSS3 (customizado, responsivo, visual moderno)
- JavaScript puro (sem frameworks)

## Dicas de Personalização
- Para alterar valores de vencimento, adicionais ou regras, edite o arquivo `script.js`
- Para mudar o visual, altere o arquivo `style.css`
- Para adicionar novos cargos ou benefícios, siga o padrão dos objetos no início do `script.js`

## Contato e Suporte
Dúvidas, sugestões ou correções? Entre em contato pelo e-mail: **SeuEmail@exemplo.com**

---

> O simulador é apenas para fins informativos e não substitui a folha oficial do órgão. As regras e tabelas são baseadas na legislação vigente até 2025. Colabore para aprimorar o projeto! 