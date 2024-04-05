(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 6000);
        const sec = Math.floor((mil % 6000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete"  data-placa="${veiculo.placa}">X</button>
                </td>
            `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva) {
                salvar([...ler(), veiculo]);
            }
        }
        function remover(placa) {
            const veiculoEncontrado = ler().find(veiculo => veiculo.placa === placa);
            if (!veiculoEncontrado) {
                console.log(`Veículo com placa ${placa} não encontrado`);
                return;
            }
            const { entrada, nome } = veiculoEncontrado;
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const nomeInput = $("#nome");
        const placaInput = $("#placa");
        const nome = nomeInput.value;
        const placa = placaInput.value;
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        const veiculo = { nome, placa, entrada: new Date() };
        patio().adicionar(veiculo);
    });
})();
