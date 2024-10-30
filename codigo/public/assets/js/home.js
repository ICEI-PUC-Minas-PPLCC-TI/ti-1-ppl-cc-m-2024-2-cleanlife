const urlForuns = '/foruns';
let foruns = [];

// Chama as funções de carregamento ao iniciar a página
carregarForuns(() => {
    carregaDados();
});

// Função para carregar todos os fóruns
async function carregarForuns(callback) {
    try {
        const response = await fetch(urlForuns);
        foruns = await response.json(); // Armazena os fóruns carregados
        console.log('Fóruns carregados com sucesso!');
        if (callback) callback();
    } catch (error) {
        console.error('Erro ao ler fóruns via API JSONServer:', error);
    }
}
// Função para carregar os dados de um fórum específico
function carregaDados(){
    const divForuns  = document.getElementById('foruns'); 
    foruns.forEach(forum => {
        divForuns.innerHTML += `<a class="forum" href="forum.html?id=${forum.id}">
                                    <div>
                                        <h3>${forum.titulo}</h3>
                                        <p>Descrição:${forum.descricao}</p>
                                        <p>Objetivo:${forum.objetivo}</p>
                                    </div>
                                </a>`;
    });
    document.getElementById("criarNovoForum").addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o comportamento padrão de envio do formulário

        let tituloInput = document.getElementById("tituloInput").value;
        if (tituloInput.trim() === "") {
            alert("Por favor, escreva um comentário antes de enviar.");
            return;
        }
        let descricaoInput = document.getElementById("descricaoInput").value;
        if (descricaoInput.trim() === "") {
            alert("Por favor, escreva um comentário antes de enviar.");
            return;
        }
        let objetivoInput = document.getElementById("objetivoInput").value;
        if (objetivoInput.trim() === "") {
            alert("Por favor, escreva um comentário antes de enviar.");
            return;
        }

        let novoForum = {
            id: foruns.length > 0 ? Math.max(...foruns.map(c => c.id)) + 1 : 1, // Garante um novo ID único
            titulo: tituloInput,
            descricao: descricaoInput,
            objetivo: objetivoInput,
            usuarioAdministrador: {
                id: usuarioCorrente.id,
                login: usuarioCorrente.login
            }
        };

        // Adiciona o novo comentário ao JSON
        fetch(urlForuns, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoForum)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Fórum adicionado com sucesso:", data);
            // Atualiza a lista de comentários na interface
            divForuns.innerHTML += `<a href="forum.html?id=${novoForum.id}">
                                        <div class="forum">
                                            <h3>${novoForum.titulo}</h3>
                                            <p>Descrição:${novoForum.descricao}</p>
                                            <p>Objetivo:${novoForum.objetivo}</p>
                                        </div>
                                    </a>`;
            // Limpar o formulário
            document.getElementById("tituloInput").value = "";
            document.getElementById("descricaoInput").value = "";
            document.getElementById("objetivoInput").value = "";
            carregarForuns();
        })
        .catch(error => {
            console.error("Erro ao adicionar fórum:", error);
        });
    }); 
}
