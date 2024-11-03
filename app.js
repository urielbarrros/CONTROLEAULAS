let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function salvarDados() {
    localStorage.setItem("alunos", JSON.stringify(alunos));
}

function cadastrarAluno() {
    const nome = document.getElementById("nome").value.trim();
    if (nome === "") return alert("Insira um nome válido.");
    if (alunos.some(aluno => aluno.nome === nome)) {
        alert("Aluno já cadastrado.");
        return;
    }

    alunos.push({ nome, horas: 0, minutos: 0, valorAcumulado: 0, registros: [] });
    document.getElementById("nome").value = "";
    atualizarListaAlunos();
    salvarDados();
}

function adicionarHoras(nome) {
    const data = prompt(`Digite a data (DD/MM) para ${nome}:`);
    const tempo = prompt(`Digite as horas no formato H:MM para ${nome}:`);
    const [h, m] = tempo.split(":").map(Number);

    if (isNaN(h) || isNaN(m) || h < 0 || m < 0 || m >= 60) {
        alert("Formato de tempo inválido. Use H:MM, onde H são horas e MM são minutos entre 0 e 59.");
        return;
    }

    const aluno = alunos.find(aluno => aluno.nome === nome);

    // Calcula o total de horas e minutos
    aluno.horas += h;
    aluno.minutos += m;
    aluno.valorAcumulado = (aluno.horas + aluno.minutos / 60) * 50;

    // Ajusta horas e minutos acumulados para que os minutos não ultrapassem 59
    aluno.horas += Math.floor(aluno.minutos / 60);
    aluno.minutos = aluno.minutos % 60;

    aluno.registros.push({ data, horas: h, minutos: m });

    atualizarListaAlunos();
    salvarDados();
}

function formatarTempo(horas, minutos) {
    return `${horas}:${minutos.toString().padStart(2, '0')}`;
}

function atualizarListaAlunos() {
    const alunosDiv = document.getElementById("alunos");
    alunosDiv.innerHTML = "";

    alunos.forEach((aluno, index) => {
        const alunoDiv = document.createElement("div");
        alunoDiv.classList.add("aluno");
        alunoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${aluno.nome}</p>
            <p><strong>Horas acumuladas:</strong> ${formatarTempo(aluno.horas, aluno.minutos)}</p>
            <p><strong>Valor acumulado:</strong> R$ ${aluno.valorAcumulado.toFixed(2)}</p>
            <div class="btn-group">
                <button onclick="adicionarHoras('${aluno.nome}')">Adicionar Horas</button>
                <button class="btn-danger" onclick="removerAluno(${index})">Remover Aluno</button>
            </div>
            <h4>Histórico de Inputs:</h4>
            <ul>
                ${aluno.registros.map(registro => `
                    <li>Data: ${registro.data}, Horas: ${registro.horas}:${registro.minutos.toString().padStart(2, '0')}</li>
                `).join('')}
            </ul>
        `;
        alunosDiv.appendChild(alunoDiv);
    });

    atualizarTotalAcumulado();
}

function removerAluno(index) {
    alunos.splice(index, 1);
    atualizarListaAlunos();
    salvarDados();
}

function atualizarTotalAcumulado() {
    const total = alunos.reduce((acc, aluno) => acc + aluno.valorAcumulado, 0);
    document.getElementById("totalAcumulado").innerText = total.toFixed(2);
}

function resetarContagem() {
    alunos.forEach(aluno => {
        aluno.horas = 0;
        aluno.minutos = 0;
        aluno.valorAcumulado = 0;
        aluno.registros = [];
    });
    atualizarListaAlunos();
    salvarDados();
}

// Carrega os dados quando a página é aberta
document.addEventListener("DOMContentLoaded", atualizarListaAlunos);