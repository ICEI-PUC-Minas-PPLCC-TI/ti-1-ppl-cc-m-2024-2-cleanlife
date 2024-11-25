document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    async function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!query) {
            searchResults.innerHTML = '<p>Por favor, insira um termo para busca.</p>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/artigos?q=${query}`);
            const filteredArticles = await response.json();

            if (filteredArticles.length === 0) {
                searchResults.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                return;
            }

            filteredArticles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');

                articleDiv.innerHTML = `
                            <a href="${article.link}" target="_blank"><h2 class="article-title">${article.titulo}</h2></a>
                                    `;

                searchResults.appendChild(articleDiv);
            });
        } catch (error) {
            console.error('Erro ao buscar os artigos:', error);
            searchResults.innerHTML = '<p>Erro ao buscar os artigos. Tente novamente mais tarde.</p>';
        }
    }

    // Adicionar o evento de digitação
    searchInput.addEventListener('input', performSearch);
});
