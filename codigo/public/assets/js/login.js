// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza o registro de novos usuários e login para aplicações com 
// backend baseado em API REST provida pelo JSONServer
// Os dados de usuário estão localizados no arquivo db.json que acompanha este projeto.
//
// Autor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
// Data: 09/09/2024
//
// Código LoginApp  


// Página inicial de Login
const LOGIN_URL = "/modulos/login/login.html";
let RETURN_URL = "/home.html";
const API_URL = '/usuarios';

// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = {};

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Inicializa a aplicação de Login
function initLoginApp () {
    let pagina = window.location.pathname;
    if (pagina != LOGIN_URL) {
        // CONFIGURA A URLS DE RETORNO COMO A PÁGINA ATUAL
        sessionStorage.setItem('returnURL', pagina);
        RETURN_URL = pagina;

        // INICIALIZA USUARIOCORRENTE A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
        usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrenteJSON) {
            usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
        } else {
            window.location.href = LOGIN_URL;
        }

        // REGISTRA LISTENER PARA O EVENTO DE CARREGAMENTO DA PÁGINA PARA ATUALIZAR INFORMAÇÕES DO USUÁRIO
        document.addEventListener('DOMContentLoaded', function () {
            showUserInfo ('userInfo');
        });
    }
    else {
        // VERIFICA SE A URL DE RETORNO ESTÁ DEFINIDA NO SESSION STORAGE, CASO CONTRARIO USA A PÁGINA INICIAL
        let returnURL = sessionStorage.getItem('returnURL');
        RETURN_URL = returnURL || RETURN_URL
        
        // INICIALIZA BANCO DE DADOS DE USUÁRIOS
        carregarUsuarios(() => {
            console.log('Usuários carregados...');
        });
    }
};


function carregarUsuarios(callback) {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        db_usuarios = data;
        callback ()
    })
    .catch(error => {
        console.error('Erro ao ler usuários via API JSONServer:', error);
        displayMessage("Erro ao ler usuários");
    });
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser (login, senha) {

    // Verifica todos os itens do banco de dados de usuarios 
    // para localizar o usuário informado no formulario de login
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        // Se encontrou login, carrega usuário corrente e salva no Session Storage
        if (login == usuario.login && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;
            usuarioCorrente.ehADM = usuario.ehADM;
            usuarioCorrente.biografia = usuario.biografia;
            usuarioCorrente.senha = usuario.senha

            // Salva os dados do usuário corrente no Session Storage, mas antes converte para string
            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));

            // Retorna true para usuário encontrado
            return true;
        }
    }

    // Se chegou até aqui é por que não encontrou o usuário e retorna falso
    return false;
}

// Apaga os dados do usuário corrente no sessionStorage
function logoutUser () {
    sessionStorage.removeItem ('usuarioCorrente');
    window.location = LOGIN_URL;
}

function addUser (nome, login, senha, email) {

    // Cria um objeto de usuario para o novo usuario 
    let usuario = { "login": login, "senha": senha, "nome": nome, "email": email };

    // Envia dados do novo usuário para ser inserido no JSON Server
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => response.json())
        .then(data => {
            // Adiciona o novo usuário na variável db_usuarios em memória
            db_usuarios.push (usuario);
            displayMessage("Usuário inserido com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir usuário via API JSONServer:', error);
            displayMessage("Erro ao inserir usuário");
        });
}

function showUserInfo (element) {
    var elemUser = document.getElementById(element);
    if (elemUser) {
        elemUser.innerHTML = ``;
        if (usuarioCorrente.ehADM == 1) {
            elemUser.innerHTML += `<a onclick="navADM()" style="margin: 50px;"><i class="ph-bold ph-gear-six gearIcon" style="font-size: 23px"></i> </a>`;
        }
        elemUser.innerHTML += `${usuarioCorrente.nome} (${usuarioCorrente.login}) 
        <a onclick="logoutUser()"> <i class="ph-bold ph-sign-out" style="font-size: 23px"></i></a>`;
    }
}

function navADM() {
    var elemUser = document.getElementById("navBarADM");
    var gearIcon = document.querySelector(".gearIcon");
    
    if (elemUser.classList.contains('show')) {
        // Se o menu já está visível, esconde-o e rotaciona o icone para a posicao inicial
        elemUser.classList.remove('show');
        gearIcon.classList.remove('rotate');
    } else {
        // Se o menu está escondido, mostra-o
        elemUser.classList.add('show');
        gearIcon.classList.add('rotate');
        
        // Criação do menu caso ainda não tenha sido criado
        if (!document.getElementById("admNavMenu")) {
            elemUser.innerHTML += `<nav id="admNavMenu" class="navbar navbar-expand-md navbar-light bg-light">
                                        <a class="navbar-brand">Menu ADM</a>
                                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav1" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                            <span class="navbar-toggler-icon"></span>
                                        </button>
                                        <div class="collapse navbar-collapse" id="navbarNav1">
                                            <ul class="navbar-nav">
                                                <li class="nav-item">
                                                    <a class="nav-link" href="cadastro-artigos.html">Cadastro Artigos</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" href="cadastro-clinicas.html">Cadastro Clinicas</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" href="">Cadastro 3</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </nav>`;
        }
    }
}

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp ();