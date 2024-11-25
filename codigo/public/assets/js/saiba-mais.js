// saiba-mais.js

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
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
           
            const response = await fetch(`http://localhost:3000/articles?q=${query}`);
            const filteredArticles = await response.json();
    
            if (filteredArticles.length === 0) {
                searchResults.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                return;
            }
    
          
            filteredArticles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
    
                const titleElement = document.createElement('h2');
                titleElement.classList.add('article-title');
                titleElement.textContent = article.title;
    
                const contentElement = document.createElement('p');
                contentElement.classList.add('article-content');
                contentElement.textContent = article.content;
    
                articleDiv.appendChild(titleElement);
                articleDiv.appendChild(contentElement);
    
                searchResults.appendChild(articleDiv);
            });
        } catch (error) {
            console.error('Erro ao buscar os artigos:', error);
            searchResults.innerHTML = '<p>Erro ao buscar os artigos. Tente novamente mais tarde.</p>';
        }
    }
    

    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!query) {
            searchResults.innerHTML = '<p>Por favor, insira um termo para busca.</p>';
            return;
        }

        const filteredArticles = articles.filter(article =>
            article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)
        );

        if (filteredArticles.length === 0) {
            searchResults.innerHTML = '<p>Nenhum artigo encontrado.</p>';
            return;
        }

        filteredArticles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');

            const titleElement = document.createElement('h2');
            titleElement.classList.add('article-title');
            titleElement.textContent = article.title;

            const contentElement = document.createElement('p');
            contentElement.classList.add('article-content');
            contentElement.textContent = article.content;

            articleDiv.appendChild(titleElement);
            articleDiv.appendChild(contentElement);

            searchResults.appendChild(articleDiv);
        });
    }

   
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
