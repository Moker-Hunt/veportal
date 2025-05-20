// JavaScript для адаптивного дизайна

// Функция для обертывания только таблиц для горизонтальной прокрутки
function wrapScrollableElements() {
    // Только таблицы
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Проверяем, не обернута ли уже таблица
        if (!table.parentElement.classList.contains('table-wrapper')) {
            // Создаем обертку
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            
            // Заменяем таблицу оберткой
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            
            // Проверяем, нужна ли горизонтальная прокрутка
            checkOverflow(wrapper);
        }
    });
}

// Функция для проверки переполнения и добавления класса
function checkOverflow(wrapper) {
    if (wrapper.scrollWidth > wrapper.clientWidth) {
        wrapper.classList.add('has-overflow');
    } else {
        wrapper.classList.remove('has-overflow');
    }
}

// Функция для адаптивного меню
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle') || document.createElement('button');
    const navLinks = document.querySelector('.nav-links');
    
    // Если кнопка меню не существует, создаем её
    if (!document.querySelector('.menu-toggle')) {
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.insertBefore(menuToggle, navLinks);
        }
    }
    
    // Добавляем обработчик событий для кнопки меню
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Функция для обработки вкладок на мобильных устройствах
function setupMobileTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Прокручиваем к содержимому вкладки при нажатии на мобильных устройствах
            if (window.innerWidth < 768) {
                const tabId = this.getAttribute('data-tab');
                const tabPanel = document.getElementById(tabId);
                
                if (tabPanel) {
                    // Небольшая задержка для анимации
                    setTimeout(() => {
                        tabPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        });
    });
}

// Функция для обработки изменения размера окна
function handleResize() {
    const wrappers = document.querySelectorAll('.table-wrapper');
    wrappers.forEach(checkOverflow);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    wrapScrollableElements();
    setupMobileMenu();
    setupMobileTabs();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResize);
});
