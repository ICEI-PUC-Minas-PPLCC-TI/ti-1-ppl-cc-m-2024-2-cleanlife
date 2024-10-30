const apiUrl = '/artigos';

function displayMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readArtigo(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler artigos via API JSONServer:', error);
            displayMessage("Erro ao ler artigos");
        });
}

function createArtigo(artigo, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(artigo),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Artigo inserido com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir artigo via API JSONServer:', error);
            displayMessage("Erro ao inserir artigo");
        });
}

function updateArtigo(id, artigo, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(artigo),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Artigo alterado com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar artigo via API JSONServer:', error);
            displayMessage("Erro ao atualizar artigo");
        });
}

function deleteArtigo(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Artigo removido com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover artigo via API JSONServer:', error);
            displayMessage("Erro ao remover artigo");
        });
}

function exibeArtigos() {
    tableArtigos = document.getElementById("table-artigos");

    // Remove todas as linhas do corpo da tabela
    tableArtigos.innerHTML = "";

    readArtigo (dados => {
        // Popula a tabela com os registros do banco de dados
        for (i = 0; i < dados.length; i++) {
            let artigo = dados[i];    
            tableArtigos.innerHTML += `<tr><td scope="row">${artigo.id}</td>
                                            <td>${artigo.titulo}</td>
                                            <td>${artigo.link}</td>
                                            <td>${artigo.tags}</td>
                                        </tr>`;
        }
    })
}

function init() {
    // Define uma variável para o formulário de artigo
    formArtigo = document.getElementById("form-artigo");

    // Adiciona funções para tratar os eventos 
    btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener ('click', function () {
        // Verifica se o formulário está preenchido corretamente
        if (!formArtigo.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let campoTitulo = document.getElementById ('inputTitulo').value;
        let campoLink = document.getElementById ('inputLink').value;
        let campoTag1 = document.getElementById ('inputTag1').value;
        let campoTag2 = document.getElementById ('inputTag2').value;
        let campoTag3 = document.getElementById ('inputTag3').value;

        // Cria um objeto com os dados do artigo
        let artigo = { 
            titulo: campoTitulo, 
            link: campoLink,
            tags: [
                campoTag1,
                campoTag2,
                campoTag3
            ]
        };

        // Cria o artigo no banco de dados
        createArtigo(artigo, exibeArtigos);

        // Limpa o formulario
        formArtigo.reset()
    });

    // Trata o click do botão Alterar
    btnUpdate = document.getElementById("btnUpdate");
    btnUpdate.addEventListener ('click', function () {
        // Obtem os valores dos campos do formulário
        let campoId = document.getElementById("inputId").value;
        if (campoId == "") {
            displayMessage("Selecione antes um artigo para ser alterada.");
            return;
        }

         // Obtem os valores dos campos do formulário
         let campoTitulo = document.getElementById ('inputTitulo').value;
         let campoLink = document.getElementById ('inputLink').value;
         let campoTag1 = document.getElementById ('inputTag1').value;
         let campoTag2 = document.getElementById ('inputTag2').value;
         let campoTag3 = document.getElementById ('inputTag3').value;
 
         // Cria um objeto com os dados do artigo
         let artigo = { 
             titulo: campoTitulo, 
             link: campoLink,
             tags: [
                 campoTag1,
                 campoTag2,
                 campoTag3
             ]
         };

        // Altera o artigo no banco de dados
        updateArtigo(parseInt(campoId), artigo, exibeArtigos);

        // Limpa o formulario
        formArtigo.reset()
    });

    // Trata o click do botão Excluir
    btnDelete = document.getElementById('btnDelete');
    btnDelete.addEventListener ('click', function () {
        let campoId = document.getElementById('inputId').value;
        if (campoId == "") {
            displayMessage("Selecione um artigo a ser excluído.");
            return;
        }

        // Exclui o artigo no banco de dados
        deleteArtigo(parseInt(campoId), exibeArtigos);

        // Limpa o formulario
        formArtigo.reset()
    });

    // Trata o click do botão Listar Artigos
    btnClear = document.getElementById('btnClear');
    btnClear.addEventListener ('click', function () {                
        formArtigo.reset()
    });

    // Oculta a mensagem de aviso após alguns 5 segundos
    msg = document.getElementById('msg');
    msg.addEventListener ("DOMSubtreeModified", function (e) {
        if (e.target.innerHTML == "") return;
        setTimeout (function () {
            alert = msg.getElementsByClassName("alert");
            alert[0].remove();
        }, 5000);
    })

    // Preenche o formulário quando o usuario clicar em uma linha da tabela 
    gridArtigos = document.getElementById("grid-artigos");
    gridArtigos.addEventListener('click', function (e) {
        if (e.target.tagName == "TD") { 

            // Obtem as colunas da linha selecionada na tabela
            let linhaArtigo = e.target.parentNode;
            colunas = linhaArtigo.querySelectorAll("td");

            // Preenche os campos do formulário com os dados da linha selecionada na tabela
            document.getElementById ('inputId').value = colunas[0].innerText;
            document.getElementById ('inputTitulo').value = colunas[1].innerText;
            document.getElementById ('inputLink').value = colunas[2].innerText;
            let tags = colunas[3].innerText.split(",")
            document.getElementById ('inputTag1').value = tags[0].trim();
            document.getElementById ('inputTag2').value = tags[1].trim();
            document.getElementById ('inputTag3').value = tags[2].trim();
        }
    });

    exibeArtigos();
}