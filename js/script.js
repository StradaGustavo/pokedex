const pokemonName = document.querySelector('.pokemon-name');
    const pokemonNumber = document.querySelector('.pokemon-number');
    const pokemonImage = document.querySelector('.pokemon-img');
    const form = document.querySelector('.form');
    const input = document.querySelector('.input-search');
    const suggestionsList = document.querySelector('.suggestions');
    const buttomPrev = document.querySelector('.btn-prev');
    const buttomNext = document.querySelector('.btn-next');

    let searchPokemon = 1;
    let allPokemon = []; 

    const fetchAllPokemon = async () => {
      const APIResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await APIResponse.json();
      allPokemon = data.results.map((pokemon) => pokemon.name);
    };

    
    const showSuggestions = (inputValue) => {
      const filteredPokemon = allPokemon.filter((name) =>
        name.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      suggestionsList.innerHTML = ''; 
      filteredPokemon.slice(0, 10).forEach((name) => {
        const li = document.createElement('li');
        li.textContent = name;
        li.addEventListener('click', () => {
          input.value = name; o
          suggestionsList.innerHTML = ''; 
          renderPokemon(name); 
        });
        suggestionsList.appendChild(li);
      });
    };

    const fetchPokemon = async (pokemon) => {
      const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      if (APIResponse.status === 200) {
        return await APIResponse.json();
      }
      return null;
    };

    const animatedGenerations = ['generation-v', 'generation-iv', 'generation-iii', 'generation-ii', 'generation-i'];
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
        pokemonImage.src = animatedSprite || data.sprites.front_default;
        input.value = '';
        searchPokemon = data.id;
      } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
      }
    };

    input.addEventListener('input', (event) => {
      const inputValue = event.target.value;
      if (inputValue) {
        showSuggestions(inputValue);
      } else {
        suggestionsList.innerHTML = ''; 
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      renderPokemon(input.value.toLowerCase());
    });

    buttomPrev.addEventListener('click', () => {
      if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
      }
    });

    buttomNext.addEventListener('click', () => {
      searchPokemon += 1;
      renderPokemon(searchPokemon);
    });

    fetchAllPokemon();
    renderPokemon(searchPokemon);
