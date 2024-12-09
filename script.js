document.getElementById("pokemonForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const numPokemonInput = document.getElementById("numPokemon");
    const numPokemon = parseInt(numPokemonInput.value);
    const category = document.getElementById("category").value;
    const container = document.getElementById("pokemonContainer");
    const messageContainer = document.getElementById("messageContainer");

    
    if (numPokemon < 1 || numPokemon > 20) {
        alert("Please enter a number between 1 and 20.");
        return;
    }

    container.innerHTML = ""; 
    messageContainer.textContent = "Loading Pokémon... Please wait."; 

    let foundPokemons = 0;
    let id = 1;

    while (foundPokemons < numPokemon) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            const isCategoryMatch = data.types.some(type => type.type.name === category);

            if (isCategoryMatch) {
                const card = createPokemonCard(data);
                container.appendChild(card);
                foundPokemons++;
            }
        } catch (err) {
            console.error(`Failed to process Pokémon with ID ${id}: `, err);
        }

        id++;
        if (id > 1000) break;
    }

    if (foundPokemons === 0) {
        container.innerHTML = `<p>No Pokémon found for the selected category.</p>`;
        messageContainer.textContent = "No Pokémon found.";
    } else {
        messageContainer.textContent = "Pokémon cards loaded successfully!";
    }

    setTimeout(() => (messageContainer.textContent = ""), 3000);
});

function createPokemonCard(data) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = data.sprites.front_default;
    img.alt = data.name;

    const name = document.createElement("h3");
    name.textContent = data.name;

    const type = document.createElement("p");
    type.textContent = `Type: ${data.types.map(t => t.type.name).join(", ")}`;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(type);

    return card;
}
