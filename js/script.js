const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon-img');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const suggestionsList = document.querySelector('.suggestions'); // Adicione este elemento no HTML
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

// Lista de gerações disponíveis para sprites animados
const animatedGenerations = [
    'generation-v',
    'generation-iv',
    'generation-iii',
    'generation-ii',
    'generation-i',
];

// Função para buscar os dados do Pokémon
const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (APIResponse.status === 200) {
            return await APIResponse.json();
        }
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
    }
};

// Função para buscar nomes de Pokémon
const fetchPokemonNames = async () => {
    try {
        const APIResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000'); // Obtém todos os Pokémon
        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data.results.map((pokemon) => pokemon.name);
        }
    } catch (error) {
        console.error("Erro ao buscar nomes de Pokémon:", error);
        return [];
    }
};

// Função para encontrar o sprite animado disponível
const getAnimatedSprite = (sprites) => {
    for (const generation of animatedGenerations) {
        const sprite = sprites?.versions?.[generation]?.['black-white']?.animated?.front_default;
        if (sprite) {
            return sprite;
        }
    }
    return null; // Retorna null se nenhum sprite animado for encontrado
};

// Função para renderizar o Pokémon
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = `#${data.id}`;

        // Buscar o sprite animado
        const animatedSprite = getAnimatedSprite(data.sprites);

        if (animatedSprite) {
            pokemonImage.src = animatedSprite;
        } else {
            pokemonImage.src = data.sprites.front_default; // Fallback para sprite padrão
        }

        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
    }
};

// Função para exibir sugestões
const showSuggestions = async (query) => {
    const pokemonNames = await fetchPokemonNames();
    const filteredNames = pokemonNames.filter((name) => name.startsWith(query.toLowerCase()));
    suggestionsList.innerHTML = ''; // Limpa as sugestões anteriores

    filteredNames.slice(0, 10).forEach((name) => { // Limita a 10 sugestões
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listItem.classList.add('suggestion-item');
        listItem.addEventListener('click', () => {
            input.value = name;
            renderPokemon(name);
            suggestionsList.innerHTML = ''; // Limpa as sugestões após a seleção
        });
        suggestionsList.appendChild(listItem);
    });
};

// Listener para buscar sugestões enquanto digita
input.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    if (query) {
        showSuggestions(query);
    } else {
        suggestionsList.innerHTML = ''; // Limpa as sugestões se o campo estiver vazio
    }
});

// Listeners de eventos para o formulário e botões de navegação
form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
    suggestionsList.innerHTML = ''; // Limpa as sugestões após a busca
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

// Renderizar o Pokémon inicial
renderPokemon(searchPokemon);
