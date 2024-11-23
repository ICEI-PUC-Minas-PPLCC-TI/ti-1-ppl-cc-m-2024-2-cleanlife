const container = document.getElementById('artigos-container');

// Função para carregar os artigos do arquivo JSON
async function carregarArtigos() {
  try {
    const response = await fetch('db.json');
    if (!response.ok) throw new Error('Erro ao carregar os dados');
    const artigos = await response.json();

    // Renderiza os artigos no formato de blocos
    artigos.forEach(artigo => {
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

      container.appendChild(artigoDiv);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Erro ao carregar os artigos.</p>';
  }
}

carregarArtigos();
