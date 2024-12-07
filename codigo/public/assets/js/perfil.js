const urlUsuarios = '/usuarios';
const urlForuns = '/foruns';
let usuarioLogado = {}
let forunsUsuario = []

function carregarDados(){
    fetch(`${urlUsuarios}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(usuarios => {
        usuarios.forEach(usuario => {
            if(usuario.login == usuarioCorrente.login){
                usuarioLogado = usuario
                fetch(`${urlForuns}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(foruns => {
                    forunsUsuario = []
                    foruns.forEach(forum => {
                        if(forum.usuarioAdministrador.id == usuarioLogado.id){
                            forunsUsuario.push(forum);
                        }
                    });
                    carregaPerfil()
                })
                .catch(error => {
                    console.error("Erro ao obter a lista de foruns:", error);
                });
            }
        });
    })
    .catch(error => {
        console.error("Erro ao obter a lista de usuários:", error);
    });
}

function carregaPerfil(){
    const username = document.getElementById('user-name')
    username.value = usuarioLogado.nome

    const biografia = document.getElementById('biografia')
    biografia.value = usuarioLogado.biografia

    console.log(forunsUsuario);
    const foruns = document.getElementById('foruns')
    console.log("limpou");
    foruns.innerHTML = '';
    forunsUsuario.forEach(forum => {
        foruns.innerHTML += `<a href="forum.html?id=${forum.id}"> 
                                <div class="forum-card">
                                    <p>${forum.titulo}</p>
                                </div>
                            </a>`;
    });
}

window.onload = function() {
    carregarDados();
    setupModal();
}

function setupModal() {
    const modal = document.getElementById('editProfileModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        closeEditModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeEditModal();
        }
    }

    document.getElementById('editar').addEventListener('submit', function(event){
        event.preventDefault(); 
        atualizarPerfil();
    });
}

function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'block';
    
    document.getElementById('username').value = usuarioLogado.nome;
    document.getElementById('bio').value = usuarioLogado.biografia;
    document.getElementById('email').value = usuarioLogado.email;
    document.getElementById('password').value = "";
    document.getElementById('new-password').value = "";
}

function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
}

function atualizarPerfil() {
    const novonome = document.getElementById('username').value;
    const novoemail = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const novasenha = document.getElementById('new-password').value;
    const novabiografia = document.getElementById('bio').value;

    if(novonome.trim() === "" || novoemail.trim() === "" || senha.trim() === "" || novabiografia.trim() === ""){
        alert("Todos os campos, exceto a nova senha, são obrigatórios.");
        return;
    }

    if(senha !== usuarioCorrente.senha){
        alert("Senha incorreta");
        return;
    }

    const novosDados = {
        nome: novonome,
        email: novoemail,
        biografia: novabiografia
    };

    if(novasenha.trim() !== "") {
        novosDados.senha = novasenha;
    }

    fetch(`${urlUsuarios}/${usuarioCorrente.id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novosDados)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao atualizar os dados");
        return response.json();
    })
    .then(data => {
        usuarioCorrente.nome = novonome;
        usuarioCorrente.email = novoemail;
        usuarioCorrente.biografia = novabiografia;
        if(novasenha.trim() !== "") {
            usuarioCorrente.senha = novasenha;
        }
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
        carregarDados();
        showUserInfo('userInfo');
        closeEditModal();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar atualizar o perfil.");
    });
}

