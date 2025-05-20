// storageService.js - Servicio para gestionar el almacenamiento local

/**
 * Clase que encapsula las operaciones de almacenamiento local usando localStorage
 * para guardar el progreso del usuario, colección y configuraciones.
 */
export class StorageService {
  constructor() {
    // Claves para localStorage
    this.KEYS = {
      USER: 'secureswipe_user',
      PROGRESS: 'secureswipe_progress',
      COLLECTION: 'secureswipe_collection',
      SETTINGS: 'secureswipe_settings',
      DAILY_CARD: 'secureswipe_daily_card'
    };
    
    // Inicialización - verificar si hay datos existentes o crear nuevos
    this.initializeStorage();
  }
  
  /**
   * Inicializa el almacenamiento si no existe
   */
  initializeStorage() {
    // Verificar y crear datos de usuario
    if (!this.getUser()) {
      this.setUser({
        id: this.generateUniqueId(),
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString()
      });
    } else {
      // Actualizar última visita
      const user = this.getUser();
      user.lastVisit = new Date().toISOString();
      this.setUser(user);
    }
    
    // Verificar y crear datos de progreso
    if (!this.getProgress()) {
      this.setProgress({
        cardsViewed: [],
        correctAnswers: [],
        incorrectAnswers: [],
        dailyCards: {
          lastAccessed: null,
          completed: []
        }
      });
    }
    
    // Verificar y crear colección
    if (!this.getCollection()) {
      this.setCollection([]);
    }
    
    // Verificar y crear configuraciones
    if (!this.getSettings()) {
      this.setSettings({
        theme: 'light',
        animations: true
      });
    }
  }
  
  /**
   * Genera un ID único para el usuario
   * @returns {string} ID único
   */
  generateUniqueId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Obtiene los datos del usuario
   * @returns {Object|null} Datos del usuario o null si no existen
   */
  getUser() {
    try {
      const userData = localStorage.getItem(this.KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error al obtener datos de usuario:', e);
      return null;
    }
  }
  
  /**
   * Guarda los datos del usuario
   * @param {Object} userData - Datos del usuario a guardar
   */
  setUser(userData) {
    try {
      localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    } catch (e) {
      console.error('Error al guardar datos de usuario:', e);
    }
  }
  
  /**
   * Obtiene el progreso del usuario
   * @returns {Object|null} Datos de progreso o null si no existen
   */
  getProgress() {
    try {
      const progressData = localStorage.getItem(this.KEYS.PROGRESS);
      return progressData ? JSON.parse(progressData) : null;
    } catch (e) {
      console.error('Error al obtener datos de progreso:', e);
      return null;
    }
  }
  
  /**
   * Guarda el progreso del usuario
   * @param {Object} progressData - Datos de progreso a guardar
   */
  setProgress(progressData) {
    try {
      localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progressData));
    } catch (e) {
      console.error('Error al guardar datos de progreso:', e);
    }
  }
  
  /**
   * Actualiza una parte específica del progreso del usuario
   * @param {string} key - Clave del dato a actualizar
   * @param {any} value - Valor a establecer
   */
  updateProgress(key, value) {
    try {
      const progress = this.getProgress() || {};
      progress[key] = value;
      this.setProgress(progress);
    } catch (e) {
      console.error(`Error al actualizar el progreso (${key}):`, e);
    }
  }
  
  /**
   * Registra una tarjeta vista
   * @param {string} cardId - ID de la tarjeta vista
   */
  addCardViewed(cardId) {
    try {
      const progress = this.getProgress();
      if (!progress.cardsViewed.includes(cardId)) {
        progress.cardsViewed.push(cardId);
        this.setProgress(progress);
      }
    } catch (e) {
      console.error('Error al registrar tarjeta vista:', e);
    }
  }
  
  /**
   * Registra una respuesta correcta
   * @param {string} cardId - ID de la tarjeta respondida correctamente
   */
  addCorrectAnswer(cardId) {
    try {
      const progress = this.getProgress();
      if (!progress.correctAnswers.includes(cardId)) {
        progress.correctAnswers.push(cardId);
        this.setProgress(progress);
      }
    } catch (e) {
      console.error('Error al registrar respuesta correcta:', e);
    }
  }
  
  /**
   * Registra una respuesta incorrecta
   * @param {string} cardId - ID de la tarjeta respondida incorrectamente
   */
  addIncorrectAnswer(cardId) {
    try {
      const progress = this.getProgress();
      if (!progress.incorrectAnswers.includes(cardId)) {
        progress.incorrectAnswers.push(cardId);
        this.setProgress(progress);
      }
    } catch (e) {
      console.error('Error al registrar respuesta incorrecta:', e);
    }
  }
  
  /**
   * Obtiene la colección de tarjetas guardadas
   * @returns {Array|null} Colección de tarjetas o null si no existe
   */
  getCollection() {
    try {
      const collectionData = localStorage.getItem(this.KEYS.COLLECTION);
      return collectionData ? JSON.parse(collectionData) : null;
    } catch (e) {
      console.error('Error al obtener colección:', e);
      return null;
    }
  }
  
  /**
   * Guarda la colección de tarjetas
   * @param {Array} collection - Colección a guardar
   */
  setCollection(collection) {
    try {
      localStorage.setItem(this.KEYS.COLLECTION, JSON.stringify(collection));
    } catch (e) {
      console.error('Error al guardar colección:', e);
    }
  }
  
  /**
   * Añade una tarjeta a la colección
   * @param {string} cardId - ID de la tarjeta a añadir
   * @returns {boolean} true si se añadió correctamente, false si ya existía
   */
  addToCollection(cardId) {
    try {
      const collection = this.getCollection() || [];
      if (!collection.includes(cardId)) {
        collection.push(cardId);
        this.setCollection(collection);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error al añadir tarjeta a colección:', e);
      return false;
    }
  }
  
  /**
   * Elimina una tarjeta de la colección
   * @param {string} cardId - ID de la tarjeta a eliminar
   * @returns {boolean} true si se eliminó correctamente, false si no existía
   */
  removeFromCollection(cardId) {
    try {
      const collection = this.getCollection() || [];
      const index = collection.indexOf(cardId);
      if (index !== -1) {
        collection.splice(index, 1);
        this.setCollection(collection);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error al eliminar tarjeta de colección:', e);
      return false;
    }
  }
  
  /**
   * Obtiene las configuraciones del usuario
   * @returns {Object|null} Configuraciones o null si no existen
   */
  getSettings() {
    try {
      const settingsData = localStorage.getItem(this.KEYS.SETTINGS);
      return settingsData ? JSON.parse(settingsData) : null;
    } catch (e) {
      console.error('Error al obtener configuraciones:', e);
      return null;
    }
  }
  
  /**
   * Guarda las configuraciones del usuario
   * @param {Object} settings - Configuraciones a guardar
   */
  setSettings(settings) {
    try {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error al guardar configuraciones:', e);
    }
  }
  
  /**
   * Registra el acceso a la carta diaria
   * @returns {boolean} true si es la primera vez en el día, false si ya se había accedido
   */
  registerDailyCardAccess() {
    try {
      const progress = this.getProgress();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Comprobar si ya se completó la carta del día
      if (progress.dailyCards.completed.includes(today)) {
        return false;
      }
      
      // Registrar acceso
      progress.dailyCards.lastAccessed = today;
      progress.dailyCards.completed.push(today);
      this.setProgress(progress);
      return true;
    } catch (e) {
      console.error('Error al registrar acceso a carta diaria:', e);
      return false;
    }
  }
  
  /**
   * Comprueba si ya se ha accedido a la carta diaria hoy
   * @returns {boolean} true si ya se accedió hoy, false si no
   */
  hasDailyCardBeenAccessed() {
    try {
      const progress = this.getProgress();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      return progress.dailyCards.completed.includes(today);
    } catch (e) {
      console.error('Error al comprobar acceso a carta diaria:', e);
      return false;
    }
  }
  
  /**
   * Calcula estadísticas de uso
   * @returns {Object} Objeto con estadísticas
   */
  getStatistics() {
    try {
      const progress = this.getProgress();
      const totalViewed = progress.cardsViewed.length;
      const totalCorrect = progress.correctAnswers.length;
      const totalIncorrect = progress.incorrectAnswers.length;
      const successRate = totalViewed > 0 ? (totalCorrect / totalViewed) * 100 : 0;
      
      return {
        totalViewed,
        totalCorrect,
        totalIncorrect,
        successRate: Math.round(successRate * 100) / 100, // Redondeo a 2 decimales
        collectionSize: (this.getCollection() || []).length,
        dailyCardStreak: this.calculateDailyCardStreak()
      };
    } catch (e) {
      console.error('Error al calcular estadísticas:', e);
      return {
        totalViewed: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        successRate: 0,
        collectionSize: 0,
        dailyCardStreak: 0
      };
    }
  }
  
  /**
   * Calcula la racha actual de cartas diarias
   * @returns {number} Número de días consecutivos completando la carta diaria
   */
  calculateDailyCardStreak() {
    try {
      const progress = this.getProgress();
      const completedDates = progress.dailyCards.completed
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b - a); // Ordenar descendente
      
      if (completedDates.length === 0) {
        return 0;
      }
      
      // Verificar si se completó hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastCompleted = new Date(completedDates[0]);
      lastCompleted.setHours(0, 0, 0, 0);
      
      // Si no se completó hoy o ayer, la racha es 0
      if (today - lastCompleted > 86400000) { // Más de 24 horas (en milisegundos)
        return 0;
      }
      
      // Calcular racha
      let streak = 1; // Contamos el primer día
      for (let i = 1; i < completedDates.length; i++) {
        const current = completedDates[i-1];
        const previous = completedDates[i];
        current.setHours(0, 0, 0, 0);
        previous.setHours(0, 0, 0, 0);
        
        // Comprobar si son días consecutivos
        if (current - previous === 86400000) { // Exactamente 24 horas (en milisegundos)
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch (e) {
      console.error('Error al calcular racha de cartas diarias:', e);
      return 0;
    }
  }
  
  /**
   * Limpia todos los datos almacenados (para pruebas o reinicio)
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.KEYS.USER);
      localStorage.removeItem(this.KEYS.PROGRESS);
      localStorage.removeItem(this.KEYS.COLLECTION);
      localStorage.removeItem(this.KEYS.SETTINGS);
      localStorage.removeItem(this.KEYS.DAILY_CARD);
    } catch (e) {
      console.error('Error al limpiar datos:', e);
    }
  }
}
