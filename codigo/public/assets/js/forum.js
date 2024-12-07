const urlForuns = '/foruns';
const urlComentarios = '/comentarios';
let foruns = [];
let comentarios = [];
let isVazio;

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
    titulo.innerText = forum.titulo;
    
    // Descrição do fórum
    const descricao = document.getElementById('descricao');
    descricao.innerHTML = ` <h3>Descricao:</h3>
                            <p id="descricao-no-forum" >${forum.descricao}</p>`;

    // Objetivo do fórum
    const objetivo = document.getElementById('objetivo');
    objetivo.innerHTML = `  <h3>Objetivo:</h3>
                            <p id="objetivo-no-forum" >${forum.objetivo}</p>`;

    const editar = document.getElementById('editar');
    if(forum.usuarioAdministrador.id == usuarioCorrente.id) {
        editar.classList.remove('hide');
        const titulomodal = document.getElementById('titulo-modal');
        const descricaomodal = document.getElementById('descricao-modal');
        const objetivomodal = document.getElementById('objetivo-modal');
        titulomodal.innerText = forum.titulo;
        descricaomodal.innerText = forum.descricao;
        objetivomodal.innerText = forum.objetivo;
        document.getElementById('new-titulo').value = forum.titulo;
        document.getElementById('new-descricao').value = forum.descricao;
        document.getElementById('new-objetivo').value = forum.objetivo;
        document.getElementById('confirmar-edicao-titulo').addEventListener('click', function() {
            // Pegar o valor do campo de input
            const novoTitulo = document.getElementById('new-titulo').value;
            if (novoTitulo.trim() === "") {
                alert("O título não pode estar vazio!");
                return;
            }
    
            // Atualizar o título fora do modal
            if (titulo) {
                titulo.innerText = novoTitulo;
                titulomodal.innerText = novoTitulo;
            }
    
            // Fechar o modal
            $('#editTituloModal').modal('hide');
            
            // Atualizar no servidor usando uma requisição PATCH
            fetch(`${urlForuns}/${forum.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ titulo: novoTitulo })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Título atualizado com sucesso no servidor:", data);
                console.log('Novo título:', novoTitulo);
            })
            .catch(error => {
                console.error("Erro ao atualizar o título no servidor:", error);
            });
        });
        document.getElementById('confirmar-edicao-descricao').addEventListener('click', function() {
            // Pegar o valor do campo de input
            const novaDescricao = document.getElementById('new-descricao').value;
            if (novaDescricao.trim() === "") {
                alert("A descricao não pode estar vazia!");
                return;
            }
            
            const descricaoforum = document.getElementById('descricao-no-forum');

            // Atualizar a descricao fora do modal
            if (descricaoforum) {
                descricaoforum.innerText = novaDescricao;
                descricaomodal.innerText = novaDescricao;
            }
    
            // Fechar o modal
            $('#editDescricaoModal').modal('hide');
            
            // Atualizar no servidor usando uma requisição PATCH
            fetch(`${urlForuns}/${forum.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ descricao: novaDescricao })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Descricao atualizada com sucesso no servidor:", data);
                console.log('Nova descricao:', novaDescricao);
            })
            .catch(error => {
                console.error("Erro ao atualizar a descricao no servidor:", error);
            });
        });
        document.getElementById('confirmar-edicao-objetivo').addEventListener('click', function() {
            // Pegar o valor do campo de input
            const novoObjetivo = document.getElementById('new-objetivo').value;
            if (novoObjetivo.trim() === "") {
                alert("O Objetivo não pode estar vazio!");
                return;
            }
            
            const objetivoforum = document.getElementById('objetivo-no-forum');

            // Exemplo: Atualizar a descricao de um elemento fora do modal
            if (objetivoforum) {
                objetivoforum.innerText = novoObjetivo;
                objetivomodal.innerText = novoObjetivo;
            }
    
            // Fechar o modal
            $('#editObjetivoModal').modal('hide');
            
            // Atualizar no servidor usando uma requisição PATCH
            fetch(`${urlForuns}/${forum.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ objetivo: novoObjetivo })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Objetivo atualizado com sucesso no servidor:", data);
                console.log('Novo objetivo:', novoObjetivo);
            })
            .catch(error => {
                console.error("Erro ao atualizar o objetivo no servidor:", error);
            });
        });
    }

    // Filtra os comentários pertencentes a este fórum
    const comentariosDoForum = comentarios.filter(comentario => comentario.forum_id == forumId);
    const comments = document.getElementById('comments');
    comments.innerHTML = ``;

    if(comentariosDoForum.length > 0) {
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
    } else {
        isVazio = true;
        comments.innerHTML += `<div class="comment">
                                    <div class="comment-content">
                                        <strong style="font-size: 25px;">Este fórum ainda está em branco!</strong>
                                        <p style="font-size: 20px; margin-top: 10px;">Seja o primeiro a compartilhar sua experiência ou fazer uma pergunta. Sua contribuição pode ajudar outras pessoas que estão passando pelos mesmos desafios.</p>
                                    </div>
                                </div>`;
    }


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
            if(isVazio) {
                comments.innerHTML = "";
                isVazio = false;
            }
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
        comments.style.maxHeight = '0';
        comments.classList.remove('show1');
        icon.classList.remove('ph-fill');
        icon.classList.add('ph');
    } else {
        // Criação dos comentários caso ainda não tenham sido criados
        if (!document.getElementById(`comments-${comentarioPaiId}`)) {
            comments.innerHTML += ` <div id="comments-${comentarioPaiId}" style="margin-bottom: 35px;">
                                        <form id="novoComentarioComentario-${comentarioPaiId}" class="mt-3">
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
        document.getElementById(`novoComentarioComentario-${comentarioPaiId}`).addEventListener("submit", function (event) {
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
                                                <a onclick="like2(${novoComentario.id}, this, ${forumId})" style="margin: 3px;">
                                                    <i class="${usuarioJaCurtiu ? 'ph-fill' : 'ph'} ph-arrow-fat-line-up up" style="font-size: 25px"></i>
                                                </a>
                                                <span class="like-count-${novoComentario.id}">${novoComentario.likes}</span>
                                            </div>
                                        </div>`;
                // Limpar o formulário
                document.getElementById("comentarioInput").value = "";
                const contentHeight = comments.scrollHeight + 'px';
                comments.style.maxHeight = contentHeight;
                carregarComentarios();
            })
            .catch(error => {
                console.error("Erro ao adicionar comentário:", error);
            });
        });
        // Se o menu está escondido, mostra-o
        const contentHeight = comments.scrollHeight + 'px';
        comments.style.maxHeight = contentHeight;
        comments.classList.add('show1');
        icon.classList.remove('ph');
        icon.classList.add('ph-fill');
    }
}

function like2(comentarioId, element, forumId) {
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
        reordenarComentarios(comentario.comentario_pai_id, forumId);
    })
    .catch(error => {
        console.error("Erro ao atualizar likes:", error);
    });
}

function reordenarComentarios(comentarioPaiId, forumId) {
    // Filtra os comentários relacionados ao comentário pai
    const comentariosDoPai = comentarios.filter(comentario => comentario.comentario_pai_id == comentarioPaiId);
    
    // Ordena os comentários com base na quantidade de likes
    comentariosDoPai.sort((a, b) => b.likes - a.likes);
    
    // Atualiza a exibição no DOM
    const commentsContainer = document.getElementById(`comment-comments-${comentarioPaiId}`);
    
    // Limpa os comentários atuais
    commentsContainer.innerHTML = '';
    commentsContainer.innerHTML += `<div id="comments-${comentarioPaiId}" style="margin-bottom: 35px;">
                                        <form id="novoComentarioComentario-${comentarioPaiId}" class="mt-3">
                                            <h5>Deixe sua resposta:</h5>
                                            <div class="form-group">
                                                <textarea id="ComentarioComentarioInput" class="form-control" rows="1" placeholder="Escreva aqui..."></textarea>
                                            </div>
                                            <button type="submit" class="btn btn-primary">Enviar</button>
                                        </form>
                                    </div>`;
                                            
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

    // Campo para adicionar novo comentário
    document.getElementById(`novoComentarioComentario-${comentarioPaiId}`).addEventListener("submit", function (event) {
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
            commentsContainer.innerHTML += `<div class="comment-comment">
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
            const contentHeight = commentsContainer.scrollHeight + 'px';
            commentsContainer.style.maxHeight = contentHeight;
            carregarComentarios();
        })
        .catch(error => {
            console.error("Erro ao adicionar comentário:", error);
        });
    });
}