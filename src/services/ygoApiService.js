export async function fetchAllCards(num = 100, offset = 0) {
  const API_URL = `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${num}&offset=${offset}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    // ASEGÚRATE DE QUE DEVUELVA ESTO:
    return response.json();

  } catch (error) {
    console.error('There was a problem fetching the cards:', error);
    return { data: [], meta: { total_rows: 0 } }; // Damos un valor por defecto en caso de error
  }
}

export async function fetchCardsByBanlist(banlist) {
  // La URL se construye dinámicamente con el nombre de la banlist que recibimos.
  const API_URL = `https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=${banlist}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Network response was not ok for banlist fetch');
    }

    const data = await response.json();
    console.log(`Respuesta de la API para la banlist '${banlist}':`, data);
    return data.data; // Devolvemos solo la lista de cartas.

  } catch (error) {
    console.error(`There was a problem fetching the ${banlist} banlist:`, error)
    return [];
  }
}
