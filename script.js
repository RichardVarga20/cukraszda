// Cart functionality
let cart = []
let cartCount = 0

// Cart DOM elements
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartClose = document.querySelector(".cart-close")
const cartCountElement = document.getElementById("cart-count")
const cartBody = document.getElementById("cart-body")
const cartItems = document.getElementById("cart-items")
const emptyCart = document.getElementById("empty-cart")
const cartFooter = document.getElementById("cart-footer")
const totalPrice = document.getElementById("total-price")

// Modal DOM elements
const modal = document.getElementById("masterpiece-modal")
const modalBody = document.getElementById("modal-body")
const modalClose = document.querySelector(".modal-close")

// Preloader DOM element
const preloader = document.getElementById("preloader")

// Navigation DOM elements
const header = document.querySelector(".header")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")

// Masterpieces data
const masterpieces = {
  opera: {
    title: "Opéra Royale",
    price: "18,500 Ft",
    description:
      "A klasszikus francia opéra torta újragondolt változata, amely a hagyományos ízeket modern prezentációval ötvözi.",
    fullDescription:
      "Ez a kivételes alkotás hat rétegből áll: mandulás piskóta, kávé buttercream, csokoládé ganache, és egy vékony arany réteg, amely minden harapásban tökéletes harmóniát teremt. A torta tetejét kézzel készített arany díszítés koronázza meg.",
    ingredients: [
      "Valrhona 70% csokoládé",
      "Madagaszkári bourbon vanília",
      "Francia Normandiai vaj",
      "Marcona mandula",
      "Etióp arabica kávé",
      "Étkezési arany",
    ],
    technique:
      "Hagyományos francia technikával készítjük, 48 órás folyamat során. Minden réteg külön-külön készül és pihen, hogy a tökéletes textúrát és ízharmóniát elérjük.",
    allergens: "Glutén, tojás, tej, mandula",
    storage: "Hűtőben tárolva 3 napig fogyasztható",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  millefeuille: {
    title: "Mille-feuille Impérial",
    price: "4,200 Ft",
    description: "Az ezer leveles tészta mestermű, amely a francia cukrászat koronagyémántja.",
    fullDescription:
      "Három réteg légies leveles tészta, közöttük vaníliakrém és friss gyümölcsök. A tetejét karamellizált cukor koronázza meg, amely minden harapásban ropogós textúrát biztosít.",
    ingredients: [
      "Francia vaj (82% zsírtartalom)",
      "Prémium liszt",
      "Bourbon vanília rúd",
      "Farm tojás",
      "Nádcukor",
      "Szezonális gyümölcsök",
    ],
    technique:
      "A leveles tésztát hagyományos módon, kézzel nyújtjuk és hajtogatjuk. A folyamat 24 órát vesz igénybe, hogy a tökéletes réteges szerkezetet elérjük.",
    allergens: "Glutén, tojás, tej",
    storage: "Frissen fogyasztandó, maximum 24 órán belül",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  sculpture: {
    title: "Sculpture Chocolat",
    price: "12,800 Ft",
    description: "Kézzel formázott csokoládé szobor, amely minden darabban egyedi művészeti alkotást képvisel.",
    fullDescription:
      "Minden szobor egyedi, kézzel formázott alkotás, amely belga single origin csokoládéból készül. A művészi forma és a kivételes íz tökéletes harmóniája.",
    ingredients: [
      "Belga Callebaut csokoládé",
      "Kakaóvaj",
      "Étkezési arany por",
      "Természetes színezékek",
      "Kézműves technika",
    ],
    technique:
      "Minden szobor egyedileg készül, temperálási technikával. A folyamat 6-8 órát vesz igénybe, és minden darab aláírott művészeti alkotás.",
    allergens: "Tej, szója (nyomokban dió)",
    storage: "Szobahőmérsékleten, száraz helyen 2 hétig tárolható",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
}

// Notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `

  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Auto remove
  setTimeout(() => {
    removeNotification(notification)
  }, 5000)

  // Close button
  notification.querySelector(".notification-close").addEventListener("click", () => {
    removeNotification(notification)
  })
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle"
    case "error":
      return "exclamation-triangle"
    case "warning":
      return "exclamation-circle"
    default:
      return "info-circle"
  }
}

function removeNotification(notification) {
  notification.classList.remove("show")
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

// Close modal function
function closeModal() {
  modal.style.display = "none"
  document.body.style.overflow = "visible"
}

// Initialize cart
function initializeCart() {
  // Load cart from localStorage
  const savedCart = localStorage.getItem("maestro-cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartDisplay()
  }

  // Cart button click
  cartBtn.addEventListener("click", openCart)

  // Close cart
  cartClose.addEventListener("click", closeCart)

  // Close cart when clicking outside
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      closeCart()
    }
  })

  // Close cart with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartModal.style.display === "block") {
      closeCart()
    }
  })
}

// Add item to cart
function addToCart(id, title, price, image) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: id,
      title: title,
      price: Number.parseFloat(price.replace(/[^\d]/g, "")),
      priceText: price,
      image: image,
      quantity: 1,
    })
  }

  updateCartDisplay()
  saveCart()
  showAddToCartAnimation()
  showNotification(`${title} hozzáadva a kosárhoz!`, "success")
}

// Remove item from cart
function removeFromCart(id) {
  const itemIndex = cart.findIndex((item) => item.id === id)
  if (itemIndex > -1) {
    const item = cart[itemIndex]

    // Add remove animation
    const cartItemElement = document.querySelector(`[data-cart-id="${id}"]`)
    if (cartItemElement) {
      cartItemElement.classList.add("cart-item-remove-animation")
      setTimeout(() => {
        cart.splice(itemIndex, 1)
        updateCartDisplay()
        saveCart()
        showNotification(`${item.title} eltávolítva a kosárból`, "info")
      }, 300)
    }
  }
}

// Update item quantity
function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      updateCartDisplay()
      saveCart()
    }
  }
}

// Clear entire cart
function clearCart() {
  if (cart.length === 0) return

  if (confirm("Biztosan törli az összes terméket a kosárból?")) {
    cart = []
    updateCartDisplay()
    saveCart()
    showNotification("Kosár kiürítve", "info")
  }
}

// Update cart display
function updateCartDisplay() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Update cart count badge
  cartCountElement.textContent = cartCount
  if (cartCount > 0) {
    cartCountElement.classList.add("show")
  } else {
    cartCountElement.classList.remove("show")
  }

  // Update cart modal content
  if (cart.length === 0) {
    emptyCart.style.display = "block"
    cartItems.style.display = "none"
    cartFooter.style.display = "none"
  } else {
    emptyCart.style.display = "none"
    cartItems.style.display = "block"
    cartFooter.style.display = "block"

    renderCartItems()
    updateCartTotal()
  }
}

// Render cart items
function renderCartItems() {
  cartItems.innerHTML = ""

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item cart-item-enter"
    cartItem.setAttribute("data-cart-id", item.id)

    cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.priceText}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)" ${item.quantity <= 1 ? "disabled" : ""}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Eltávolítás">
                <i class="fas fa-trash"></i>
            </button>
        `

    cartItems.appendChild(cartItem)
  })
}

// Update cart total
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  totalPrice.textContent = `${total.toLocaleString("hu-HU")} Ft`
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("maestro-cart", JSON.stringify(cart))
}

// Open cart modal
function openCart() {
  cartModal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Close cart modal
function closeCart() {
  cartModal.style.display = "none"
  document.body.style.overflow = "visible"
}

// Add to cart animation
function showAddToCartAnimation() {
  cartCountElement.classList.add("animate")
  setTimeout(() => {
    cartCountElement.classList.remove("animate")
  }, 600)
}

// Add to cart from modal
function addToCartFromModal(id) {
  const masterpiece = masterpieces[id]
  addToCart(id, masterpiece.title, masterpiece.price, masterpiece.image)
  closeModal()
}

// Update the existing orderMasterpiece function
function orderMasterpiece(id) {
  addToCartFromModal(id)
}

// Checkout process
function checkout() {
  if (cart.length === 0) {
    showNotification("A kosár üres!", "warning")
    return
  }

  // Create order summary
  const orderSummary = cart
    .map((item) => `${item.title} x${item.quantity} - ${(item.price * item.quantity).toLocaleString("hu-HU")} Ft`)
    .join("\n")

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Show success animation
  const successDiv = document.createElement("div")
  successDiv.className = "success-animation"
  successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Rendelés leadva!</h3>
        <p>Összesen: ${total.toLocaleString("hu-HU")} Ft</p>
        <p>Hamarosan felvesszük Önnel a kapcsolatot.</p>
    `

  document.body.appendChild(successDiv)

  // Remove success animation and clear cart
  setTimeout(() => {
    document.body.removeChild(successDiv)
    cart = []
    updateCartDisplay()
    saveCart()
    closeCart()

    // Scroll to contact form
    setTimeout(() => {
      document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })
    }, 500)
  }, 3000)

  console.log("Rendelés részletei:", {
    items: cart,
    total: total,
    orderSummary: orderSummary,
  })
}

// Show masterpiece details
function showMasterpiece(id) {
  const masterpiece = masterpieces[id]

  if (!masterpiece) {
    showNotification("A termék részletei nem találhatók!", "error")
    return
  }

  modalBody.innerHTML = `
        <div class="masterpiece-modal">
            <div class="modal-image">
                <img src="${masterpiece.image}" alt="${masterpiece.title}">
            </div>
            <div class="modal-content-text">
                <h2>${masterpiece.title}</h2>
                <p class="modal-price">${masterpiece.price}</p>
                <p class="modal-description">${masterpiece.fullDescription}</p>
                
                <div class="modal-section">
                    <h3>Összetevők</h3>
                    <ul class="ingredients-list">
                        ${masterpiece.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>Készítési technika</h3>
                    <p>${masterpiece.technique}</p>
                </div>
                
                <div class="modal-info">
                    <div class="info-row">
                        <strong>Allergének:</strong> ${masterpiece.allergens}
                    </div>
                    <div class="info-row">
                        <strong>Tárolás:</strong> ${masterpiece.storage}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="addToCartFromModal('${id}')">
                        <i class="fas fa-cart-plus"></i> Kosárba
                    </button>
                    <button class="btn btn-outline" onclick="closeModal()">Bezárás</button>
                </div>
            </div>
        </div>
    `

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Initialize preloader
function initializePreloader() {
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0"
      setTimeout(() => {
        preloader.style.display = "none"
        document.body.style.overflow = "visible"
      }, 500)
    }, 2000)
  })
}

// Initialize navigation
function initializeNavigation() {
  // Smooth scrolling
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 100
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
  })

  // Close mobile menu when clicking on link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })
}

// Initialize scroll effects
function initializeScrollEffects() {
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Header background change
    if (scrollTop > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      header.style.transform = "translateY(-100%)"
    } else {
      header.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })
}

// Initialize animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target

        // Add animation classes based on element type
        if (element.classList.contains("section-header")) {
          element.classList.add("animate-up")
        } else if (element.classList.contains("about-text")) {
          element.classList.add("animate-left")
        } else if (element.classList.contains("about-image")) {
          element.classList.add("animate-right")
        } else if (element.classList.contains("masterpiece-item")) {
          element.classList.add("animate-up")
        } else if (element.classList.contains("collection-item")) {
          element.classList.add("animate-up")
        }

        observer.unobserve(element)
      }
    })
  }, observerOptions)

  // Observe elements
  document
    .querySelectorAll(".section-header, .about-text, .about-image, .masterpiece-item, .collection-item")
    .forEach((el) => {
      observer.observe(el)
    })
}

// Initialize contact form
function initializeContactForm() {
  const form = document.getElementById("contact-form")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Validate form
    if (!validateForm(data)) {
      return
    }

    // Show loading state
    const submitBtn = form.querySelector("button[type='submit']")
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Küldés..."
    submitBtn.disabled = true

    // Simulate form submission
    setTimeout(() => {
      showNotification("Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.", "success")
      form.reset()
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }, 2000)
  })
}

// Form validation
function validateForm(data) {
  const { name, email, message, service } = data

  if (!name.trim()) {
    showNotification("Kérjük, adja meg a nevét!", "error")
    return false
  }

  if (!email.trim() || !isValidEmail(email)) {
    showNotification("Kérjük, adjon meg egy érvényes email címet!", "error")
    return false
  }

  if (!service) {
    showNotification("Kérjük, válassza ki a szolgáltatás típusát!", "error")
    return false
  }

  if (!message.trim()) {
    showNotification("Kérjük, írja meg üzenetét!", "error")
    return false
  }

  return true
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Initialize modal
function initializeModal() {
  modalClose.addEventListener("click", closeModal)

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal()
    }
  })
}

// Initialize parallax effects
function initializeParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".hero-image")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  })
}

// Initialize lazy loading
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Collection interactions
document.querySelectorAll(".collection-item").forEach((item) => {
  item.addEventListener("click", function () {
    const category = this.dataset.category
    showCollection(category)
  })
})

function showCollection(category) {
  showNotification(`${category} kollekció megnyitása...`, "info")
  // Here you would typically navigate to a collection page
}

// Reservation button
document.querySelector(".reservation-btn").addEventListener("click", () => {
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })
  document.querySelector("#service").value = "reservation"
})

// Hero buttons
document.querySelectorAll(".hero-buttons .btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault()
    if (this.textContent.includes("Kollekciók")) {
      document.querySelector("#collections").scrollIntoView({ behavior: "smooth" })
    } else if (this.textContent.includes("Asztalfoglalás")) {
      document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })
      document.querySelector("#service").value = "reservation"
    }
  })
})

// Gallery lightbox
document.querySelectorAll(".gallery-grid img").forEach((img) => {
  img.addEventListener("click", function () {
    const lightbox = document.createElement("div")
    lightbox.className = "lightbox"
    lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${this.src}" alt="${this.alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `

    document.body.appendChild(lightbox)
    document.body.style.overflow = "hidden"

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
        document.body.removeChild(lightbox)
        document.body.style.overflow = "visible"
      }
    })
  })
})

// Scroll to top functionality
function createScrollToTop() {
  const scrollBtn = document.createElement("button")
  scrollBtn.className = "scroll-to-top"
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: var(--secondary-color);
        color: var(--white);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        z-index: 1000;
        box-shadow: var(--shadow);
    `

  document.body.appendChild(scrollBtn)

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = "1"
      scrollBtn.style.visibility = "visible"
    } else {
      scrollBtn.style.opacity = "0"
      scrollBtn.style.visibility = "hidden"
    }
  })

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

createScrollToTop()

// Performance optimization
function optimizePerformance() {
  // Debounce scroll events
  let scrollTimeout
  const originalScrollHandler = window.onscroll

  window.onscroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    scrollTimeout = setTimeout(originalScrollHandler, 10)
  }

  // Preload critical images
  const criticalImages = [
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  ]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

optimizePerformance()

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializePreloader()
  initializeNavigation()
  initializeScrollEffects()
  initializeAnimations()
  initializeContactForm()
  initializeModal()
  initializeParallax()
  initializeLazyLoading()
  initializeCart()
})
