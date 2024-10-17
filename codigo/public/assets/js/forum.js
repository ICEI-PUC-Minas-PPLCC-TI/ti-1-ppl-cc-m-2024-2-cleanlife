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
    if(forum.usuarioAdministrador.id == usuarioCorrente.id) {
        titulo.innerHTML = `<div class="titulo">
                                <h2>${forum.titulo}</h2>
                                <div class="editar">
                                    <button type="button" class="btn2" data-toggle="modal" data-target="#exampleModal">
                                        <i class="ph-bold ph-note-pencil"></i>
                                    </button>

                                    <!-- Modal -->
                                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Editar Fórum</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="ModalTopicos">
                                                    <label for="novo-titulo" class="col-form-label" style="font-size:20px;">${forum.titulo}</label>
                                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editTituloModal" data-whatever="@mdo">Editar</button>
                                                </div>
                                                <div class="ModalTopicos">
                                                    <label for="nova-descricao" class="col-form-label" style="font-size:20px;">${forum.descricao}</label>
                                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editDescricaoModal" data-whatever="@fat">Editar</button>
                                                </div>
                                                <div class="ModalTopicos">
                                                    <label for="novo-objetivo" class="col-form-label" style="font-size:20px;">${forum.objetivo}</label>
                                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editObjetivoModal" data-whatever="@getbootstrap">Editar</button>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Modal for Editing Título -->
                                    <div class="modal fade" id="editTituloModal" tabindex="-1" role="dialog" aria-labelledby="editTituloLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="editTituloLabel">Editar Título</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="form-group">
                                                            <input type="text" class="form-control" id="new-titulo" placeholder="Digite o novo título">
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                    <button type="button" class="btn btn-primary">Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Modal for Editing Descrição -->
                                    <div class="modal fade" id="editDescricaoModal" tabindex="-1" role="dialog" aria-labelledby="editDescricaoLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="editDescricaoLabel">Editar Descrição</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="form-group">
                                                            <input type="text" class="form-control" id="new-descricao" placeholder="Digite a nova descrição">
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                    <button type="button" class="btn btn-primary">Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Modal for Editing Objetivo -->
                                    <div class="modal fade" id="editObjetivoModal" tabindex="-1" role="dialog" aria-labelledby="editObjetivoLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="editObjetivoLabel">Editar Objetivo</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <form>
                                                        <div class="form-group">
                                                            <input type="text" class="form-control" id="new-objetivo" placeholder="Digite o novo objetivo">
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                    <button type="button" class="btn btn-primary">Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>`;
    }else{
        titulo.innerHTML = `<h2>${forum.titulo}</h2>`;
    }

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
    
    if (comments.classList.contains('show1')) {
        // Se o menu já está visível, esconde-o
        comments.classList.remove('show1');
        icon.classList.remove('ph-fill');
        icon.classList.add('ph');
    } else {
        // Se o menu está escondido, mostra-o
        comments.classList.add('show1');
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
                                                <a onclick="like2(${comentario.id}, this)" style="margin: 3px;">
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
                                                <a onclick="like2(${novoComentario.id}, this)" style="margin: 3px;">
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

function like2(comentarioId, element) {
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

        // Chama a função para reordenar os comentários
        reordenarComentarios(comentario.comentario_pai_id);
    })
    .catch(error => {
        console.error("Erro ao atualizar likes:", error);
    });
}

function reordenarComentarios(comentarioPaiId) {
    // Filtra os comentários relacionados ao comentário pai
    const comentariosDoPai = comentarios.filter(comentario => comentario.comentario_pai_id == comentarioPaiId);
    
    // Ordena os comentários com base na quantidade de likes
    comentariosDoPai.sort((a, b) => b.likes - a.likes);
    
    // Atualiza a exibição no DOM
    const commentsContainer = document.getElementById(`comment-comments-${comentarioPaiId}`);
    const novoComentarioForm = document.getElementById(`comments-${comentarioPaiId}`);
    
    // Limpa os comentários atuais
    commentsContainer.innerHTML = '';
    if (novoComentarioForm) {
        commentsContainer.appendChild(novoComentarioForm);
    } else {
        commentsContainer.innerHTML += `<div id="comments-${comentarioPaiId}" style="margin-bottom: 35px;">
                                            <form id="novoComentarioComentario" class="mt-3">
                                                <h5>Deixe sua resposta:</h5>
                                                <div class="form-group">
                                                    <textarea id="ComentarioComentarioInput" class="form-control" rows="1" placeholder="Escreva aqui..."></textarea>
                                                </div>
                                                <button type="submit" class="btn btn-primary">Enviar</button>
                                            </form>
                                        </div>`;
    }
    
    // Adiciona os comentários reordenados no DOM
    comentariosDoPai.forEach(comentario => {
        const usuarioJaCurtiu = comentario.usuariosQueCurtiram.includes(usuarioCorrente.id);
        commentsContainer.innerHTML += `<div class="comment-comment">
                                            <div class="comment-content">
                                                <strong style="font-size: 18px;">@${comentario.usuario.login}:</strong>
                                                <p>${comentario.conteudo}</p>
                                            </div>
                                            <div class="comment-stats">
                                                <a onclick="like2(${comentario.id}, this)" style="margin: 3px;">
                                                    <i class="${usuarioJaCurtiu ? 'ph-fill' : 'ph'} ph-arrow-fat-line-up up" style="font-size: 25px"></i>
                                                </a>
                                                <span class="like-count-${comentario.id}">${comentario.likes}</span>
                                            </div>
                                        </div>`;
    });
}