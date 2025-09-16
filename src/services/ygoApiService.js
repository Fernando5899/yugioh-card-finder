export async function fetchCards(filters) {
  // Empezamos con la URL base
  const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  // Creamos un objeto para los parámetros de la URL
  const params = new URLSearchParams();

  // Añadimos los filtros que recibimos a los parámetros
  if (filters.searchTerm) params.append('fname', filters.searchTerm);
  if (filters.selectedType) params.append('type', filters.selectedType);
  if (filters.selectedBanlist && filters.selectedBanlist !== 'all') {
    params.append('banlist', filters.selectedBanlist.toLowerCase());
  }

  // Añadimos siempre la paginación
  params.append('num', filters.cardsPerPage);
  params.append('offset', (filters.currentPage - 1) * filters.cardsPerPage);

  // Construimos la URL final
  const finalURL = `${API_URL}?${params.toString()}`;

  try {
    const response = await fetch(finalURL);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem fetching the cards:', error);
    return { data: [], meta: { total_rows: 0 } };
  }
}

export async function fetchCardById(id) {
  const API_URL = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    // La API devuelve un array 'data' con una sola carta, la extraemos.
    return data.data[0];
  } catch (error) {
    console.error(`There was a problem fetching the card with id ${id}:`, error);
    return null; // Devolvemos null en caso de error
  }
}
