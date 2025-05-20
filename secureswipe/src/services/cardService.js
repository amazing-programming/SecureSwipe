// cardService.js - Servicio para gestionar las tarjetas educativas

/**
 * Clase que maneja la carga, filtrado y selección de tarjetas educativas
 */
export class CardService {
  constructor() {
    this.cards = []; // Todas las tarjetas disponibles
    this.categories = []; // Categorías disponibles
    this.isLoaded = false; // Indicador de si los datos ya se cargaron
  }
  
  /**
   * Carga las tarjetas desde el archivo JSON
   * @returns {Promise<boolean>} Promesa que resuelve a true si la carga fue exitosa
   */
  async loadCards() {
    try {
      if (this.isLoaded) {
        return true;
      }
      
      const response = await fetch('/data/cards.json');
      if (!response.ok) {
        throw new Error(`Error cargando tarjetas: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.cards = data.cards || [];
      this.categories = data.categories || [];
      this.isLoaded = true;
      
      return true;
    } catch (error) {
      console.error('Error cargando datos de tarjetas:', error);
      return false;
    }
  }
  
  /**
   * Obtiene todas las tarjetas disponibles
   * @returns {Promise<Array>} Array de tarjetas
   */
  async getAllCards() {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    return this.cards;
  }
  
  /**
   * Obtiene una tarjeta por su ID
   * @param {string} cardId - ID de la tarjeta a buscar
   * @returns {Promise<Object|null>} Tarjeta encontrada o null
   */
  async getCardById(cardId) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    return this.cards.find(card => card.id === cardId) || null;
  }
  
  /**
   * Obtiene tarjetas filtradas por categoría
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise<Array>} Array de tarjetas filtradas
   */
  async getCardsByCategory(categoryId) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    return this.cards.filter(card => card.category === categoryId);
  }
  
  /**
   * Obtiene tarjetas filtradas por tipo (vulnerabilidad o buena práctica)
   * @param {string} type - Tipo de tarjeta ('vulnerability' o 'good_practice')
   * @returns {Promise<Array>} Array de tarjetas filtradas
   */
  async getCardsByType(type) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    return this.cards.filter(card => card.type === type);
  }
  
  /**
   * Obtiene tarjetas filtradas por dificultad
   * @param {number} difficulty - Nivel de dificultad (1-3)
   * @returns {Promise<Array>} Array de tarjetas filtradas
   */
  async getCardsByDifficulty(difficulty) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    return this.cards.filter(card => card.difficulty === difficulty);
  }
  
  /**
   * Obtiene todas las categorías disponibles
   * @returns {Promise<Array>} Array de categorías
   */
  async getCategories() {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    return this.categories;
  }
  
  /**
   * Obtiene una selección de tarjetas para el modo desafío
   * @param {Object} options - Opciones de filtrado para el desafío
   * @param {number} options.count - Número de tarjetas a seleccionar (default: 10)
   * @param {string} options.category - ID de categoría para filtrar (opcional)
   * @param {number} options.difficulty - Nivel de dificultad para filtrar (opcional)
   * @returns {Promise<Array>} Array de tarjetas seleccionadas para el desafío
   */
  async getChallengeCards(options = {}) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    const count = options.count || 10;
    let filteredCards = [...this.cards];
    
    // Aplicar filtros si se especifican
    if (options.category) {
      filteredCards = filteredCards.filter(card => card.category === options.category);
    }
    
    if (options.difficulty) {
      filteredCards = filteredCards.filter(card => card.difficulty === options.difficulty);
    }
    
    // Si hay menos tarjetas que las solicitadas, devolver todas las disponibles
    if (filteredCards.length <= count) {
      return filteredCards;
    }
    
    // Seleccionar tarjetas aleatoriamente
    return this.getRandomCards(filteredCards, count);
  }
  
  /**
   * Selecciona la carta diaria
   * @param {Array} viewedCardIds - IDs de tarjetas ya vistas (para evitar repeticiones)
   * @returns {Promise<Object|null>} Tarjeta seleccionada como carta diaria
   */
  async getDailyCard(viewedCardIds = []) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    // Intentar seleccionar una tarjeta no vista
    const notViewedCards = this.cards.filter(card => !viewedCardIds.includes(card.id));
    
    if (notViewedCards.length > 0) {
      // Seleccionar una tarjeta al azar de las no vistas
      return notViewedCards[Math.floor(Math.random() * notViewedCards.length)];
    } else if (this.cards.length > 0) {
      // Si todas han sido vistas, seleccionar una al azar
      return this.cards[Math.floor(Math.random() * this.cards.length)];
    }
    
    return null;
  }
  
  /**
   * Selecciona un número determinado de tarjetas aleatorias
   * @param {Array} cards - Array de tarjetas de donde seleccionar
   * @param {number} count - Número de tarjetas a seleccionar
   * @returns {Array} Array de tarjetas seleccionadas aleatoriamente
   */
  getRandomCards(cards, count) {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  /**
   * Obtiene tarjetas en un orden específico para el juego
   * @param {string} orderType - Tipo de orden ('random', 'difficulty', 'category')
   * @returns {Promise<Array>} Array de tarjetas ordenadas
   */
  async getOrderedCards(orderType = 'random') {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    let orderedCards = [...this.cards];
    
    switch (orderType) {
      case 'difficulty':
        // Ordenar por dificultad (de menor a mayor)
        orderedCards.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
        break;
        
      case 'category':
        // Agrupar por categoría
        orderedCards.sort((a, b) => {
          if (a.category < b.category) return -1;
          if (a.category > b.category) return 1;
          return 0;
        });
        break;
        
      case 'random':
      default:
        // Ordenar aleatoriamente
        orderedCards = this.getRandomCards(orderedCards, orderedCards.length);
        break;
    }
    
    return orderedCards;
  }
  
  /**
   * Obtiene las tarjetas que forman parte de la colección del usuario
   * @param {Array} collectionIds - Array de IDs de las tarjetas en la colección
   * @returns {Promise<Array>} Array de objetos de tarjetas completos
   */
  async getCollectionCards(collectionIds = []) {
    if (!this.isLoaded) {
      await this.loadCards();
    }
    
    return this.cards.filter(card => collectionIds.includes(card.id));
  }
}
