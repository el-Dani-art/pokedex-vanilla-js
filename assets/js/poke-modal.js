const dialog = document.getElementById('poke-tab');
const pokeContent = document.getElementById('poke-content');
const closeBtn = document.getElementById('close-btn');
const pokemonListOl = document.getElementById('pokemonList');

// Evento de clique na lista (Event Delegation)
pokemonListOl.addEventListener('click', (event) => {
  const pokemonLi = event.target.closest('.pokemon');
  if (pokemonLi) {
    // .trim() remove espaços extras que possam vir do ID no main.js
    const pokemonName = pokemonLi.id.trim();
    getPokemonDetail(pokemonName);
  }
});

function getPokemonDetail(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

  fetch(url)
    .then((response) => response.json())
    .then((pokemon) => {
      renderPokemonDetails(pokemon);
      dialog.showModal();
    })
    .catch((err) => console.error('Erro ao carregar detalhes:', err));
}

function renderPokemonDetails(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

  // Stats formatados
  const statsHtml = pokemon.stats
    .map(
      (s) => `
        <div class="stat-row">
            <span class="stat-name">${s.stat.name}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill ${mainType}" style="width: ${Math.min(s.base_stat, 100)}%"></div>
            </div>
            <span class="stat-value">${s.base_stat}</span>
        </div>
    `,
    )
    .join('');

  pokeContent.innerHTML = `
        <div class="modal-header ${mainType}">
            <div class="header-info">
                <h2 class="name">${pokemon.name}</h2>
                <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
            </div>
            <img class="poke-img-modal" src="${imageUrl}" alt="${pokemon.name}">
        </div>

        <div class="modal-body">
            <div class="tabs-mock">About</div>
            
            <div class="info-table">
                <div class="info-item">
                    <span class="label">Height</span>
                    <span class="value">${pokemon.height / 10} m</span>
                </div>
                <div class="info-item">
                    <span class="label">Weight</span>
                    <span class="value">${pokemon.weight / 10} kg</span>
                </div>
                <div class="info-item">
                    <span class="label">Abilities</span>
                    <span class="value">${pokemon.abilities.map((a) => a.ability.name).join(', ')}</span>
                </div>
            </div>

            <h3 class="stats-title">Base Stats</h3>
            <div class="stats-container">
                ${statsHtml}
            </div>
        </div>
    `;
}

// Fechamento
closeBtn.onclick = () => dialog.close();

dialog.onclick = (event) => {
  if (event.target === dialog) dialog.close();
};
