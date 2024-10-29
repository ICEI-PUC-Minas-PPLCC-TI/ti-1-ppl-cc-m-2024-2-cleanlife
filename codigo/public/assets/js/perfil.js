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
                    foruns.forEach(forum => {
                        if(forum.usuarioAdministrador.login == usuarioLogado.login){
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
    forunsUsuario.forEach(forum => {
        foruns.innerHTML += `<a href="forum.html?id=${forum.id}"> 
                                <div class="forum-card">
                                    <p>${forum.titulo}</p>
                                </div>
                            </a>`;
    });
    
}

window.onload = carregarDados

function redirecionar() {
    window.location.href = "editar-perf.html";
}