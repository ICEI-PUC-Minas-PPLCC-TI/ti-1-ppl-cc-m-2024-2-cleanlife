const url = '/usuarios';
document.getElementById('editar').addEventListener('submit', function(event){
    event.preventDefault(); 

    const novonome = document.getElementById('username').value;
    if(novonome.trim() === ""){
        alert("O nome não pode estar vazio");
        return;
    }

    const novoemail = document.getElementById('email').value;
    if(novoemail.trim() === ""){
        alert("O email não pode estar vazio");
        return;
    }

    const senha = document.getElementById('password').value;
    if(senha.trim() === ""){
        alert("A senha não pode estar vazia");
        return;
    } else {
        if(senha !== usuarioCorrente.senha){
            alert("Senha incorreta");
            return;
        }
    }

    const novasenha = document.getElementById('new-password').value;
    let temsenha = true;
    if(novasenha.trim() === ""){
        temsenha = false;
    }

    const novabiografia = document.getElementById('bio').value;
    if(novabiografia.trim() === ""){
        alert("A biografia não pode estar vazia");
        return;
    }

   
    const novosDados = {
        nome: novonome,
        email: novoemail,
        biografia: novabiografia
    };

    
    if(temsenha) {
        novosDados.senha = novasenha;
    }

    fetch(`${url}/${usuarioCorrente.id}`, {
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
        alert("Perfil atualizado com sucesso!");
        usuarioCorrente.nome = novonome 
        usuarioCorrente.email = novoemail
        usuarioCorrente.biografia = novabiografia
        if(temsenha) {
            usuarioCorrente.senha = novasenha;
        }
        console.log(usuarioCorrente);
        sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));
        carregadados
        showUserInfo ('userInfo');
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar atualizar o perfil.");
    });
});

window.onload = carregadados;

function carregadados(){
    console.log(usuarioCorrente);

    const novonome = document.getElementById('username');
    const novoemail = document.getElementById('email');
    const novabiografia = document.getElementById('bio');
    novonome.value = usuarioCorrente.nome;
    novoemail.value = usuarioCorrente.email;
    novabiografia.value = usuarioCorrente.biografia;
}
