// evaluationService.js - Servicio para evaluar las respuestas del usuario

/**
 * Clase que evalúa las respuestas del usuario al deslizar tarjetas
 * y determina si son correctas basándose en el tipo de tarjeta.
 */
export class EvaluationService {
  /**
   * Evalúa si la dirección de deslizamiento es correcta según el tipo de tarjeta
   * @param {string} cardType - Tipo de la tarjeta ('vulnerability' o 'good_practice')
   * @param {string} swipeDirection - Dirección del deslizamiento ('left' o 'right')
   * @returns {boolean} true si la respuesta es correcta, false si no
   */
  evaluateSwipe(cardType, swipeDirection) {
    // Lógica de evaluación:
    // - Vulnerabilidades deben deslizarse a la izquierda (rechazar)
    // - Buenas prácticas deben deslizarse a la derecha (aceptar)
    
    // Swipe a la derecha significa "es una buena práctica"
    // Swipe a la izquierda significa "es una vulnerabilidad"
    
    if (cardType === 'vulnerability' && swipeDirection === 'left') {
      return true; // Correcto: identificó vulnerabilidad correctamente
    }
    
    if (cardType === 'good_practice' && swipeDirection === 'right') {
      return true; // Correcto: identificó buena práctica correctamente
    }
    
    return false; // Incorrecto: confundió vulnerabilidad con buena práctica o viceversa
  }
  
  /**
   * Genera un mensaje de retroalimentación basado en la evaluación
   * @param {object} card - Objeto con datos de la tarjeta
   * @param {boolean} isCorrect - Si la respuesta fue correcta
   * @returns {object} Objeto con título y explicación para mostrar
   */
  generateFeedback(card, isCorrect) {
    const baseMessage = isCorrect 
      ? '¡Correcto! ' 
      : 'Incorrecto. ';
    
    if (card.type === 'vulnerability') {
      if (isCorrect) {
        return {
          title: `Has identificado correctamente una vulnerabilidad`,
          message: `${baseMessage}${card.title} representa una vulnerabilidad de seguridad. ${card.explanation}`
        };
      } else {
        return {
          title: `Has confundido una vulnerabilidad con una buena práctica`,
          message: `${baseMessage}${card.title} es en realidad una vulnerabilidad. ${card.explanation}`
        };
      }
    } else { // good_practice
      if (isCorrect) {
        return {
          title: `Has identificado correctamente una buena práctica`,
          message: `${baseMessage}${card.title} representa una buena práctica de seguridad. ${card.explanation}`
        };
      } else {
        return {
          title: `Has confundido una buena práctica con una vulnerabilidad`,
          message: `${baseMessage}${card.title} es en realidad una buena práctica. ${card.explanation}`
        };
      }
    }
  }
  
  /**
   * Calcula una puntuación basada en el tiempo de respuesta y dificultad de la tarjeta
   * para el modo desafío
   * @param {object} card - Objeto con datos de la tarjeta
   * @param {boolean} isCorrect - Si la respuesta fue correcta
   * @param {number} responseTime - Tiempo de respuesta en milisegundos
   * @returns {number} Puntuación calculada
   */
  calculateScore(card, isCorrect, responseTime) {
    if (!isCorrect) {
      return 0; // No hay puntos para respuestas incorrectas
    }
    
    // Factores base
    const difficultyFactor = card.difficulty || 1; // 1-3, donde 3 es más difícil
    const basePoints = 100 * difficultyFactor;
    
    // Factor de tiempo (respuestas más rápidas dan más puntos)
    const timeInSeconds = responseTime / 1000;
    let timeFactor = 1;
    
    if (timeInSeconds < 3) {
      // Respuesta muy rápida: bonificación
      timeFactor = 1.5;
    } else if (timeInSeconds > 10) {
      // Respuesta lenta: penalización
      timeFactor = 0.8;
    }
    
    // Cálculo final
    const finalScore = Math.round(basePoints * timeFactor);
    return finalScore;
  }
}
