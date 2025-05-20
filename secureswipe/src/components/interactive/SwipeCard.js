// SwipeCard.js - Componente interactivo para el deslizamiento de tarjetas

/**
 * Clase SwipeCard que implementa la funcionalidad de deslizamiento tipo Tinder
 * para las tarjetas educativas de SecureSwipe.
 */
export class SwipeCard {
  constructor(options = {}) {
    // Elementos DOM
    this.container = options.container || document.querySelector('.swipe-container');
    this.cards = Array.from(this.container.querySelectorAll('.swipe-card'));
    
    // Configuración
    this.threshold = options.threshold || 150; // Umbral para considerar un deslizamiento
    this.rotationAngle = options.rotationAngle || 10; // Ángulo máximo de rotación
    this.swipeOutClass = options.swipeOutClass || 'swipe-card-out';
    
    // Estado
    this.currentCard = this.cards[0];
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.isDragging = false;
    
    // Callbacks
    this.onSwipeLeft = options.onSwipeLeft || (() => {});
    this.onSwipeRight = options.onSwipeRight || (() => {});
    this.onCardChange = options.onCardChange || (() => {});
    
    // Inicialización
    this.init();
  }
  
  /**
   * Inicializa el componente y establece los event listeners
   */
  init() {
    // Solo se muestra la primera tarjeta, las demás están ocultas
    this.cards.forEach((card, index) => {
      if (index !== 0) {
        card.style.display = 'none';
      }
    });
    
    // Eventos de mouse/touch
    this.container.addEventListener('mousedown', this.handleDragStart.bind(this));
    this.container.addEventListener('mousemove', this.handleDragMove.bind(this));
    this.container.addEventListener('mouseup', this.handleDragEnd.bind(this));
    this.container.addEventListener('mouseleave', this.handleDragEnd.bind(this));
    
    // Eventos de touch para dispositivos móviles
    this.container.addEventListener('touchstart', this.handleDragStart.bind(this));
    this.container.addEventListener('touchmove', this.handleDragMove.bind(this));
    this.container.addEventListener('touchend', this.handleDragEnd.bind(this));
  }
  
  /**
   * Maneja el inicio del deslizamiento
   * @param {Event} e - Evento de mouse o touch
   */
  handleDragStart(e) {
    if (!this.currentCard) return;
    
    e.preventDefault();
    
    // Guarda la posición inicial
    this.isDragging = true;
    this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  }
  
  /**
   * Maneja el movimiento durante el deslizamiento
   * @param {Event} e - Evento de mouse o touch
   */
  handleDragMove(e) {
    if (!this.isDragging || !this.currentCard) return;
    
    e.preventDefault();
    
    // Calcula el desplazamiento
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    this.moveX = currentX - this.startX;
    this.moveY = currentY - this.startY;
    
    // Calcula el ángulo de rotación basado en el desplazamiento
    const rotate = this.moveX * 0.1; // Ajusta la sensibilidad de la rotación
    
    // Aplica la transformación
    this.currentCard.style.transform = `translate(${this.moveX}px, ${this.moveY}px) rotate(${rotate}deg)`;
    
    // Cambia la opacidad del fondo según la dirección
    if (this.moveX > 0) {
      // Deslizamiento a la derecha (buena práctica)
      this.container.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
    } else if (this.moveX < 0) {
      // Deslizamiento a la izquierda (vulnerabilidad)
      this.container.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
    } else {
      // Sin deslizamiento
      this.container.style.backgroundColor = 'transparent';
    }
  }
  
  /**
   * Maneja el final del deslizamiento
   * @param {Event} e - Evento de mouse o touch
   */
  handleDragEnd(e) {
    if (!this.isDragging || !this.currentCard) return;
    
    this.isDragging = false;
    
    // Determina si se ha excedido el umbral para considerar un deslizamiento
    if (Math.abs(this.moveX) > this.threshold) {
      // Determina la dirección del deslizamiento
      const direction = this.moveX > 0 ? 'right' : 'left';
      
      // Completa la animación de deslizamiento
      const moveOutWidth = document.body.clientWidth * 1.5;
      const endX = direction === 'right' ? moveOutWidth : -moveOutWidth;
      
      this.currentCard.style.transition = 'transform 0.5s ease';
      this.currentCard.style.transform = `translate(${endX}px, ${this.moveY}px) rotate(${endX * 0.1}deg)`;
      
      // Llama al callback correspondiente
      if (direction === 'right') {
        this.onSwipeRight(this.currentCard, this.cards.indexOf(this.currentCard));
      } else {
        this.onSwipeLeft(this.currentCard, this.cards.indexOf(this.currentCard));
      }
      
      // Prepara la siguiente tarjeta
      setTimeout(() => {
        this.prepareNextCard();
      }, 500);
    } else {
      // Restablece la posición si no se ha deslizado lo suficiente
      this.currentCard.style.transition = 'transform 0.3s ease';
      this.currentCard.style.transform = '';
      this.container.style.backgroundColor = 'transparent';
    }
  }
  
  /**
   * Prepara la siguiente tarjeta para ser mostrada
   */
  prepareNextCard() {
    // Elimina la tarjeta actual del DOM
    this.currentCard.style.display = 'none';
    
    // Obtiene el índice de la tarjeta actual
    const currentIndex = this.cards.indexOf(this.currentCard);
    
    // Comprueba si hay más tarjetas
    if (currentIndex < this.cards.length - 1) {
      // Muestra la siguiente tarjeta
      this.currentCard = this.cards[currentIndex + 1];
      this.currentCard.style.display = 'block';
      this.currentCard.style.transform = '';
      
      // Callback de cambio de tarjeta
      this.onCardChange(this.currentCard, currentIndex + 1);
    } else {
      // No hay más tarjetas
      this.currentCard = null;
      this.container.innerHTML = `
        <div class="no-more-cards">
          <h3>¡Has completado todas las tarjetas!</h3>
          <button class="restart-button">Reiniciar</button>
        </div>
      `;
      
      // Añade evento al botón de reinicio
      const restartButton = this.container.querySelector('.restart-button');
      if (restartButton) {
        restartButton.addEventListener('click', () => {
          window.location.reload();
        });
      }
    }
    
    this.container.style.backgroundColor = 'transparent';
  }
  
  /**
   * Desliza la tarjeta actual programáticamente
   * @param {string} direction - Dirección del deslizamiento ('left' o 'right')
   */
  swipe(direction) {
    if (!this.currentCard) return;
    
    const moveOutWidth = document.body.clientWidth * 1.5;
    const endX = direction === 'right' ? moveOutWidth : -moveOutWidth;
    
    this.currentCard.style.transition = 'transform 0.5s ease';
    this.currentCard.style.transform = `translate(${endX}px, 0) rotate(${endX * 0.1}deg)`;
    
    // Llama al callback correspondiente
    if (direction === 'right') {
      this.onSwipeRight(this.currentCard, this.cards.indexOf(this.currentCard));
    } else {
      this.onSwipeLeft(this.currentCard, this.cards.indexOf(this.currentCard));
    }
    
    // Prepara la siguiente tarjeta
    setTimeout(() => {
      this.prepareNextCard();
    }, 500);
  }
}
