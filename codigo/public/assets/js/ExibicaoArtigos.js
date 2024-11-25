const container = document.getElementById('artigos-container');


async function carregarArtigos() {
  try {
    const response = await fetch('/artigos');
    if (!response.ok) throw new Error('Erro ao carregar os dados');
    const data = await response.json();

    
    if (!data) throw new Error('Formato inválido do JSON');

   
    data.forEach(artigo => {
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
