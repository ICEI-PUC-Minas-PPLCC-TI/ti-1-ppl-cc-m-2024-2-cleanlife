document.addEventListener("DOMContentLoaded", function() {
    // Função para obter os dados da API (substitua com seu caminho real)
    async function getData() {
        try {
            // Substitua os URLs pelos reais
            const responseForum = await fetch('/foruns');
            const responseComentarios = await fetch('/comentarios');
            const responseUsuarios = await fetch('/usuarios');
            const responseArtigos = await fetch('/artigos');
            const responseClinicas = await fetch('/clinicas');

            const dataForum = await responseForum.json();
            const dataComentarios = await responseComentarios.json();
            const dataUsuarios = await responseUsuarios.json();
            const dataArtigos = await responseArtigos.json();
            const dataClinicas = await responseClinicas.json();

            // Processa os dados para os gráficos
            createCharts(dataForum, dataComentarios, dataUsuarios, dataArtigos, dataClinicas);
        } catch (error) {
            console.error("Erro ao carregar os dados: ", error);
        }
    }

    // Função para criar os gráficos
    function createCharts(dataForum, dataComentarios, dataUsuarios, dataArtigos, dataClinicas) {
        // Contagem de dados
        const totalUsuarios = dataUsuarios.length;  // Número de usuários
        const totalForuns = dataForum.length;       // Número de fóruns
        const totalArtigos = dataArtigos.length;    // Número de artigos
        const totalClinicas = dataClinicas.length;  // Número de clínicas

        // Cálculo da média de comentários por fórum
        const mediaComentariosPorForum = totalForuns > 0 ? (dataComentarios.length / totalForuns) : 0;

        // Gráfico de Estatísticas Gerais (Usuarios, Fóruns, Artigos, Clínicas)
        const ctxGeneral = document.getElementById('generalChart').getContext('2d');
        const generalChart = new Chart(ctxGeneral, {
            type: 'bar',
            data: {
                labels: ['Usuários', 'Fóruns', 'Artigos', 'Clínicas'],
                datasets: [{
                    label: 'Quantidade',
                    data: [totalUsuarios, totalForuns, totalArtigos, totalClinicas],
                    backgroundColor: '#4e73df',  // Cor azul para os itens
                    borderColor: '#4e73df',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Gráfico de Média de Comentários por Fórum (com barra)
        const ctxComments = document.getElementById('commentsChart').getContext('2d');
        const commentsChart = new Chart(ctxComments, {
            type: 'bar',  // Mudando para gráfico de barras
            data: {
                labels: ['Média de Comentários por Fórum'],  // Apenas uma categoria
                datasets: [{
                    label: 'Média de Comentários',
                    data: [mediaComentariosPorForum],  // Média de comentários por fórum
                    backgroundColor: '#36b9cc',  // Cor azul clara para a barra
                    borderColor: '#36b9cc',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1  // Ajuste para visualização melhor dos valores inteiros
                        }
                    }
                }
            }
        });
    }

    // Chama a função para pegar os dados ao carregar a página
    getData();
});