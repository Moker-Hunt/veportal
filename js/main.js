// Optimizar rendimiento
const optimizePerformance = () => {
    // Usar requestAnimationFrame para animaciones
    window.requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame;
    
    // Detectar soporte para características avanzadas
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsPassiveEvents = (function() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        return supportsPassive;
    })();
    
    // Usar eventos pasivos para mejorar el rendimiento del scroll
    const passiveOption = supportsPassiveEvents ? { passive: true } : false;
    document.addEventListener('scroll', function() {}, passiveOption);
    document.addEventListener('touchmove', function() {}, passiveOption);
    
    return { supportsIntersectionObserver, supportsPassiveEvents };
};

// Inicializar optimizaciones
const { supportsIntersectionObserver } = optimizePerformance();

document.addEventListener('DOMContentLoaded', function() {
    // Elementos globales
    const header = document.querySelector('.header');
    const scrollProgress = document.querySelector('.scroll-progress');
    const cursorFollower = document.querySelector('.cursor-follower');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const showcaseButtons = document.querySelectorAll('.showcase-btn');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const glitchElements = document.querySelectorAll('.glitch-text');
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Inicialización de elementos interactivos
    initializeDeviceMockups();
    initializeTabPanels();
    initializeShowcasePanels();
    
    // Funcionalidad del botón volver arriba
    window.addEventListener('scroll', function() {
        if (backToTopButton) {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    });
    
    // Evento de clic para el botón volver arriba
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Seguimiento del cursor personalizado
    document.addEventListener('mousemove', function(e) {
        if (cursorFollower) {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }
    });
    
    // Efecto hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .accordion-header, .tab-btn, .showcase-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (cursorFollower) {
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
                cursorFollower.style.backgroundColor = 'rgba(216, 158, 0, 0.1)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (cursorFollower) {
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
                cursorFollower.style.backgroundColor = 'rgba(216, 158, 0, 0.2)';
            }
        });
    });
    
    // Barra de progreso de scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercentage + '%';
        }
    });

    // Navigation scroll behavior
    let lastScrollTop = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > scrollThreshold) {
            // Scrolling down
            if (currentScroll > lastScrollTop) {
                header.classList.add('header-hidden');
            } 
            // Scrolling up
            else {
                header.classList.remove('header-hidden');
            }
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Animate hamburger to X
            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
            
            if (navList.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navList && navList.classList.contains('active') && !event.target.closest('.main-nav')) {
            navList.classList.remove('active');
            
            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.remove('active'));
            
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Navegación suave al hacer clic en enlaces internos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Cerrar menú móvil si está abierto
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                
                const bars = menuToggle.querySelectorAll('.bar');
                bars.forEach(bar => bar.classList.remove('active'));
                
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
            
            // Scroll suave a la sección
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Tabs en la sección de herramientas
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Desactivar todos los botones y paneles
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                
                // Activar el botón y panel seleccionados
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Botones de showcase en la sección de análisis
    if (showcaseButtons.length > 0) {
        showcaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const showcaseId = this.getAttribute('data-showcase');
                
                // Desactivar todos los botones y paneles
                showcaseButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.showcase-panel').forEach(panel => panel.classList.remove('active'));
                
                // Activar el botón y panel seleccionados
                this.classList.add('active');
                document.getElementById(showcaseId).classList.add('active');
            });
        });
    }

    // FAQ Accordion
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', function() {
                // Close all other items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
    
    // Efecto de glitch en textos
    if (glitchElements.length > 0) {
        glitchElements.forEach(element => {
            setInterval(() => {
                element.classList.add('glitch-active');
                setTimeout(() => {
                    element.classList.remove('glitch-active');
                }, 200);
            }, 5000);
        });
    }
    
    // Animación de elementos al hacer scroll
    const animateOnScroll = function() {
        const animatedElements = document.querySelectorAll('.animated-title, .feature-card, .content-block, .stat-item, .comparison-column, .showcase-visual');
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Ejecutar animación inicial y al hacer scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Partículas en el hero
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Posición aleatoria
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Tamaño aleatorio
            const size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Opacidad aleatoria
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Animación aleatoria
            const duration = Math.random() * 20 + 10;
            particle.style.animation = `float ${duration}s infinite ease-in-out`;
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            heroParticles.appendChild(particle);
        }
    }
    
    // Inicializar animaciones de aparición
    initializeScrollAnimations();
    
    // Mejorar efecto de cursor
    enhanceCursorEffect();
    
    // Añadir efecto parallax
    initializeParallaxEffect();
    
    // Navegación suave
    initializeSmoothScrolling();
    
    // Inicializar botón de scroll
    initializeScrollButton();
    
    // Funciones de inicialización
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.content-item, .testimonial-card, .showcase-panel, .tab-panel, .accordion-item, .approach-block');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            // Añadir clase inicial para el estado pre-animación
            element.classList.add('pre-animate');
            observer.observe(element);
        });
    }
    
    function initializeDeviceMockups() {
        // Alternancia entre dispositivos vepormas y bx+ en los mockups
        const deviceMockups = document.querySelectorAll('.device-mockup, .laptop-mockup');
        
        deviceMockups.forEach(mockup => {
            mockup.addEventListener('click', function() {
                const vepormasScreen = this.querySelector('.vepormas-screen, .vepormas-web');
                const bxScreen = this.querySelector('.bx-screen, .bx-web');
                
                if (vepormasScreen && bxScreen) {
                    if (vepormasScreen.style.transform === 'translateX(-100%)') {
                        // Mostrar vepormas
                        vepormasScreen.style.transform = 'translateX(0)';
                        vepormasScreen.style.opacity = '1';
                        bxScreen.style.transform = 'translateX(100%)';
                        bxScreen.style.opacity = '0';
                    } else {
                        // Mostrar bx+
                        vepormasScreen.style.transform = 'translateX(-100%)';
                        vepormasScreen.style.opacity = '0';
                        bxScreen.style.transform = 'translateX(0)';
                        bxScreen.style.opacity = '1';
                    }
                }
            });
        });
    }
    
    function initializeTabPanels() {
        // Asegurar que las pestañas funcionen correctamente
        if (tabButtons.length > 0) {
            // Activar la primera pestaña por defecto si ninguna está activa
            const activeTab = document.querySelector('.tab-btn.active');
            if (!activeTab && tabButtons.length > 0) {
                tabButtons[0].classList.add('active');
                const firstTabId = tabButtons[0].getAttribute('data-tab');
                if (firstTabId) {
                    const firstTabPanel = document.getElementById(firstTabId);
                    if (firstTabPanel) {
                        firstTabPanel.classList.add('active');
                    }
                }
            }
            
            // Añadir tooltips a los botones de pestañas
            tabButtons.forEach(button => {
                const tabName = button.textContent.trim();
                button.setAttribute('title', `Ver información sobre ${tabName}`);
            });
        }
    }
    
    function initializeShowcasePanels() {
        // Asegurar que los paneles de showcase funcionen correctamente
        if (showcaseButtons.length > 0) {
            // Activar el primer panel por defecto si ninguno está activo
            const activeShowcase = document.querySelector('.showcase-btn.active');
            if (!activeShowcase && showcaseButtons.length > 0) {
                showcaseButtons[0].classList.add('active');
                const firstShowcaseId = showcaseButtons[0].getAttribute('data-showcase');
                if (firstShowcaseId) {
                    const firstShowcasePanel = document.getElementById(firstShowcaseId);
                    if (firstShowcasePanel) {
                        firstShowcasePanel.classList.add('active');
                    }
                }
            }
            
            // Añadir tooltips a los botones de showcase
            showcaseButtons.forEach(button => {
                const showcaseName = button.textContent.trim();
                button.setAttribute('title', `Ver información sobre ${showcaseName}`);
            });
        }
    }
    
    function enhanceCursorEffect() {
        // Elementos interactivos que deben tener efecto de cursor
        const interactiveElements = document.querySelectorAll('a, button, .tab-btn, .showcase-btn, .accordion-header, .content-item, .testimonial-card, .device-mockup, .laptop-mockup');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                if (cursorFollower) {
                    cursorFollower.style.width = '60px';
                    cursorFollower.style.height = '60px';
                    cursorFollower.style.backgroundColor = 'rgba(216, 158, 0, 0.15)';
                    cursorFollower.style.mixBlendMode = 'multiply';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (cursorFollower) {
                    cursorFollower.style.width = '40px';
                    cursorFollower.style.height = '40px';
                    cursorFollower.style.backgroundColor = 'rgba(216, 158, 0, 0.2)';
                    cursorFollower.style.mixBlendMode = 'multiply';
                }
            });
            
            // Efecto de clic
            element.addEventListener('mousedown', function() {
                if (cursorFollower) {
                    cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.9)';
                    cursorFollower.style.backgroundColor = 'rgba(216, 158, 0, 0.25)';
                }
            });
            
            element.addEventListener('mouseup', function() {
                if (cursorFollower) {
                    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorFollower.style.backgroundColor = 'rgba(216, 158, 0, 0.15)';
                }
            });
        });
    }
    
    function initializeParallaxEffect() {
        // Elementos que tendrán efecto parallax
        const parallaxElements = document.querySelectorAll('.hero-shape, .comparison::before, .comparison::after, .faq::before, .testimonials::before, .testimonials::after');
        
        // Efecto parallax al hacer scroll
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = 0.1; // Velocidad del efecto (ajustar según necesidad)
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
        
        // Efecto parallax al mover el mouse
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            parallaxElements.forEach(element => {
                const speed = 20; // Intensidad del efecto (ajustar según necesidad)
                const xPos = (mouseX - 0.5) * speed;
                const yPos = (mouseY - 0.5) * speed;
                
                element.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });
    }
    
    function initializeSmoothScrolling() {
        // Obtener todos los enlaces de navegación
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Prevenir el comportamiento predeterminado
                e.preventDefault();
                
                // Obtener el destino del enlace
                const targetId = this.getAttribute('href');
                
                // Si el destino es solo '#', ir al inicio de la página
                if (targetId === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }
                
                // Obtener el elemento destino
                const targetElement = document.querySelector(targetId);
                
                // Si el elemento existe, desplazarse suavemente hasta él
                if (targetElement) {
                    // Cerrar el menú móvil si está abierto
                    const navList = document.querySelector('.nav-list');
                    if (navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        document.querySelector('.menu-toggle').classList.remove('active');
                    }
                    
                    // Calcular la posición de desplazamiento (restar la altura del header)
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    // Desplazarse suavemente hasta el destino
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar la URL con el hash
                    history.pushState(null, null, targetId);
                    
                    // Actualizar la clase active en los enlaces de navegación
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        // Detectar la sección actual al hacer scroll
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Obtener todas las secciones
            const sections = document.querySelectorAll('section');
            
            // Encontrar la sección actual
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    const currentId = '#' + section.getAttribute('id');
                    
                    // Actualizar la clase active en los enlaces de navegación
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                        if (navLink.getAttribute('href') === currentId) {
                            navLink.classList.add('active');
                        }
                    });
                }
            });
        });
    }
    
    function initializeScrollButton() {
        // Obtener el botón de scroll
        const scrollButton = document.querySelector('.scroll-indicator');
        const introSection = document.querySelector('#introduccion');
        
        if (scrollButton && introSection) {
            scrollButton.addEventListener('click', function() {
                // Calcular la posición de la sección de introducción
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = introSection.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                // Desplazarse suavemente hasta la sección
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
            
            // Mostrar/ocultar el botón según la posición de scroll
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    scrollButton.style.opacity = '0';
                    scrollButton.style.pointerEvents = 'none';
                } else {
                    scrollButton.style.opacity = '1';
                    scrollButton.style.pointerEvents = 'auto';
                }
            });
        }
    }
});
