console.log('JS carregado');
// Aqui vai todo o JavaScript do simulador, extraído do <script> do HTML original. 

const vencimentosBasicos = {
    "Analista": { 13: 9292.14, 12: 9021.50, 11: 8758.73, 10: 8503.62, 9: 8255.95, 8: 7810.73, 7: 7583.23, 6: 7362.37, 5: 7147.92, 4: 6939.75, 3: 6565.50, 2: 6374.26, 1: 6188.61 },
    "Analista TI": { 13: 9292.14, 12: 9021.50, 11: 8758.73, 10: 8503.62, 9: 8255.95, 8: 7810.73, 7: 7583.23, 6: 7362.37, 5: 7147.92, 4: 6939.75, 3: 6565.50, 2: 6374.26, 1: 6188.61 },
    "Oficial de Justiça": { 13: 9292.14, 12: 9021.50, 11: 8758.73, 10: 8503.62, 9: 8255.95, 8: 7810.73, 7: 7583.23, 6: 7362.37, 5: 7147.92, 4: 6939.75, 3: 6565.50, 2: 6374.26, 1: 6188.61 },
    "Técnico": { 13: 5663.47, 12: 5498.51, 11: 5338.36, 10: 5182.88, 9: 5031.90, 8: 4760.56, 7: 4621.90, 6: 4487.29, 5: 4356.59, 4: 4229.69, 3: 4001.60, 2: 3885.06, 1: 3771.88 },
    "Técnico TI": { 13: 5663.47, 12: 5498.51, 11: 5338.36, 10: 5182.88, 9: 5031.90, 8: 4760.56, 7: 4621.90, 6: 4487.29, 5: 4356.59, 4: 4229.69, 3: 4001.60, 2: 3885.06, 1: 3771.88 },
    "Agente de Polícia": { 13: 5663.47, 12: 5498.51, 11: 5338.36, 10: 5182.88, 9: 5031.90, 8: 4760.56, 7: 4621.90, 6: 4487.29, 5: 4356.59, 4: 4229.69, 3: 4001.60, 2: 3885.06, 1: 3771.88 },
    "Inspetor de Polícia": { 13: 9292.14, 12: 9021.50, 11: 8758.73, 10: 8503.62, 9: 8255.95, 8: 7810.73, 7: 7583.23, 6: 7362.37, 5: 7147.92, 4: 6939.75, 3: 6565.50, 2: 6374.26, 1: 6188.61 },
    "Auxiliar": { 13: 3354.11, 12: 3209.70, 11: 3071.48, 10: 2939.22, 9: 2812.64, 8: 2660.96, 7: 2546.38, 6: 2436.73, 5: 2331.80, 4: 2231.38, 3: 2111.05, 2: 2020.14, 1: 1933.15 },
};

const funcoesComissionadas = {
    judiciario: {
        "Nenhuma": 0, "CJ-4": 11322.60, "CJ-3": 10029.94, "CJ-2": 8822.98, "CJ-1": 7143.98,
        "FC-6": 3663.71, "FC-5": 2662.06, "FC-4": 2313.27, "FC-3": 1644.51, "FC-2": 1413.14, "FC-1": 1215.34
    },
    mpu: {
        "Nenhuma": 0, "FC-1": 1145.14, "FC-2": 1331.52, "FC-3": 1899.24,
        "CC-1": 3889.86, "CC-2": 5917.30, "CC-3": 6538.32, "CC-4": 10990.74,
        "CC-5": 13573.81, "CC-6": 15430.68, "CC-7": 17419.38
    }
};

const auxilioAlimentacao = 1784.42;
const auxilioCrecheValor = 1235;
const valorVR = 714.40;
const deducaoDependenteIRRF = 189.59;

// Funções
function updateFuncaoComissionada() {
    const orgao = document.querySelector('input[name="orgao"]:checked').value;
    const select = document.getElementById('funcaoComissionada');
    
    select.innerHTML = '';
    
    const funcoes = funcoesComissionadas[orgao];
    for (const [nome, valor] of Object.entries(funcoes)) {
        const option = document.createElement('option');
        option.value = valor;
        option.textContent = nome;
        select.appendChild(option);
    }
    
    calculateAndDisplay();
}

function addDesconto() {
    const container = document.getElementById('outros-descontos-list');
    const item = document.createElement('div');
    item.classList.add('desconto-item');
    item.innerHTML = `
        <input type="text" placeholder="Nome do Desconto" class="desconto-nome">
        <input type="number" placeholder="Valor (R$)" class="desconto-valor" min="0" value="0">
        <button type="button" onclick="this.parentElement.remove(); calculateAndDisplay();">Remover</button>
    `;
    container.appendChild(item);
    item.querySelector('.desconto-valor').addEventListener('input', calculateAndDisplay);
}

function getFormValues() {
    const orgao = document.querySelector('input[name="orgao"]:checked').value;
    const cargo = document.getElementById('cargo').value;
    const classe = parseInt(document.getElementById('classe').value);
    const funcaoComissionadaValor = parseFloat(document.getElementById('funcaoComissionada').value) || 0;
    const isAtivo = document.querySelector('input[name="status"]:checked').value === 'ativo';
    const isJudiciario = orgao === 'judiciario';

    let gas = 0, gae = 0;
    const vencimentoBasico = vencimentosBasicos[cargo][classe];

    if (isAtivo) {
        if (["Agente de Polícia", "Inspetor de Polícia"].includes(cargo)) {
            if (isJudiciario) {
                if (funcaoComissionadaValor === 0) {
                    gas = vencimentoBasico * 0.35;
                }
            } else {
                gas = vencimentoBasico * 0.35;
            }
        }
        if (cargo === 'Oficial de Justiça') gae = vencimentoBasico * 0.35;
    }

    const outrosDescontos = Array.from(document.querySelectorAll('.desconto-item')).map(item => {
        const nome = item.querySelector('.desconto-nome').value || 'Desconto';
        const valor = parseFloat(item.querySelector('.desconto-valor').value) || 0;
        return { nome, valor };
    });

    return {
        status: isAtivo ? 'ativo' : 'aposentado',
        funpresp: document.querySelector('input[name="funpresp"]:checked').value === 'sim',
        orgao,
        cargo,
        classe,
        vencimentoBasico,
        funcaoComissionada: funcaoComissionadaValor,
        penosidade: parseFloat(document.getElementById('penosidade').value) || 0,
        qual_graduacao: parseInt(document.getElementById('qual_graduacao').value) || 0,
        qual_certificacoes: parseInt(document.getElementById('qual_certificacoes').value) || 0,
        qual_especializacao: parseInt(document.getElementById('qual_especializacao').value) || 0,
        qual_mestrado: parseInt(document.getElementById('qual_mestrado').value) || 0,
        qual_doutorado: parseInt(document.getElementById('qual_doutorado').value) || 0,
        qual_treinamento: parseInt(document.getElementById('qual_treinamento').value) || 0,
        ats: parseFloat(document.getElementById('ats').value) || 0,
        vpni: parseFloat(document.getElementById('vpni').value) || 0,
        auxilioCreche: parseInt(document.getElementById('auxilioCreche').value) || 0,
        dependentesIRRF: parseInt(document.getElementById('dependentesIRRF').value) || 0,
        contribuicaoPatrocinada: parseFloat(document.getElementById('contribuicaoPatrocinada').value) || 0,
        contribuicaoFacultativa: parseFloat(document.getElementById('contribuicaoFacultativa').value) || 0,
        abonoPermanencia: document.querySelector('input[name="abonoPermanencia"]:checked').value,
        gas,
        gae,
        outrosDescontos,
        gajMajoradaPercent: parseFloat(document.getElementById('gajMajoradaPercent').value) || 1.6,
    };
}

function calcularPSS(baseCalculo, temFunpresp = false, status = 'ativo') {
    const faixasPSS = [
        { limite: 1518.00, aliquota: 0.075, deducao: 0.00 },
        { limite: 2793.88, aliquota: 0.09, deducao: 22.77 },
        { limite: 4190.83, aliquota: 0.12, deducao: 106.59 },
        { limite: 8157.41, aliquota: 0.14, deducao: 190.40 },
        { limite: 13969.49, aliquota: 0.145, deducao: 0 },
        { limite: 27938.95, aliquota: 0.165, deducao: 0 },
        { limite: 54480.97, aliquota: 0.19, deducao: 0 },
        { limite: Infinity, aliquota: 0.22, deducao: 0 }
    ];

    if (temFunpresp && status === 'ativo') {
        const tetoRGPS = 8157.41;
        baseCalculo = Math.min(baseCalculo, tetoRGPS);
    }

    let pssTotal = 0;
    let baseRestante = baseCalculo;

    for (let i = 0; i < faixasPSS.length; i++) {
        const faixa = faixasPSS[i];
        const faixaAnterior = i > 0 ? faixasPSS[i - 1] : { limite: 0 };
        
        if (baseRestante <= 0) break;

        const limiteFaixa = faixa.limite;
        const limiteAnterior = faixaAnterior.limite;
        const baseFaixa = Math.min(baseRestante, limiteFaixa - limiteAnterior);
        
        if (baseFaixa > 0) {
            const pssFaixa = baseFaixa * faixa.aliquota;
            pssTotal += pssFaixa;
            baseRestante -= baseFaixa;
        }
    }

    return pssTotal;
}

function calculateSituacaoAtual(inputs) {
    const { vencimentoBasico, status, funpresp, funcaoComissionada, gas, gae, penosidade, qual_graduacao, qual_certificacoes, qual_especializacao, qual_mestrado, qual_doutorado, qual_treinamento, ats, vpni, auxilioCreche, abonoPermanencia, dependentesIRRF, outrosDescontos, orgao, contribuicaoPatrocinada, contribuicaoFacultativa } = inputs;
    
    let proventos = {};

    proventos['Vencimento Básico'] = vencimentoBasico;
    const gaj = vencimentoBasico * 1.40;
    proventos['GAJ (140%)'] = gaj;

    if (gas > 0) proventos['GAS (35%)'] = gas;
    if (gae > 0) proventos['GAE (35%)'] = gae;
    if (funcaoComissionada > 0) proventos['Função de Confiança'] = funcaoComissionada;
    
    const penosidadeValor = vencimentoBasico * penosidade;
    if (penosidadeValor > 0) proventos['Penosidade'] = penosidadeValor;
    
    // AQ Antigo (situação atual)
    let aqPercent = 0;
    if (qual_doutorado > 0) aqPercent = 0.125;
    else if (qual_mestrado > 0) aqPercent = 0.10;
    else if (qual_especializacao > 0) aqPercent = 0.075;
    else if (qual_graduacao > 0) aqPercent = 0.05;
    const valorAQ = vencimentoBasico * aqPercent;
    if (valorAQ > 0) proventos['Adicional de Qualificação'] = valorAQ;

    // AT Antigo (situação atual)
    let atPercent = 0;
    if (status === 'ativo') {
        if (orgao === 'judiciario') {
            if (qual_treinamento >= 3) atPercent = 0.03;
            else if (qual_treinamento >= 2) atPercent = 0.02;
            else if (qual_treinamento >= 1) atPercent = 0.01;
        } else {
            if (qual_treinamento >= 2) atPercent = 0.05;
            else if (qual_treinamento >= 1) atPercent = 0.025;
        }
    }
    const valorAT = vencimentoBasico * atPercent;
    if (valorAT > 0) proventos['Adicional de Treinamento'] = valorAT;

    const atsValor = vencimentoBasico * (ats / 100);
    if (atsValor > 0) proventos['ATS'] = atsValor;
    if (vpni > 0) proventos['VPNI'] = vpni;

    if (status === 'ativo') proventos['Auxílio Alimentação'] = auxilioAlimentacao;
    const valorCreche = auxilioCreche * auxilioCrecheValor;
    if (valorCreche > 0) proventos['Auxílio Pré-Escolar'] = valorCreche;

    let baseCalculoPSS = vencimentoBasico + gaj + funcaoComissionada + gae + penosidadeValor + valorAQ + atsValor + vpni;
    let baseCalculoIRPF = baseCalculoPSS + gas + valorAT;

    let descontos = {};
    const pss = calcularPSS(baseCalculoPSS, funpresp, status);
    descontos['PSS (Progressivo)'] = pss;

    if (contribuicaoPatrocinada > 0) {
        const tetoINSS = 8157.41;
        const salarioBruto = baseCalculoPSS;
        const baseFunpresp = Math.max(0, salarioBruto - tetoINSS);
        const contribPatrocinada = baseFunpresp * (contribuicaoPatrocinada / 100);
        descontos[`Contribuição Patrocinada (${contribuicaoPatrocinada}%)`] = contribPatrocinada;
    }

    if (contribuicaoFacultativa > 0) {
        const tetoINSS = 8157.41;
        const salarioBruto = baseCalculoPSS;
        const baseFunpresp = Math.max(0, salarioBruto - tetoINSS);
        const contribFacultativa = baseFunpresp * (contribuicaoFacultativa / 100);
        descontos[`Contribuição Facultativa (${contribuicaoFacultativa}%)`] = contribFacultativa;
    }

    if (abonoPermanencia === 'sim' && status === 'aposentado') {
        proventos['Abono de Permanência'] = pss;
        baseCalculoIRPF += pss;
    }

    const totalProventos = Object.values(proventos).reduce((a, b) => a + b, 0);
    const deducaoDependentesTotal = dependentesIRRF * deducaoDependenteIRRF;
    let baseIRRFFinal = baseCalculoIRPF - pss - deducaoDependentesTotal;

    // Desconto simplificado (maio/2023 em diante)
    const descontoSimplificado = 528.00;
    let baseSimplificada = baseCalculoIRPF - pss - descontoSimplificado;

    // Calcula IRRF normal
    let irrfNormal = 0;
    if (baseIRRFFinal > 4664.68) irrfNormal = baseIRRFFinal * 0.275 - 869.36;
    else if (baseIRRFFinal > 3751.06) irrfNormal = baseIRRFFinal * 0.225 - 636.13;
    else if (baseIRRFFinal > 2826.66) irrfNormal = baseIRRFFinal * 0.15 - 354.80;
    else if (baseIRRFFinal > 2112.01) irrfNormal = baseIRRFFinal * 0.075 - 142.80;

    // Calcula IRRF simplificado
    let irrfSimplificado = 0;
    if (baseSimplificada > 4664.68) irrfSimplificado = baseSimplificada * 0.275 - 869.36;
    else if (baseSimplificada > 3751.06) irrfSimplificado = baseSimplificada * 0.225 - 636.13;
    else if (baseSimplificada > 2826.66) irrfSimplificado = baseSimplificada * 0.15 - 354.80;
    else if (baseSimplificada > 2112.01) irrfSimplificado = baseSimplificada * 0.075 - 142.80;

    // Usa o menor valor (mas nunca negativo)
    let irrf = Math.max(0, Math.min(irrfNormal, irrfSimplificado));
    descontos['IRRF'] = irrf;
    
    outrosDescontos.forEach((d) => {
        descontos[d.nome] = d.valor;
    });

    const totalDescontos = Object.values(descontos).reduce((a, b) => a + b, 0);
    const liquido = totalProventos - totalDescontos;

    return { proventos, descontos, liquido, totalProventos, totalDescontos };
}

function calculateGajMajorada(inputs, gajOptionValue = null) {
    const { vencimentoBasico, status, funpresp, funcaoComissionada, penosidade, ats, vpni, auxilioCreche, abonoPermanencia, dependentesIRRF, outrosDescontos, gajMajoradaPercent, cargo, contribuicaoPatrocinada, contribuicaoFacultativa, qual_graduacao, qual_certificacoes, qual_especializacao, qual_mestrado, qual_doutorado, qual_treinamento, orgao } = inputs;
    let proventos = {};
    
    const gajOptionSelecionada = gajOptionValue || document.querySelector('input[name="gajOption"]:checked')?.value;
    let vencimento, gaj, gas = 0, gae = 0, penosidadeValor = 0, atsValor = 0, valorAQ = 0, valorNovoAQ = 0, valorAT = 0;

    // 1. GAJ 165% + 5% no vencimento + Novo AQ
    if (gajOptionSelecionada === '1.65') {
        vencimento = vencimentoBasico * 1.05;
        gaj = vencimento * 1.65;
        proventos['Vencimento Básico'] = vencimento;
        proventos['GAJ (140%)'] = gaj;
    }
    // 2. GAJ 165% + 5% no vencimento
    else if (gajOptionSelecionada === 'gaj165SemAQ') {
        vencimento = vencimentoBasico * 1.05;
        gaj = vencimento * 1.65;
        proventos['Vencimento Básico'] = vencimento;
        proventos['GAJ (140%)'] = gaj;
        
        // AQ Antigo (mantém o AQ antigo em vez do Novo AQ)
        let aqPercent = 0;
        if (qual_doutorado > 0) aqPercent = 0.125;
        else if (qual_mestrado > 0) aqPercent = 0.10;
        else if (qual_especializacao > 0) aqPercent = 0.075;
        else if (qual_graduacao > 0) aqPercent = 0.05;
        valorAQ = vencimento * aqPercent;
        if (valorAQ > 0) proventos['Adicional de Qualificação'] = valorAQ;
        
        // AT Antigo (mantém o AT antigo)
        let atPercent = 0;
        if (status === 'ativo') {
            if (orgao === 'judiciario') {
                if (qual_treinamento >= 3) atPercent = 0.03;
                else if (qual_treinamento >= 2) atPercent = 0.02;
                else if (qual_treinamento >= 1) atPercent = 0.01;
            } else {
                if (qual_treinamento >= 2) atPercent = 0.05;
                else if (qual_treinamento >= 1) atPercent = 0.025;
            }
        }
        valorAT = vencimento * atPercent;
        if (valorAT > 0) proventos['Adicional de Treinamento'] = valorAT;
    }
    // 3. 5% no vencimento + Novo AQ
    else if (gajOptionSelecionada === 'apenas5') {
        vencimento = vencimentoBasico * 1.05;
        gaj = vencimento * 1.40;
        proventos['Vencimento Básico'] = vencimento;
        proventos['GAJ (140%)'] = gaj;
    }
    // 4. Novo AQ
    else if (gajOptionSelecionada === 'novoAQ') {
        vencimento = vencimentoBasico;
        gaj = vencimentoBasico * 1.40;
        proventos['Vencimento Básico'] = vencimento;
        proventos['GAJ (140%)'] = gaj;
    }

    // GAS/GAE
    if (status === 'ativo') {
        if (["Agente de Polícia", "Inspetor de Polícia"].includes(cargo)) {
            if (orgao === 'judiciario') {
                if (funcaoComissionada === 0) {
                    gas = vencimento * 0.35;
                }
            } else {
                gas = vencimento * 0.35;
            }
        }
        if (cargo === 'Oficial de Justiça') gae = vencimento * 0.35;
    }
    if (gas > 0) proventos['GAS (35%)'] = gas;
    if (gae > 0) proventos['GAE (35%)'] = gae;
    if (funcaoComissionada > 0) proventos['Função de Confiança'] = funcaoComissionada;

    // Penosidade, ATS, VPNI
    penosidadeValor = vencimento * penosidade;
    if (penosidadeValor > 0) proventos['Penosidade'] = penosidadeValor;
    atsValor = vencimento * (ats / 100);
    if (atsValor > 0) proventos['ATS'] = atsValor;
    if (vpni > 0) proventos['VPNI'] = vpni;

    // Novo AQ
    let vrsFinal = 0;
    if (qual_doutorado > 0) {
        vrsFinal = 5;
        if (status === 'ativo' && qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
    } else if (qual_mestrado > 0) {
        vrsFinal = 3.5;
        if (status === 'ativo' && qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
    } else if (qual_graduacao > 0 && ['Técnico', 'Técnico TI', 'Agente de Polícia'].includes(cargo) && qual_especializacao > 0 && qual_treinamento >= 3) {
        vrsFinal = 1 + 1 + 0.6;
    } else if (qual_graduacao > 0 && ['Técnico', 'Técnico TI', 'Agente de Polícia'].includes(cargo) && qual_certificacoes >= 2 && qual_treinamento >= 3) {
        vrsFinal = 1 + 1 + 0.6;
    } else if (qual_graduacao > 0 && ['Técnico', 'Técnico TI', 'Agente de Polícia'].includes(cargo) && qual_especializacao > 0) {
        vrsFinal = 1 + 1;
    } else if (qual_graduacao > 0 && ['Técnico', 'Técnico TI', 'Agente de Polícia'].includes(cargo) && qual_certificacoes > 0) {
        vrsFinal = 1 + Math.min(qual_certificacoes, 2) * 0.5;
    } else if (qual_graduacao > 0 && ['Técnico', 'Técnico TI', 'Agente de Polícia'].includes(cargo)) {
        vrsFinal = 1;
    } else if (qual_especializacao > 0) {
        vrsFinal = Math.min(qual_especializacao, 2);
        if (status === 'ativo' && qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
    } else {
        if (qual_certificacoes > 0) vrsFinal += Math.min(qual_certificacoes, 2) * 0.5;
        if (status === 'ativo' && qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
    }
    valorNovoAQ = vrsFinal * valorVR;
    if (valorNovoAQ > 0 && gajOptionSelecionada !== 'gaj165SemAQ') {
        proventos[`Novo AQ (${vrsFinal.toFixed(1)} VRs)`] = valorNovoAQ;
    }

    if (status === 'ativo') proventos['Auxílio Alimentação'] = auxilioAlimentacao;
    const valorCreche = auxilioCreche * auxilioCrecheValor;
    if (valorCreche > 0) proventos['Auxílio Pré-Escolar'] = valorCreche;

    // BASES DE CÁLCULO
    let baseCalculoPSS = 0, baseCalculoIRPF = 0;
    if (gajOptionSelecionada === '1.65') {
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni + valorNovoAQ;
        baseCalculoIRPF = baseCalculoPSS + gas;
    } else if (gajOptionSelecionada === 'gaj165SemAQ') {
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni + valorAQ;
        baseCalculoIRPF = baseCalculoPSS + gas + valorAT;
    } else if (gajOptionSelecionada === 'apenas5') {
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni + valorNovoAQ;
        baseCalculoIRPF = baseCalculoPSS + gas;
    } else if (gajOptionSelecionada === 'novoAQ') {
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni + valorNovoAQ;
        baseCalculoIRPF = baseCalculoPSS + gas;
    }

    let descontos = {};
    const pss = calcularPSS(baseCalculoPSS, funpresp, status);
    descontos['PSS (Progressivo)'] = pss;

    if (contribuicaoPatrocinada > 0) {
        const tetoINSS = 8157.41;
        const salarioBruto = baseCalculoPSS;
        const baseFunpresp = Math.max(0, salarioBruto - tetoINSS);
        const contribPatrocinada = baseFunpresp * (contribuicaoPatrocinada / 100);
        descontos[`Contribuição Patrocinada (${contribuicaoPatrocinada}%)`] = contribPatrocinada;
    }

    if (contribuicaoFacultativa > 0) {
        const tetoINSS = 8157.41;
        const salarioBruto = baseCalculoPSS;
        const baseFunpresp = Math.max(0, salarioBruto - tetoINSS);
        const contribFacultativa = baseFunpresp * (contribuicaoFacultativa / 100);
        descontos[`Contribuição Facultativa (${contribuicaoFacultativa}%)`] = contribFacultativa;
    }

    if (abonoPermanencia === 'sim' && status === 'aposentado') {
        proventos['Abono de Permanência'] = pss;
        baseCalculoIRPF += pss;
    }

    const totalProventos = Object.values(proventos).reduce((a, b) => a + b, 0);
    const deducaoDependentesTotal = dependentesIRRF * deducaoDependenteIRRF;
    let baseIRRFFinal = baseCalculoIRPF - pss - deducaoDependentesTotal;

    // Desconto simplificado (maio/2023 em diante)
    const descontoSimplificado = 528.00;
    let baseSimplificada = baseCalculoIRPF - pss - descontoSimplificado;

    // Calcula IRRF normal
    let irrfNormal = 0;
    if (baseIRRFFinal > 4664.68) irrfNormal = baseIRRFFinal * 0.275 - 869.36;
    else if (baseIRRFFinal > 3751.06) irrfNormal = baseIRRFFinal * 0.225 - 636.13;
    else if (baseIRRFFinal > 2826.66) irrfNormal = baseIRRFFinal * 0.15 - 354.80;
    else if (baseIRRFFinal > 2112.01) irrfNormal = baseIRRFFinal * 0.075 - 142.80;

    // Calcula IRRF simplificado
    let irrfSimplificado = 0;
    if (baseSimplificada > 4664.68) irrfSimplificado = baseSimplificada * 0.275 - 869.36;
    else if (baseSimplificada > 3751.06) irrfSimplificado = baseSimplificada * 0.225 - 636.13;
    else if (baseSimplificada > 2826.66) irrfSimplificado = baseSimplificada * 0.15 - 354.80;
    else if (baseSimplificada > 2112.01) irrfSimplificado = baseSimplificada * 0.075 - 142.80;

    // Usa o menor valor (mas nunca negativo)
    let irrf = Math.max(0, Math.min(irrfNormal, irrfSimplificado));
    descontos['IRRF'] = irrf;
    
    outrosDescontos.forEach((d) => {
        descontos[d.nome] = d.valor;
    });

    const totalDescontos = Object.values(descontos).reduce((a, b) => a + b, 0);
    const liquido = totalProventos - totalDescontos;

    return { proventos, descontos, liquido, totalProventos, totalDescontos };
}

function formatResults(results) {
    if (!results || typeof results.totalProventos !== 'number') return "Aguardando cálculo...";
    
    let output = '<table style="width: 100%; border-collapse: collapse; font-size: 0.95em; color: #666;">';
    
    // Proventos
    output += '<tr><td colspan="2" style="padding: 6px 0; font-weight: 500; color: #555; border-bottom: 1px solid #eee; font-size: 1em;">Proventos:</td></tr>';
    for (const [key, value] of Object.entries(results.proventos)) {
        if (typeof value === 'number' && !isNaN(value)) {
            output += `<tr><td style="padding: 3px 8px 3px 0; text-align: left; font-size: 0.95em;">${key}:</td><td style="padding: 3px 0; text-align: right; font-family: monospace; font-size: 0.95em;">${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>`;
        }
    }
    output += `<tr><td style="padding: 6px 8px 6px 0; font-weight: 500; border-top: 1px solid #eee; font-size: 0.95em;">Total Proventos:</td><td style="padding: 6px 0; text-align: right; font-weight: 500; border-top: 1px solid #eee; font-family: monospace; font-size: 0.95em;">${results.totalProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>`;
    
    // Descontos
    output += '<tr><td colspan="2" style="padding: 10px 0 6px 0; font-weight: 500; color: #555; border-bottom: 1px solid #eee; font-size: 1em;">Descontos:</td></tr>';
    for (const [key, value] of Object.entries(results.descontos)) {
        if (typeof value === 'number' && !isNaN(value)) {
            output += `<tr><td style="padding: 3px 8px 3px 0; text-align: left; font-size: 0.95em;">${key}:</td><td style="padding: 3px 0; text-align: right; font-family: monospace; font-size: 0.95em;">${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>`;
        }
    }
    output += `<tr><td style="padding: 6px 8px 6px 0; font-weight: 500; border-top: 1px solid #eee; font-size: 0.95em;">Total Descontos:</td><td style="padding: 6px 0; text-align: right; font-weight: 500; border-top: 1px solid #eee; font-family: monospace; font-size: 0.95em;">${results.totalDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>`;
    
    // Líquido
    output += `<tr><td colspan="2" style="padding: 10px 0 6px 0; font-weight: 600; color: #2c3e50; border-top: 2px solid #3498db; border-bottom: 1px solid #3498db; font-size: 1em;">Líquido a Receber:</td></tr>`;
    output += `<tr><td colspan="2" style="padding: 6px 0; text-align: right; font-weight: 600; color: #2c3e50; font-family: monospace; font-size: 1.2em;">${results.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>`;
    
    output += '</table>';
    
    return output;
}

function formatResultsComparativoPropostas(inputs) {
    // Calcula a situação atual
    const situacaoAtual = calculateSituacaoAtual(inputs);
    
    // Calcula os resultados das 3 propostas
    const opcoes = [
        { id: 'gaj165', value: '1.65', label: 'GAJ 165% + 5% + Novo AQ' },
        { id: 'gaj165SemAQ', value: 'gaj165SemAQ', label: 'GAJ 165% + 5%' },
        { id: 'novoAQ', value: 'novoAQ', label: 'Novo AQ' }
    ];
    const resultados = opcoes.map(opcao => ({
        label: opcao.label,
        resultado: calculateGajMajorada(inputs, opcao.value)
    }));
    
    // Descobrir todos os proventos possíveis (incluindo situação atual)
    const todosProventos = new Set();
    Object.keys(situacaoAtual.proventos).forEach(p => todosProventos.add(p));
    resultados.forEach(r => Object.keys(r.resultado.proventos).forEach(p => todosProventos.add(p)));
    
    // Montar tabela com estilo profissional e clean
    let html = '<div style="overflow-x:auto; margin: 20px 0;"><table style="width: 100%; border-collapse: collapse; font-size: 0.9em; color: #333; border: 1px solid #d1d5db; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);"><thead><tr><th style="text-align:left;padding:12px 16px;font-weight:600;font-size:0.85em;border-bottom:2px solid #e5e7eb;color:#374151;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">Rubricas</th>';
    html += `<th style='padding:12px 16px;font-weight:600;font-size:0.85em;border-bottom:2px solid #e5e7eb;color:#374151;text-align:center;line-height:1.4;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'>Situação Atual</th>`;
    resultados.forEach((r, index) => {
        html += `<th style='padding:12px 16px;font-weight:600;font-size:0.85em;border-bottom:2px solid #e5e7eb;color:#374151;text-align:center;line-height:1.4;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'>${r.label}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    todosProventos.forEach((provento, index) => {
        const isEven = index % 2 === 0;
        const bgColor = isEven ? '#ffffff' : '#fafbfc';
        const rubricaText = provento === 'GAJ (140%)' ? 'GAJ' : provento;
        html += `<tr style='background:${bgColor};'><td style='text-align:left;padding:3px 0 3px 12px;font-size:0.95em;color:#666;'>${rubricaText}</td>`;
        
        // Situação Atual
        const valorAtual = situacaoAtual.proventos[provento];
        const valorAtualFormatado = valorAtual !== undefined ? valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
        html += `<td style='padding:3px 20px;text-align:right;font-family:monospace;font-size:0.95em;color:#666;'>${valorAtualFormatado}</td>`;
        
        // Propostas
        resultados.forEach(r => {
            const valor = r.resultado.proventos[provento];
            const valorFormatado = valor !== undefined ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
            html += `<td style='padding:3px 20px;text-align:right;font-family:monospace;font-size:0.95em;color:#666;'>${valorFormatado}</td>`;
        });
        html += '</tr>';
    });
    
    // Linha divisória antes do Total Proventos
    html += `<tr><td colspan='${resultados.length + 2}' style='border-bottom:1px solid #eee;height:8px;background:transparent;'></td></tr>`;
    
    // Total Proventos
    html += `<tr><td style='text-align:left;padding:6px 0 6px 12px;font-weight:500;border-top:1px solid #eee;font-size:0.95em;color:#666;'>Total Bruto</td>`;
    
    // Total Proventos - Situação Atual
    const totalAtualFormatado = situacaoAtual.totalProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    html += `<td style='padding:6px 20px;text-align:right;font-weight:500;border-top:1px solid #eee;font-family:monospace;font-size:0.95em;color:#666;'>${totalAtualFormatado}</td>`;
    
    // Total Proventos - Propostas
    resultados.forEach((r, index) => {
        const valorFormatado = r.resultado.totalProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        html += `<td style='padding:6px 20px;text-align:right;font-weight:500;border-top:1px solid #eee;font-family:monospace;font-size:0.95em;color:#666;'>${valorFormatado}</td>`;
    });
    html += '</tr>';
    
    // Descontos
    // Descobrir todos os descontos possíveis
    const todosDescontos = new Set();
    Object.keys(situacaoAtual.descontos).forEach(d => todosDescontos.add(d));
    resultados.forEach(r => Object.keys(r.resultado.descontos).forEach(d => todosDescontos.add(d)));
    
    // Linha divisória antes dos Descontos
    html += `<tr><td colspan='${resultados.length + 2}' style='border-bottom:1px solid #eee;height:12px;background:transparent;'></td></tr>`;
    
    // Título Descontos
    html += `<tr><td colspan='${resultados.length + 2}' style='padding:8px 0 6px 12px;font-weight:500;color:#555;border-bottom:1px solid #eee;font-size:1em;text-align:left;'>Descontos:</td></tr>`;
    
    todosDescontos.forEach((desconto, index) => {
        const isEven = index % 2 === 0;
        const bgColor = isEven ? '#ffffff' : '#fafbfc';
        const descontoText = desconto === 'PSS (Progressivo)' ? 'PSS' : desconto;
        html += `<tr style='background:${bgColor};'><td style='text-align:left;padding:3px 0 3px 12px;font-size:0.95em;color:#666;'>${descontoText}</td>`;
        
        // Situação Atual
        const valorAtual = situacaoAtual.descontos[desconto];
        const valorAtualFormatado = valorAtual !== undefined ? valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
        html += `<td style='padding:3px 20px;text-align:right;font-family:monospace;font-size:0.95em;color:#666;'>${valorAtualFormatado}</td>`;
        
        // Propostas
        resultados.forEach(r => {
            const valor = r.resultado.descontos[desconto];
            const valorFormatado = valor !== undefined ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
            html += `<td style='padding:3px 20px;text-align:right;font-family:monospace;font-size:0.95em;color:#666;'>${valorFormatado}</td>`;
        });
        html += '</tr>';
    });
    
    // Total Descontos
    html += `<tr><td style='text-align:left;padding:6px 0 6px 12px;font-weight:500;border-top:1px solid #eee;font-size:0.95em;color:#666;'>Total Descontos</td>`;
    
    // Total Descontos - Situação Atual
    const totalDescontosAtualFormatado = situacaoAtual.totalDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    html += `<td style='padding:6px 20px;text-align:right;font-weight:500;border-top:1px solid #eee;font-family:monospace;font-size:0.95em;color:#666;'>${totalDescontosAtualFormatado}</td>`;
    
    // Total Descontos - Propostas
    resultados.forEach((r, index) => {
        const valorFormatado = r.resultado.totalDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        html += `<td style='padding:6px 20px;text-align:right;font-weight:500;border-top:1px solid #eee;font-family:monospace;font-size:0.95em;color:#666;'>${valorFormatado}</td>`;
    });
    html += '</tr>';
    
    // Linha divisória antes do Líquido
    html += `<tr><td colspan='${resultados.length + 2}' style='border-bottom:1px solid #eee;height:12px;background:transparent;'></td></tr>`;
    
    // Adicionar linha com Líquido a Receber
    html += `<tr style='background:#f0f4f8;'><td style='text-align:left;padding:12px 0 12px 12px;font-weight:700;color:#1e3a8a;border-top:2px solid #3b82f6;border-bottom:2px solid #3b82f6;font-size:1em;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'>Líquido Total</td>`;
    
    // Líquido - Situação Atual
    const liquidoAtualFormatado = situacaoAtual.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    html += `<td style='padding:12px 20px;text-align:right;font-weight:700;color:#1e3a8a;border-top:2px solid #3b82f6;border-bottom:2px solid #3b82f6;font-family:monospace;font-size:0.95em;'><div style='text-align:right;margin-bottom:4px;height:20px;line-height:20px;'>${liquidoAtualFormatado}</div><div style='text-align:right;font-size:0.8em;color:#1e3a8a;height:16px;line-height:16px;'>&nbsp;</div></td>`;
    
    // Líquido - Propostas
    resultados.forEach((r, index) => {
        const valorFormatado = r.resultado.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const aumento = r.resultado.liquido - situacaoAtual.liquido;
        const percentual = (aumento / situacaoAtual.liquido) * 100;
        const aumentoFormatado = aumento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const percentualFormatado = percentual.toFixed(1);
        const sinal = aumento >= 0 ? '+' : '';
        
        html += `<td style='padding:12px 20px;text-align:right;font-weight:700;color:#000000;border-top:2px solid #3b82f6;border-bottom:2px solid #3b82f6;font-family:monospace;font-size:0.95em;'><div style='text-align:right;margin-bottom:4px;height:20px;line-height:20px;'>${valorFormatado}</div><div style='text-align:right;font-size:0.7em;color:#666;height:16px;line-height:16px;'>${sinal}${aumentoFormatado} (<span style='color:#059669;'>${sinal}${percentualFormatado}%</span>)</div></td>`;
    });
    html += '</tr>';
    
    html += '</tbody></table></div>';
    return html;
}

function calculateAndDisplay() {
    try {
        const inputs = getFormValues();
        const resultsAtual = calculateSituacaoAtual(inputs);
        
        const resultadoAtualElement = document.getElementById('resultado-atual');
        const resultadoGajElement = document.getElementById('resultado-gaj-conteudo');
        
        if (resultadoAtualElement) {
            resultadoAtualElement.innerHTML = formatResults(resultsAtual);
        }
        
        if (resultadoGajElement) {
            resultadoGajElement.innerHTML = formatResultsComparativoPropostas(inputs);
        }
        
    } catch (error) {
        console.error('Erro no cálculo:', error);
        const resultadoAtualElement = document.getElementById('resultado-atual');
        const resultadoGajElement = document.getElementById('resultado-gaj-conteudo');
        
        if (resultadoAtualElement) {
            resultadoAtualElement.innerHTML = '<div style="color:red;font-weight:bold">Erro no cálculo:<br>' + error.message + '</div>';
        }
        if (resultadoGajElement) {
            resultadoGajElement.innerHTML = '<div style="color:red;font-weight:bold">Erro no cálculo:<br>' + error.message + '</div>';
        }
    }
}

function updateContribuicoes() {
    const funpresp = document.querySelector('input[name="funpresp"]:checked')?.value;
    const patrocinadaGroup = document.getElementById('contribuicao-patrocinada-group');
    const facultativaGroup = document.getElementById('contribuicao-facultativa-group');
    
    if (funpresp === 'sim') {
        patrocinadaGroup.style.display = 'block';
        facultativaGroup.style.display = 'block';
    } else {
        patrocinadaGroup.style.display = 'none';
        facultativaGroup.style.display = 'none';
        document.getElementById('contribuicaoPatrocinada').value = '0';
        document.getElementById('contribuicaoFacultativa').value = '0';
    }
    calculateAndDisplay();
}

function updateAbonoPermanencia() {
    const statusRadio = document.querySelector('input[name="status"]:checked');
    const status = statusRadio ? statusRadio.value : 'ativo';
    const abonoRadios = document.querySelectorAll('input[name="abonoPermanencia"]');
    const abonoGroup = abonoRadios[0]?.closest('.form-group');
    
    if (status === 'ativo') {
        abonoRadios.forEach(radio => {
            radio.disabled = true;
            if (radio.value === 'nao') radio.checked = true;
        });
        if (abonoGroup) abonoGroup.style.opacity = '0.5';
    } else {
        abonoRadios.forEach(radio => {
            radio.disabled = false;
        });
        if (abonoGroup) abonoGroup.style.opacity = '1';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        document.querySelectorAll('input[name="orgao"]').forEach(radio => {
            radio.addEventListener('change', () => {
                updateFuncaoComissionada();
                calculateAndDisplay();
            });
        });

        document.querySelectorAll('input[name="funpresp"]').forEach(radio => {
            radio.addEventListener('change', updateContribuicoes);
        });

        document.querySelectorAll('input[name="status"]').forEach(radio => {
            radio.addEventListener('change', () => {
                updateAbonoPermanencia();
                calculateAndDisplay();
            });
        });

        document.querySelectorAll('input[name="gajOption"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    const gajValue = radio.value;
                    if (gajValue === 'apenas5') {
                        document.getElementById('apenasGajAumento').checked = true;
                        document.getElementById('gajMajoradaPercent').value = '1.65';
                    } else {
                        document.getElementById('apenasGajAumento').checked = false;
                        document.getElementById('gajMajoradaPercent').value = gajValue;
                    }
                    calculateAndDisplay();
                }
            });
        });

        const firstRadio = document.querySelector('input[name="gajOption"]');
        if (firstRadio) {
            firstRadio.checked = true;
            if (firstRadio.value === 'apenas5') {
                document.getElementById('apenasGajAumento').checked = true;
                document.getElementById('gajMajoradaPercent').value = '1.65';
            } else {
                document.getElementById('apenasGajAumento').checked = false;
                document.getElementById('gajMajoradaPercent').value = firstRadio.value;
            }
        }

        updateFuncaoComissionada();
        updateContribuicoes();
        updateAbonoPermanencia();
        calculateAndDisplay();

        document.addEventListener('change', calculateAndDisplay);
        document.addEventListener('input', calculateAndDisplay);
        
        const addDescontoBtn = document.getElementById('add-desconto');
        if (addDescontoBtn) {
            addDescontoBtn.addEventListener('click', addDesconto);
        }
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
}); 
