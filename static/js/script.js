// Navegación móvil
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }),
  )
}

// Carrusel del equipo
const carousel = document.getElementById("team-carousel")
const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")

if (carousel && prevBtn && nextBtn) {
  const cardWidth = 270 // 250px + 20px gap

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    })
  })

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    })
  })
}

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80 // Ajuste para navbar fija
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Animaciones al hacer scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up")
    }
  })
}, observerOptions)

// Observar elementos para animaciones
document.querySelectorAll(".product-card, .team-card, .contact-form").forEach((el) => {
  observer.observe(el)
})

// Efecto parallax en el hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallax = document.querySelector(".hero-animation")
  if (parallax) {
    const speed = scrolled * 0.5
    parallax.style.transform = `translateY(${speed}px)`
  }
})

// Cerrar mensajes flash
document.querySelectorAll(".flash-close").forEach((button) => {
  button.addEventListener("click", function () {
    this.parentElement.style.animation = "slideOut 0.3s ease forwards"
    setTimeout(() => {
      this.parentElement.remove()
    }, 300)
  })
})

// Auto-cerrar mensajes flash después de 5 segundos
document.querySelectorAll(".flash-message").forEach((message) => {
  setTimeout(() => {
    if (message.parentElement) {
      message.style.animation = "slideOut 0.3s ease forwards"
      setTimeout(() => {
        if (message.parentElement) {
          message.remove()
        }
      }, 300)
    }
  }, 5000)
})

// Agregar animación de salida para mensajes flash
const style = document.createElement("style")
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`
document.head.appendChild(style)

// Efecto de escritura para el título del hero
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Aplicar efecto de escritura al cargar la página
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const originalText = heroTitle.textContent
    typeWriter(heroTitle, originalText, 150)
  }
})

// Validación de formularios
const contactForm = document.querySelector('form[action*="contact"]')
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    const name = this.querySelector('input[name="name"]').value.trim()
    const email = this.querySelector('input[name="email"]').value.trim()
    const message = this.querySelector('textarea[name="message"]').value.trim()

    if (!name || !email || !message) {
      e.preventDefault()
      alert("Por favor, completa todos los campos.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      e.preventDefault()
      alert("Por favor, ingresa un email válido.")
      return
    }
  })
}

// Validación de formularios de autenticación
const authForms = document.querySelectorAll('form[method="POST"]')
authForms.forEach((form) => {
  form.addEventListener("submit", function (e) {
    const inputs = this.querySelectorAll("input[required]")
    let isValid = true

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false
        input.style.borderColor = "#ff4757"
      } else {
        input.style.borderColor = ""
      }
    })

    // Validación específica para registro
    if (this.querySelector('input[name="confirm_password"]')) {
      const password = this.querySelector('input[name="password"]').value
      const confirmPassword = this.querySelector('input[name="confirm_password"]').value

      if (password !== confirmPassword) {
        e.preventDefault()
        alert("Las contraseñas no coinciden.")
        return
      }

      if (password.length < 6) {
        e.preventDefault()
        alert("La contraseña debe tener al menos 6 caracteres.")
        return
      }
    }

    if (!isValid) {
      e.preventDefault()
      alert("Por favor, completa todos los campos requeridos.")
    }
  })
})

// Efecto hover para las tarjetas de productos
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
  })
})

// Contador animado para estadísticas (si se agregan en el futuro)
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  function updateCounter() {
    start += increment
    if (start < target) {
      element.textContent = Math.floor(start)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Lazy loading para imágenes
const images = document.querySelectorAll('img[src*="placeholder"]')
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.style.opacity = "0"
      img.style.transition = "opacity 0.3s ease"

      setTimeout(() => {
        img.style.opacity = "1"
      }, 100)

      observer.unobserve(img)
    }
  })
})

images.forEach((img) => imageObserver.observe(img))

// Efecto de partículas en el fondo (opcional)
function createParticles() {
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles"
  particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #ff6b35;
            border-radius: 50%;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
        `
    particlesContainer.appendChild(particle)
  }

  document.body.appendChild(particlesContainer)
}

// Activar partículas solo en pantallas grandes
if (window.innerWidth > 768) {
  createParticles()
}

console.log("🎮 Pipeishon website loaded successfully! 🎮")

// ==================== TETRIS GAME ====================

class TetrisGame {
  constructor() {
    this.canvas = document.getElementById("tetris-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.nextCanvas = document.getElementById("next-canvas")
    this.nextCtx = this.nextCanvas.getContext("2d")

    this.BOARD_WIDTH = 10
    this.BOARD_HEIGHT = 20
    this.BLOCK_SIZE = 30

    this.board = []
    this.currentPiece = null
    this.nextPiece = null
    this.score = 0
    this.level = 1
    this.lines = 0
    this.dropTime = 0
    this.dropInterval = 1000
    this.lastTime = 0
    this.gameRunning = false
    this.gamePaused = false

    this.colors = {
      I: "#00ffff", // Cyan
      O: "#ffff00", // Yellow
      T: "#ff0080", // Magenta
      S: "#00ff41", // Green
      Z: "#ff8000", // Orange
      J: "#8000ff", // Purple
      L: "#ff0080", // Pink
    }

    this.pieces = {
      I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      O: [
        [1, 1],
        [1, 1],
      ],
      T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
    }
  }

  init() {
    this.canvas.width = this.BOARD_WIDTH * this.BLOCK_SIZE
    this.canvas.height = this.BOARD_HEIGHT * this.BLOCK_SIZE
    this.nextCanvas.width = 4 * this.BLOCK_SIZE
    this.nextCanvas.height = 4 * this.BLOCK_SIZE
    this.ctx.scale(this.BLOCK_SIZE, this.BLOCK_SIZE)
    this.nextCtx.scale(this.BLOCK_SIZE, this.BLOCK_SIZE)
    this.resetBoard()
    this.generatePiece()
    this.generateNextPiece()
    this.gameRunning = true
    this.lastTime = 0
    this.dropTime = 0
    this.dropInterval = 1000
    this.score = 0
    this.level = 1
    this.lines = 0
    this.updateScore()
    this.updateLevel()
    this.updateLines()
    this.update()
  }

  resetBoard() {
    this.board = Array(this.BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(this.BOARD_WIDTH).fill(0))
  }

  generatePiece() {
    const pieceTypes = Object.keys(this.pieces)
    const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)]
    this.currentPiece = {
      type: randomType,
      shape: this.pieces[randomType],
      color: this.colors[randomType],
      x: Math.floor(this.BOARD_WIDTH / 2) - Math.ceil(this.pieces[randomType][0].length / 2),
      y: 0,
    }
  }

  generateNextPiece() {
    const pieceTypes = Object.keys(this.pieces)
    const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)]
    this.nextPiece = {
      type: randomType,
      shape: this.pieces[randomType],
      color: this.colors[randomType],
      x: Math.floor(this.BOARD_WIDTH / 2) - Math.ceil(this.pieces[randomType][0].length / 2),
      y: 0,
    }
  }

  drawPiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.ctx.fillStyle = this.currentPiece.color
          this.ctx.fillRect(this.currentPiece.x + x, this.currentPiece.y + y, 1, 1)
        }
      })
    })
  }

  drawNextPiece() {
    this.nextCtx.clearRect(0, 0, 4, 4)
    this.nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.nextCtx.fillStyle = this.nextPiece.color
          this.nextCtx.fillRect(x, y, 1, 1)
        }
      })
    })
  }

  dropPiece() {
    this.currentPiece.y++
    if (this.checkCollision()) {
      this.currentPiece.y--
      this.freezePiece()
      this.clearLines()
      this.generatePiece()
      this.generateNextPiece()
      if (this.checkCollision()) {
        this.gameOver()
      }
    }
  }

  checkCollision() {
    const { shape, x, y } = this.currentPiece
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const boardX = x + col
          const boardY = y + row
          if (
            boardX < 0 ||
            boardX >= this.BOARD_WIDTH ||
            boardY >= this.BOARD_HEIGHT ||
            this.board[boardY][boardX] !== 0
          ) {
            return true
          }
        }
      }
    }
    return false
  }

  freezePiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.board[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color
        }
      })
    })
  }

  clearLines() {
    let linesCleared = 0
    for (let y = 0; y < this.BOARD_HEIGHT; y++) {
      if (this.board[y].every((value) => value !== 0)) {
        this.board.splice(y, 1)
        this.board.unshift(Array(this.BOARD_WIDTH).fill(0))
        linesCleared++
      }
    }

    if (linesCleared > 0) {
      this.lines += linesCleared
      this.updateLines()
      this.score += this.level * linesCleared * 100
      this.updateScore()
      if (this.lines >= this.level * 10) {
        this.level++
        this.updateLevel()
        this.lines = 0
        this.updateLines()
        this.dropInterval *= 0.9
      }
    }
  }

  movePiece(direction) {
    const originalX = this.currentPiece.x
    this.currentPiece.x += direction
    if (this.checkCollision()) {
      this.currentPiece.x = originalX
    }
  }

  rotatePiece() {
    const originalShape = this.currentPiece.shape
    const rotatedShape = this.rotateMatrix(this.currentPiece.shape)
    this.currentPiece.shape = rotatedShape
    if (this.checkCollision()) {
      this.currentPiece.shape = originalShape
    }
  }

  rotateMatrix(matrix) {
    const N = matrix.length - 1
    const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]))
    return result
  }

  drawBoard() {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.ctx.fillStyle = value
          this.ctx.fillRect(x, y, 1, 1)
        } else {
          this.ctx.fillStyle = "#000"
          this.ctx.fillRect(x, y, 1, 1)
        }
      })
    })
  }

  updateScore() {
    document.getElementById("score").innerText = `Score: ${this.score}`
  }

  updateLevel() {
    document.getElementById("level").innerText = `Level: ${this.level}`
  }

  updateLines() {
    document.getElementById("lines").innerText = `Lines: ${this.lines}`
  }

  gameOver() {
    this.gameRunning = false
    alert("Game Over! Score: " + this.score)
    this.reset()
  }

  pauseGame() {
    this.gamePaused = !this.gamePaused
  }

  reset() {
    this.gameRunning = false
    this.gamePaused = false
    this.resetBoard()
    this.generatePiece()
    this.generateNextPiece()
    this.score = 0
    this.level = 1
    this.lines = 0
    this.dropTime = 0
    this.dropInterval = 1000
    this.updateScore()
    this.updateLevel()
    this.updateLines()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.init()
  }

  update(time = 0) {
    if (!this.gameRunning) {
      return
    }

    if (this.gamePaused) {
      requestAnimationFrame(this.update.bind(this))
      return
    }

    const deltaTime = time - this.lastTime
    this.lastTime = time
    this.dropTime += deltaTime

    if (this.dropTime > this.dropInterval) {
      this.dropPiece()
      this.dropTime = 0
    }

    this.drawBoard()
    this.drawPiece()
    this.drawNextPiece()
    requestAnimationFrame(this.update.bind(this))
  }
}

const tetris = new TetrisGame()

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    tetris.movePiece(-1)
  } else if (event.key === "ArrowRight") {
    tetris.movePiece(1)
  } else if (event.key === "ArrowDown") {
    tetris.dropPiece()
  } else if (event.key === "ArrowUp") {
    tetris.rotatePiece()
  } else if (event.key === " ") {
    tetris.pauseGame()
  } else if (event.key === "r") {
    tetris.reset()
  }
})

tetris.init()

