export async function fetchAllCards() {
  // La URL de la API
  const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  try {
    // Hacemos el pedido a la URL y esperamos (await) la respuesta.
    const response = await fetch(API_URL);

    // Si la respuesta no fue exitosa (ej. el servidor está caído), lanzamos un error.
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // La respuesta viene en un formato. Le decimos que la 'desempaque' como JSON.
    const data = await response.json();

    // La API nos devuelve un objeto que tiene una propiedad 'data' que es la lista de cartas.
    // Devolvemos solo esa lista.
    return data.data;

  } catch (error) {
    // Si algo sale mal en cualquiera de los pasos anteriores, lo capturamos aquí.
    console.error('There was a problem fetching the cards:', error);
    // Devolvemos un arreglo vacío para que nuestra app no se rompa.
    return [];
  }
}
