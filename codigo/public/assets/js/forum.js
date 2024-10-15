const urlForuns = '/foruns';
const urlComentarios = '/comentarios'; // URL para os comentários
let foruns = [];
let comentarios = [];

// Chama as funções de carregamento ao iniciar a página
carregarForuns(() => {
    carregarComentarios(() => {
        carregaDadosForum();
    });
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

// Função para carregar todos os comentários
async function carregarComentarios(callback) {
    try {
        const response = await fetch(urlComentarios);
        comentarios = await response.json(); // Armazena os comentários carregados
        console.log('Comentários carregados com sucesso!');
        if (callback) callback();
    } catch (error) {
        console.error('Erro ao ler comentários via API JSONServer:', error);
    }
}

// Função para carregar os dados de um fórum específico
function carregaDadosForum() {
    let params = new URLSearchParams(location.search);
    let forumId = params.get('id'); // Extrai o ID do fórum dos parâmetros da URL
    const forumContainer = document.getElementById('forum-container');

    // Encontra o fórum pelo ID
    const forum = foruns.find(f => f.id == forumId);

    // Se o fórum não for encontrado
    if (!forum) {
        forumContainer.innerHTML = '<p>Fórum não encontrado!</p>';
        return;
    }

    // Título do fórum
    const titulo = document.getElementById('forum-titulo');
    titulo.innerHTML = `<h2>${forum.titulo}</h2>`;

    // Cria a descrição do fórum
    const descricao = document.getElementById('descricao');
    descricao.innerHTML = `<p>${forum.descricao}</p>`;

    // Filtra os comentários pertencentes a este fórum
    const comentariosDoForum = comentarios.filter(comentario => comentario.forum_id == forumId);
    const comments = document.getElementById('comments');

    comentariosDoForum.forEach(comentario => {
        if (comentario.comentario_pai_id == null) {
            comments.innerHTML += `<div class="comment">
                                        <strong>${comentario.usuario.login}:</strong>
                                        <p>${comentario.conteudo}</p>
                                    </div>`;
        }
    });

    // Campo para adicionar novo comentário
    document.getElementById("novoComentario").addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o comportamento padrão de envio do formulário

        let comentarioInput = document.getElementById("comentarioInput").value;
        if (comentarioInput.trim() === "") {
            alert("Por favor, escreva um comentário antes de enviar.");
            return;
        }

        let novoComentario = {
            id: comentarios.length > 0 ? Math.max(...comentarios.map(c => c.id)) + 1 : 1, // Garante um novo ID único
            forum_id: forumId,
            usuario: {
                id: usuarioCorrente.id,
                login: usuarioCorrente.login
            },
            conteudo: comentarioInput,
            likes: 0,
            comentario_pai_id: null
        };

        // Adiciona o novo comentário ao JSON
        fetch(urlComentarios, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoComentario)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Comentário adicionado com sucesso:", data);
            // Atualiza a lista de comentários na interface
            comments.innerHTML += `<div class="comment">
                                        <strong>${novoComentario.usuario.login}:</strong>
                                        <p>${novoComentario.conteudo}</p>
                                    </div>`;
            // Limpar o formulário
            document.getElementById("comentarioInput").value = "";
        })
        .catch(error => {
            console.error("Erro ao adicionar comentário:", error);
        });
    });
}
