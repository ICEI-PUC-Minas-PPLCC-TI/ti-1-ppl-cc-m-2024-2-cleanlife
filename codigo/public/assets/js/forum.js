const urlForuns = '/foruns';
const urlComentarios = '/comentarios';
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

    // Descrição do fórum
    const descricao = document.getElementById('descricao');
    descricao.innerHTML = ` <h3>Descricao:</h3>
                            <p>${forum.descricao}</p>`;

    // Objetivo do fórum
    const objetivo = document.getElementById('objetivo');
    objetivo.innerHTML = `  <h3>Objetivo:</h3>
                            <p>${forum.objetivo}</p>`;

    // Filtra os comentários pertencentes a este fórum
    const comentariosDoForum = comentarios.filter(comentario => comentario.forum_id == forumId);
    const comments = document.getElementById('comments');
    comments.innerHTML = ``;

    comentariosDoForum.sort((a, b) => b.likes - a.likes);

    comentariosDoForum.forEach(comentario => {
        if (comentario.comentario_pai_id == null) {
            const usuarioJaCurtiu = comentario.usuariosQueCurtiram.includes(usuarioCorrente.id);
            comments.innerHTML += `<div class="comment">
                                        <div class="comment-content">
                                            <strong style="font-size: 18px;">@${comentario.usuario.login}:</strong>
                                            <p>${comentario.conteudo}</p>
                                        </div>
                                        <div class="comment-stats">
                                            <a onclick="like(${comentario.id}, this)" style="margin: 3px;">
                                                <i class="${usuarioJaCurtiu ? 'ph-fill' : 'ph'} ph-arrow-fat-line-up up" style="font-size: 25px"></i>
                                            </a>
                                            <span class="like-count-${comentario.id}">${comentario.likes}</span>
                                            <a onclick="comments(${comentario.id}, this)" style="margin: 15px; color: black; text-decoration: none;"><i class="ph ph-chats" style="font-size: 25px"></i></a>
                                        </div>
                                        <div id="comment-comments-${comentario.id}" class="comment-comments">

                                        </div>
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
            comentario_pai_id: null,
            usuariosQueCurtiram: []
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
            const usuarioJaCurtiu = novoComentario.usuariosQueCurtiram.includes(usuarioCorrente.id);
            comments.innerHTML += `<div class="comment">
                                        <div class="comment-content">
                                            <strong style="font-size: 18px;">@${novoComentario.usuario.login}:</strong>
                                            <p>${novoComentario.conteudo}</p>
                                        </div>
                                        <div class="comment-stats">
                                            <a onclick="like(${novoComentario.id}, this)" style="margin: 3px;">
                                                <i class="${usuarioJaCurtiu ? 'ph-fill' : 'ph'} ph-arrow-fat-line-up up" style="font-size: 25px"></i>
                                            </a>
                                            <span class="like-count-${novoComentario.id}">${novoComentario.likes}</span>
                                            <a onclick="comments(${novoComentario.id}, this)" style="margin: 15px; color: black; text-decoration: none;"><i class="ph ph-chats" style="font-size: 25px"></i></a>
                                        </div>
                                        <div id="comment-comments-${novoComentario.id}" class="comment-comments">

                                        </div>
                                    </div>`;
            // Limpar o formulário
            document.getElementById("comentarioInput").value = "";
            carregarComentarios();
        })
        .catch(error => {
            console.error("Erro ao adicionar comentário:", error);
        });
    });
}

function like(comentarioId, element) {
    let icon = element.querySelector("i");
    // Encontra o comentário com base no ID
    let comentario = comentarios.find(c => c.id == comentarioId);
    if (!comentario) {
        console.error('Comentário não encontrado!');
        return;
    }

    // Verifica se o campo 'usuariosQueCurtiram' existe no comentário, caso contrário inicializa como um array vazio
    if (!comentario.usuariosQueCurtiram) {
        comentario.usuariosQueCurtiram = [];
    }

    // Verifica se o usuário já curtiu este comentário
    const usuarioJaCurtiu = comentario.usuariosQueCurtiram.includes(usuarioCorrente.id);

    if (usuarioJaCurtiu) {
        // Se o usuário já curtiu, remove a curtida
        icon.classList.remove('ph-fill');
        icon.classList.add('ph');
        comentario.likes -= 1;
        comentario.usuariosQueCurtiram = comentario.usuariosQueCurtiram.filter(id => id !== usuarioCorrente.id);
        
    } else {
        // Se o usuário não curtiu ainda, adiciona a curtida
        icon.classList.remove('ph');
        icon.classList.add('ph-fill');
        comentario.likes += 1;
        comentario.usuariosQueCurtiram.push(usuarioCorrente.id);
    }

    // Atualiza o número de curtidas no JSON e a lista de usuários que curtiram
    fetch(`${urlComentarios}/${comentarioId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            likes: comentario.likes, 
            usuariosQueCurtiram: comentario.usuariosQueCurtiram 
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Likes atualizados com sucesso:", data);
        // Atualiza o número de curtidas no DOM
        const likeElement = document.querySelector(`.like-count-${comentarioId}`);
        likeElement.textContent = comentario.likes;
        carregaDadosForum();
    })
    .catch(error => {
        console.error("Erro ao atualizar likes:", error);
    });
}

function comments(comentarioPaiId, element) {
    var comments = document.getElementById(`comment-comments-${comentarioPaiId}`);
    let icon = element.querySelector("i");
    let params = new URLSearchParams(location.search);
    let forumId = params.get('id'); // Extrai o ID do fórum dos parâmetros da URL
    
    if (comments.classList.contains('show')) {
        // Se o menu já está visível, esconde-o
        comments.classList.remove('show');
        icon.classList.remove('ph-fill');
        icon.classList.add('ph');
    } else {
        // Se o menu está escondido, mostra-o
        comments.classList.add('show');
        icon.classList.remove('ph');
        icon.classList.add('ph-fill');
        
        // Criação dos comentários caso ainda não tenham sido criados
        if (!document.getElementById(`comments-${comentarioPaiId}`)) {
            comments.innerHTML += ` <div id="comments-${comentarioPaiId}" style="margin-bottom: 35px;">
                                        <form id="novoComentarioComentario" class="mt-3">
                                            <h5>Deixe sua resposta:</h5>
                                            <div class="form-group">
                                                <textarea id="ComentarioComentarioInput" class="form-control" rows="1" placeholder="Escreva aqui..."></textarea>
                                            </div>
                                            <button type="submit" class="btn btn-primary">Enviar</button>
                                        </form>
                                    </div>`;
            const comentariosDoPai = comentarios.filter(comentario => comentario.comentario_pai_id == comentarioPaiId);
            comentariosDoPai.sort((a, b) => b.likes - a.likes);

            // Loop para criar cada comentário
            comentariosDoPai.forEach(comentario => {
                const usuarioJaCurtiu = comentario.usuariosQueCurtiram.includes(usuarioCorrente.id);
                comments.innerHTML += `<div class="comment-comment">
                                            <div class="comment-content">
                                                <strong style="font-size: 18px;">@${comentario.usuario.login}:</strong>
                                                <p>${comentario.conteudo}</p>
                                            </div>
                                            <div class="comment-stats">
                                                <a onclick="like(${comentario.id}, this)" style="margin: 3px;">
                                                    <i class="${usuarioJaCurtiu ? 'ph-fill' : 'ph'} ph-arrow-fat-line-up up" style="font-size: 25px"></i>
                                                </a>
                                                <span class="like-count-${comentario.id}">${comentario.likes}</span>
                                                </a>
                                            </div>
                                        </div>`;
            });
        }
        // Campo para adicionar novo comentário
        document.getElementById("novoComentarioComentario").addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o comportamento padrão de envio do formulário

            let comentarioInput = document.getElementById("ComentarioComentarioInput").value;
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
                comentario_pai_id: comentarioPaiId,
                usuariosQueCurtiram: []
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
                const usuarioJaCurtiu = novoComentario.usuariosQueCurtiram.includes(usuarioCorrente.id);
                comments.innerHTML += `<div class="comment-comment">
                                            <div class="comment-content">
                                                <strong style="font-size: 18px;">@${novoComentario.usuario.login}:</strong>
                                                <p>${novoComentario.conteudo}</p>
                                            </div>
                                            <div class="comment-stats">
                                                <a onclick="like(${novoComentario.id}, this)" style="margin: 3px;">
                                                    <i class="${usuarioJaCurtiu ? 'ph-fill' : 'ph'} ph-arrow-fat-line-up up" style="font-size: 25px"></i>
                                                </a>
                                                <span class="like-count-${novoComentario.id}">${novoComentario.likes}</span>
                                            </div>
                                        </div>`;
                // Limpar o formulário
                document.getElementById("comentarioInput").value = "";
                carregarComentarios();
            })
            .catch(error => {
                console.error("Erro ao adicionar comentário:", error);
            });
        });
    }
}