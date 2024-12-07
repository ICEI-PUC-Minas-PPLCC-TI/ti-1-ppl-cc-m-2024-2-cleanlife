document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const warning = document.getElementById('search-results');
    const searchResults = document.getElementById('artigos-container');

    async function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';
        warning.innerHTML = '';

        if (!query) {
            warning.innerHTML = '<p>Por favor, insira um termo para busca.</p>';
            carregarArtigos();
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/artigos?q=${query}`);
            const filteredArticles = await response.json();

            if (filteredArticles.length === 0) {
                searchResults.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                return;
            }

            filteredArticles.forEach(artigo => {
                const artigoDiv = document.createElement('div');
                artigoDiv.className = 'artigo';
          
                const titulo = document.createElement('h2');
                titulo.textContent = artigo.titulo;
          
                const link = document.createElement('a');
                link.href = artigo.link;
                link.target = '_blank';
                link.textContent = 'Ler mais';
          
                artigoDiv.appendChild(titulo);
                artigoDiv.appendChild(link);
          
                searchResults.appendChild(artigoDiv);
            });
        } catch (error) {
            console.error('Erro ao buscar os artigos:', error);
            searchResults.innerHTML = '<p>Erro ao buscar os artigos. Tente novamente mais tarde.</p>';
        }
    }

    // Adicionar o evento de digitação
    searchInput.addEventListener('input', performSearch);
});
