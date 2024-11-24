document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.toLowerCase();
    const articles = document.querySelectorAll('.article'); 
    const resultsContainer = document.getElementById('search-results');

    resultsContainer.innerHTML = ''; 

    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent.toLowerCase();
        const content = article.querySelector('.article-content').textContent.toLowerCase();

        if (title.includes(query) || content.includes(query)) {
            const result = article.cloneNode(true); 
            resultsContainer.appendChild(result);
        }
    });

    if (resultsContainer.innerHTML === '') {
        resultsContainer.innerHTML = '<p>Nenhum artigo encontrado.</p>';
    }
});
