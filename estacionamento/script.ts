interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function (){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 6000);
        const sec = Math.floor((mil % 6000) / 1000 );

        return `${min}m e ${sec}s`;
    }

    function patio(){
        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
            
        }

        function salvar(veiculos: Veiculo[]){
           
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, salva?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete"  data-placa="${veiculo.placa}">X</button>
                </td>
            `;

            row.querySelector('.delete')?.addEventListener("click", function(){
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);
            
            if(salva){
                salvar([...ler(), veiculo])
            }
            
        }

        function remover(placa: string){
            const veiculoEncontrado = ler().find(veiculo => veiculo.placa === placa);
        
            if (!veiculoEncontrado) {
                console.log(`Veículo com placa ${placa} não encontrado`);
                return;
            }
        
            const { entrada, nome } = veiculoEncontrado;
        
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
        
            if(confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;
        
            salvar(ler().filter(veiculo => veiculo.placa !== placa));   
        }
        


        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return{ler, adicionar, remover, salvar, render};
    }

    patio().render();

    $("#cadastrar")?.addEventListener("click", () => {
        const nomeInput = $("#nome") as HTMLInputElement;
        const placaInput = $("#placa") as HTMLInputElement;
    
        const nome = nomeInput.value;
        const placa = placaInput.value;
    
        if(!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
    
        const veiculo: Veiculo = { nome, placa, entrada: new Date() };
        patio().adicionar(veiculo);
    });
})();

