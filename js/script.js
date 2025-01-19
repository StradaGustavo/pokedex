const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon-img');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const suggestionsList = document.querySelector('.suggestions'); 
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const animatedGenerations = [
    'generation-v',
    'generation-iv',
    'generation-iii',
    'generation-ii',
    'generation-i',
];

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

const getAnimatedSprite = (sprites) => {
    for (const generation of animatedGenerations) {
        const sprite = sprites?.versions?.[generation]?.['black-white']?.animated?.front_default;
        if (sprite) {
            return sprite;
        }
    }
    return null; 
};

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = `#${data.id}`;

        const animatedSprite = getAnimatedSprite(data.sprites);

        if (animatedSprite) {
            pokemonImage.src = animatedSprite;
        } else {
            pokemonImage.src = data.sprites.front_default;
        }

        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
    }
};

const showSuggestions = async (query) => {
    const pokemonNames = await fetchPokemonNames();
    const filteredNames = pokemonNames.filter((name) => name.startsWith(query.toLowerCase()));
    suggestionsList.innerHTML = ''; 

    filteredNames.slice(0, 10).forEach((name) => { 
        const listItem = document.createElement('li');

        const highlightedName = name.replace(
            new RegExp(`^(${query})`, 'i'), 
            `<span class="highlight">$1</span>` 
        );

        listItem.innerHTML = highlightedName; 
        listItem.classList.add('suggestion-item');
        listItem.addEventListener('click', () => {
            input.value = name;
            renderPokemon(name);
            suggestionsList.innerHTML = ''; 
        });
        suggestionsList.appendChild(listItem);
    });
};


input.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    if (query) {
        showSuggestions(query);
    } else {
        suggestionsList.innerHTML = ''; 
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
    suggestionsList.innerHTML = ''; 
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

renderPokemon(searchPokemon);

document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) {
        suggestionsList.innerHTML = ''; 
    }
});


document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) {
        suggestionsList.classList.remove('visible');
    }
});

input.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    if (query) {
        showSuggestions(query);
        suggestionsList.classList.add('visible'); 
    } else {
        suggestionsList.classList.remove('visible'); 
    }
});
