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
    // Verificações de existência dos campos
    const orgaoRadio = document.querySelector('input[name="orgao"]:checked');
    const cargoSelect = document.getElementById('cargo');
    const classeSelect = document.getElementById('classe');
    const funcaoComissionadaSelect = document.getElementById('funcaoComissionada');
    const statusRadio = document.querySelector('input[name="status"]:checked');
    const penosidadeSelect = document.getElementById('penosidade');
    const qualGraduacao = document.getElementById('qual_graduacao');
    const qualCertificacoes = document.getElementById('qual_certificacoes');
    const qualEspecializacao = document.getElementById('qual_especializacao');
    const qualMestrado = document.getElementById('qual_mestrado');
    const qualDoutorado = document.getElementById('qual_doutorado');
    const qualTreinamento = document.getElementById('qual_treinamento');
    const atsInput = document.getElementById('ats');
    const vpniInput = document.getElementById('vpni');
    const auxilioCrecheInput = document.getElementById('auxilioCreche');
    const dependentesIRRFInput = document.getElementById('dependentesIRRF');
    const contribuicaoPatrocinada = document.getElementById('contribuicaoPatrocinada');
    const contribuicaoFacultativa = document.getElementById('contribuicaoFacultativa');
    const abonoPermanenciaRadio = document.querySelector('input[name="abonoPermanencia"]:checked');
    const gajMajoradaPercent = document.getElementById('gajMajoradaPercent');

    if (!orgaoRadio || !cargoSelect || !classeSelect || !funcaoComissionadaSelect || !statusRadio ||
        !penosidadeSelect || !qualGraduacao || !qualCertificacoes || !qualEspecializacao || !qualMestrado || !qualDoutorado || !qualTreinamento ||
        !atsInput || !vpniInput || !auxilioCrecheInput || !dependentesIRRFInput || !contribuicaoPatrocinada || !contribuicaoFacultativa || !abonoPermanenciaRadio || !gajMajoradaPercent) {
        throw new Error('Um ou mais campos obrigatórios não estão presentes no formulário.');
    }

    // Agora pode acessar .value com segurança
    const orgao = orgaoRadio.value;
    const cargo = cargoSelect.value;
    const classe = parseInt(classeSelect.value);
    const funcaoComissionadaValor = parseFloat(funcaoComissionadaSelect.value) || 0;
    const isAtivo = statusRadio.value === 'ativo';
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
        penosidade: parseFloat(penosidadeSelect.value) || 0,
        qual_graduacao: parseInt(qualGraduacao.value) || 0,
        qual_certificacoes: parseInt(qualCertificacoes.value) || 0,
        qual_especializacao: parseInt(qualEspecializacao.value) || 0,
        qual_mestrado: parseInt(qualMestrado.value) || 0,
        qual_doutorado: parseInt(qualDoutorado.value) || 0,
        qual_treinamento: parseInt(qualTreinamento.value) || 0,
        ats: parseFloat(atsInput.value) || 0,
        vpni: parseFloat(vpniInput.value) || 0,
        auxilioCreche: parseInt(auxilioCrecheInput.value) || 0,
        dependentesIRRF: parseInt(dependentesIRRFInput.value) || 0,
        contribuicaoPatrocinada: parseFloat(contribuicaoPatrocinada.value) || 0,
        contribuicaoFacultativa: parseFloat(contribuicaoFacultativa.value) || 0,
        abonoPermanencia: abonoPermanenciaRadio.value,
        gas,
        gae,
        outrosDescontos,
        gajMajoradaPercent: parseFloat(gajMajoradaPercent.value) || 1.6,
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

    if (funcaoComissionada > 0) proventos['Função de Confiança'] = funcaoComissionada;
    if (gas > 0) proventos['GAS (35%)'] = gas;
    if (gae > 0) proventos['GAE (35%)'] = gae;
    
    const penosidadeValor = vencimentoBasico * penosidade;
    if (penosidadeValor > 0) proventos['Penosidade'] = penosidadeValor;
    
    let aqPercent = 0;
    if (qual_doutorado > 0) aqPercent = 0.125;
    else if (qual_mestrado > 0) aqPercent = 0.10;
    else if (qual_especializacao > 0) aqPercent = 0.075;
    else if (qual_graduacao > 0) aqPercent = 0.05;
    const valorAQ = vencimentoBasico * aqPercent;
    if (valorAQ > 0) proventos['Adicional de Qualificação'] = valorAQ;

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
        const salarioBruto = vencimentoBasico + gaj + funcaoComissionada + gae + penosidadeValor + valorAQ + atsValor + vpni;
        const baseFunpresp = Math.max(0, salarioBruto - tetoINSS);
        const contribPatrocinada = baseFunpresp * (contribuicaoPatrocinada / 100);
        descontos[`Contribuição Patrocinada (${contribuicaoPatrocinada}%)`] = contribPatrocinada;
    }

    if (contribuicaoFacultativa > 0) {
        const tetoINSS = 8157.41;
        const salarioBruto = vencimentoBasico + gaj + funcaoComissionada + gae + penosidadeValor + valorAQ + atsValor + vpni;
        const baseFunpresp = Math.max(0, salarioBruto - tetoINSS);
        const contribFacultativa = baseFunpresp * (contribuicaoFacultativa / 100);
        descontos[`Contribuição Facultativa (${contribuicaoFacultativa}%)`] = contribFacultativa;
    }

    if (abonoPermanencia === 'sim' && status === 'ativo') {
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
    // Se gajOptionValue for passado, usa ele, senão pega do radio selecionado
    const gajOptionSelecionada = gajOptionValue || document.querySelector('input[name="gajOption"]:checked')?.value;
    let vencimento, gaj, gas = 0, gae = 0, penosidadeValor = 0, atsValor = 0, valorAQ = 0, valorNovoAQ = 0;

    // 1. GAJ 165% + 5% no vencimento + Novo AQ
    if (gajOptionSelecionada === '1.65') {
        vencimento = vencimentoBasico * 1.05;
        gaj = vencimento * 1.65;
        proventos['Vencimento Básico (+5%)'] = vencimento;
        proventos['GAJ (165%)'] = gaj;
    }
    // 2. GAJ 165% + 5% no vencimento
    else if (gajOptionSelecionada === 'gaj165SemAQ') {
        vencimento = vencimentoBasico * 1.05;
        gaj = vencimento * 1.65;
        proventos['Vencimento Básico (+5%)'] = vencimento;
        proventos['GAJ (165%)'] = gaj;
    }
    // 3. 5% no vencimento + Novo AQ
    else if (gajOptionSelecionada === 'apenas5') {
        vencimento = vencimentoBasico * 1.05;
        gaj = vencimentoBasico * 1.40;
        proventos['Vencimento Básico (+5%)'] = vencimento;
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

    // Novo AQ (valorVR já está definido no escopo global)
    let vrsFinal = 0;
    if (qual_doutorado > 0) {
        vrsFinal = 5;
        if (qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
    } else if (qual_mestrado > 0) {
        vrsFinal = 3.5;
        if (qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
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
        if (qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
    } else {
        if (qual_certificacoes > 0) vrsFinal += Math.min(qual_certificacoes, 2) * 0.5;
        if (qual_treinamento > 0) vrsFinal += Math.min(qual_treinamento, 3) * 0.2;
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
        // GAJ 165% + 5% + Novo AQ
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni + valorNovoAQ;
        baseCalculoIRPF = baseCalculoPSS + gas;
    } else if (gajOptionSelecionada === 'gaj165SemAQ') {
        // GAJ 165% + 5%
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni;
        baseCalculoIRPF = baseCalculoPSS + gas;
    } else if (gajOptionSelecionada === 'apenas5') {
        // 5% + Novo AQ
        baseCalculoPSS = vencimento + gaj + funcaoComissionada + gae + penosidadeValor + atsValor + vpni + valorNovoAQ;
        baseCalculoIRPF = baseCalculoPSS + gas;
    } else if (gajOptionSelecionada === 'novoAQ') {
        // Novo AQ
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

    if (abonoPermanencia === 'sim' && status === 'ativo') {
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

function calculateAndDisplay() {
    try {
        const inputs = getFormValues();
        const resultsAtual = calculateSituacaoAtual(inputs);
        const liquidoAtual = resultsAtual.liquido;

        // Para cada proposta, calcular o líquido e o aumento percentual
        const opcoes = [
            { id: 'gaj165', value: '1.65', label: 'GAJ 165% + 5% no vencimento + Novo AQ' },
            { id: 'gaj165SemAQ', value: 'gaj165SemAQ', label: 'GAJ 165% + 5% no vencimento' },
            { id: 'apenasGajAumento', value: 'apenas5', label: '5% no vencimento + Novo AQ' },
            { id: 'novoAQ', value: 'novoAQ', label: 'Novo AQ' }
        ];

        opcoes.forEach(opcao => {
            const radio = document.getElementById(opcao.id);
            const label = document.querySelector('label[for="' + opcao.id + '"]');
            if (radio && label) {
                // Simula o cálculo para cada proposta sem alterar o checked
                let valorGaj = radio.value;
                if (opcao.id === 'apenasGajAumento') valorGaj = 'apenas5';
                const resultadoProposta = calculateGajMajorada(getFormValues(), valorGaj);
                const liquidoProposta = resultadoProposta.liquido;
                const brutoProposta = resultadoProposta.totalProventos;
                let aumentoLiquido = 0;
                let aumentoBruto = 0;
                if (liquidoAtual > 0) {
                    aumentoLiquido = ((liquidoProposta - liquidoAtual) / liquidoAtual) * 100;
                }
                if (resultsAtual.totalProventos > 0) {
                    aumentoBruto = ((brutoProposta - resultsAtual.totalProventos) / resultsAtual.totalProventos) * 100;
                }
                let textoAumento = '';
                if (!isNaN(aumentoLiquido) && isFinite(aumentoLiquido) && !isNaN(aumentoBruto) && isFinite(aumentoBruto)) {
                    textoAumento = `<span class='percent-aumento'><span class='percent-liquido'>Líquido: +${aumentoLiquido.toFixed(1)}%</span><span class='percent-sep'>|</span><span class='percent-bruto'>Bruto: +${aumentoBruto.toFixed(1)}%</span></span>`;
                }
                label.innerHTML = `<span class='label-proposta'>${opcao.label}</span>${textoAumento}`;
            }
        });

        // Restaurar o radio selecionado pelo usuário
        const selecionado = document.querySelector('input[name="gajOption"]:checked');
        if (selecionado) selecionado.checked = true;
        // Atualizar título do card SEMPRE fixo
        const cardTitle = document.getElementById('gaj-card-title');
        cardTitle.textContent = 'Propostas de reajustes';
        // Se quiser, pode exibir um subtítulo dinâmico abaixo dos botões, mas não alterar o título principal

        document.getElementById('resultado-atual').innerHTML = formatResults(resultsAtual);
        document.getElementById('resultado-gaj-conteudo').innerHTML = formatResults(calculateGajMajorada(inputs));
    } catch (error) {
        console.error('Erro no cálculo:', error);
        document.getElementById('resultado-atual').innerHTML = '<div style="color:red;font-weight:bold">Erro no cálculo:<br>' + error.message + '<br><pre>' + (error.stack || '') + '</pre></div>';
        document.getElementById('resultado-gaj-conteudo').innerHTML = '<div style="color:red;font-weight:bold">Erro no cálculo:<br>' + error.message + '<br><pre>' + (error.stack || '') + '</pre></div>';
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

        // Adicionar listeners para os radio buttons da GAJ
        document.querySelectorAll('input[name="gajOption"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    const gajValue = radio.value;
                    if (gajValue === 'apenas5') {
                        // Modo: apenas 5% no vencimento
                        document.getElementById('apenasGajAumento').checked = true;
                        document.getElementById('gajMajoradaPercent').value = '1.40'; // GAJ padrão 140%
                    } else {
                        document.getElementById('apenasGajAumento').checked = false;
                        document.getElementById('gajMajoradaPercent').value = gajValue;
                    }
                    calculateAndDisplay();
                }
            });
        });

        // Selecionar primeira opção por padrão
        const firstRadio = document.querySelector('input[name="gajOption"]');
        if (firstRadio) {
            firstRadio.checked = true;
            if (firstRadio.value === 'apenas5') {
                document.getElementById('apenasGajAumento').checked = true;
                document.getElementById('gajMajoradaPercent').value = '1.40';
            } else {
                document.getElementById('apenasGajAumento').checked = false;
                document.getElementById('gajMajoradaPercent').value = firstRadio.value;
            }
        }

        updateFuncaoComissionada();
        updateContribuicoes();
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

function updateContribuicoes() {
    const regime = document.querySelector('input[name="funpresp"]:checked').value;
    const patrocinada = document.getElementById('contribuicao-patrocinada-group');
    const facultativa = document.getElementById('contribuicao-facultativa-group');
    const selectPatrocinada = document.getElementById('contribuicaoPatrocinada');
    const inputFacultativa = document.getElementById('contribuicaoFacultativa');
    
    if (regime === 'sim') {
        patrocinada.style.display = '';
        facultativa.style.display = '';
    } else {
        patrocinada.style.display = 'none';
        facultativa.style.display = 'none';
        // Zerar as contribuições quando voltar para RPPS
        selectPatrocinada.value = '0';
        inputFacultativa.value = '0';
    }
    calculateAndDisplay();
}

// ... (restante do JS do simulador, igual ao fornecido) ... 