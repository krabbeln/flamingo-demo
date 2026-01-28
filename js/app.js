// Black Flamingo - Marketplace App

(function() {
    'use strict';

    // State (in memory only, no storage)
    let currentMode = 'buy'; // 'buy' or 'sell'

    // DOM Elements
    const modeToggle = document.getElementById('modeToggle');
    const buyLabel = document.querySelector('.mode-label--buy');
    const sellLabel = document.querySelector('.mode-label--sell');
    const heroTitle = document.getElementById('heroTitle');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryCards = document.querySelectorAll('.category-card');

    // Content for different modes
    const modeContent = {
        buy: {
            title: 'FIND WHAT YOU NEED',
            searchPlaceholder: ''
        },
        sell: {
            title: 'START RENTING TODAY',
            searchPlaceholder: 'What are you renting?'
        }
    };

    // Toggle between buy and sell mode
    function toggleMode() {
        const currentPage = window.location.pathname;
        const isElectronicsOrProductPage = currentPage.includes('electronics.html') ||
                                           currentPage.includes('product.html');

        // If on electronics/product page and clicking to sell mode, go to index in sell mode
        if (isElectronicsOrProductPage && currentMode === 'buy') {
            window.location.href = 'index.html?mode=sell';
            return;
        }

        // Otherwise, normal toggle behavior
        currentMode = currentMode === 'buy' ? 'sell' : 'buy';
        updateUI();
    }

    // Update UI based on current mode
    function updateUI() {
        const content = modeContent[currentMode];

        // Update toggle appearance
        modeToggle.classList.toggle('active', currentMode === 'sell');

        // Update labels
        buyLabel.classList.toggle('active', currentMode === 'buy');
        sellLabel.classList.toggle('active', currentMode === 'sell');

        // Update hero content
        heroTitle.textContent = content.title;

        // Set placeholder based on mode
        if (currentMode === 'sell') {
            searchInput.placeholder = content.searchPlaceholder;
        } else {
            // Buy mode: set random rotating placeholder immediately
            setRandomPlaceholder();
        }

        // Update body class for styling
        document.body.classList.toggle('sell-mode', currentMode === 'sell');
    }

    // Handle search
    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            console.log(`[${currentMode.toUpperCase()} MODE] Searching for: "${query}"`);
            // Future: navigate to search results page
            alert(`Searching for "${query}" in ${currentMode} mode\n\n(Search results page coming soon)`);
        }
    }

    // Rotating search placeholder - shared state and helper
    const placeholders = [
        'Flamingos..',
        'My Toothbrush..',
        'Macbook Air..',
        'Sony Alpha 7iii..',
        'Director Germany..',
        'Waldo..',
        'Nemo..',
        'Happiness..',
        'Brown Chair..',
        'Motivation..',
        'DJI Force Pro..',
        'Manfrotto Video Stativ..',
        'Penthouse..',
        'Atelier..',
        'Barbie`s Dreamhouse..',
        'Best Boy..',
        'Production Assistant..',
        'Blackmagic Pocket Cinema..',
        '4K Monitor..',
        'Light Box..'
    ];
    let lastPlaceholderIndex = -1;

    function setRandomPlaceholder() {
        if (!searchInput) return;

        let randomIndex;
        // Keep generating random index until it's different from last
        do {
            randomIndex = Math.floor(Math.random() * placeholders.length);
        } while (randomIndex === lastPlaceholderIndex && placeholders.length > 1);

        lastPlaceholderIndex = randomIndex;
        searchInput.placeholder = placeholders[randomIndex];
    }

    function initSearchPlaceholder() {
        if (!searchInput) return;

        // Set initial random placeholder immediately
        setRandomPlaceholder();

        // Then continue with random rotation
        const intervalId = setInterval(function() {
            setRandomPlaceholder();
        }, 1500);

        // Clear interval when page unloads
        window.addEventListener('beforeunload', function() {
            clearInterval(intervalId);
        });
    }

    // Handle category click
    function handleCategoryClick(event) {
        const card = event.currentTarget;
        const category = card.dataset.category;
        const categoryName = card.querySelector('.category-name').textContent;

        console.log(`[${currentMode.toUpperCase()} MODE] Selected category: ${category}`);

        // Navigate to category page if it exists
        if (category === 'electronics') {
            window.location.href = 'electronics.html';
        } else {
            alert(`Opening "${categoryName}" in ${currentMode} mode\n\n(Category page coming soon)`);
        }
    }

    // Product card click handlers (for electronics page)
    function initProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(function(card) {
            card.addEventListener('click', function() {
                window.location.href = 'product.html';
            });
        });
    }

    // Image gallery (for product detail page)
    function initGallery() {
        const track = document.getElementById('galleryTrack');
        const leftBtn = document.getElementById('galleryLeft');
        const rightBtn = document.getElementById('galleryRight');
        const dots = document.querySelectorAll('.gallery-dot');

        if (!track || !leftBtn || !rightBtn) return;

        let currentSlide = 0;
        const totalSlides = 5;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            currentSlide = index;
            track.style.transform = 'translateX(-' + (currentSlide * 20) + '%)';

            // Update dots
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        leftBtn.addEventListener('click', function() {
            goToSlide(currentSlide - 1);
        });

        rightBtn.addEventListener('click', function() {
            goToSlide(currentSlide + 1);
        });

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                goToSlide(parseInt(dot.dataset.index));
            });
        });
    }

    // Description expand/collapse (for product detail page)
    function initDescriptionToggle() {
        const description = document.getElementById('productDescription');
        const toggleBtn = document.getElementById('descriptionToggle');

        if (!description || !toggleBtn) return;

        toggleBtn.addEventListener('click', function() {
            description.classList.toggle('expanded');

            if (description.classList.contains('expanded')) {
                toggleBtn.textContent = 'SHOW LESS';
            } else {
                toggleBtn.textContent = 'READ MORE';
            }
        });
    }

    // Calendar for rental dates (for product detail page)
    function initCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthEl = document.getElementById('currentMonth');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        const totalPriceEl = document.getElementById('totalPrice');
        const rentalDaysEl = document.getElementById('rentalDays');
        const quickBtns = document.querySelectorAll('.duration-quick-btn');
        const rentButton = document.getElementById('rentButton');

        if (!calendarGrid) return;

        const dailyRate = 45;
        const MIN_RENTAL_DAYS = 2; // Minimum rental period
        let currentDate = new Date(2026, 1, 1); // Start at February 2026
        let selectedStart = null;
        let selectedEnd = null;

        const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
            'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

        function buildCalendar(year, month) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            const firstDayOfWeek = firstDay.getDay();
            const lastDateOfMonth = lastDay.getDate();

            calendarGrid.innerHTML = '';

            // Empty cells before day 1 (based on which weekday month starts)
            for (let i = 0; i < firstDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyCell);
            }

            // Current month's days only
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let date = 1; date <= lastDateOfMonth; date++) {
                const currentDateObj = new Date(year, month, date);
                currentDateObj.setHours(0, 0, 0, 0);
                const isPast = currentDateObj < today;

                const day = createDayElement(date, false, isPast, currentDateObj);
                calendarGrid.appendChild(day);
            }

            // Update month display
            currentMonthEl.textContent = monthNames[month] + ' ' + year;
        }

        function createDayElement(date, isOtherMonth, isDisabled, dateObj) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = date;

            if (isOtherMonth) {
                day.classList.add('other-month');
            }

            if (isDisabled) {
                day.classList.add('disabled');
            } else if (dateObj) {
                day.dataset.date = dateObj.toISOString().split('T')[0];

                // Check if this day is selected
                updateDaySelection(day, dateObj);

                // Add click handler
                day.addEventListener('click', function() {
                    handleDayClick(dateObj);
                });
            }

            return day;
        }

        function updateDaySelection(dayEl, dateObj) {
            const dateStr = dateObj.toISOString().split('T')[0];

            if (selectedStart && dateStr === selectedStart.toISOString().split('T')[0]) {
                dayEl.classList.add('start');
            }

            if (selectedEnd && dateStr === selectedEnd.toISOString().split('T')[0]) {
                dayEl.classList.add('end');
            }

            if (selectedStart && selectedEnd && dateObj > selectedStart && dateObj < selectedEnd) {
                dayEl.classList.add('in-range');
            }
        }

        function handleDayClick(dateObj) {
            if (!selectedStart || (selectedStart && selectedEnd)) {
                // Start new selection
                selectedStart = dateObj;
                selectedEnd = null;
            } else {
                // Select end date
                if (dateObj > selectedStart) {
                    // Calculate day difference
                    const timeDiff = dateObj - selectedStart;
                    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                    // Validate minimum rental period
                    if (days < MIN_RENTAL_DAYS) {
                        // Show visual feedback
                        const calendarWrapper = document.querySelector('.calendar-wrapper');
                        calendarWrapper.style.border = '2px solid #FF1493';

                        alert('Minimum rental period is ' + MIN_RENTAL_DAYS + ' days.\n\nPlease select at least ' + MIN_RENTAL_DAYS + ' days between your start and end dates.');

                        // Reset border after 1 second
                        setTimeout(function() {
                            calendarWrapper.style.border = '';
                        }, 1000);

                        // Reset selection to allow new choice
                        selectedStart = dateObj;
                        selectedEnd = null;
                    } else {
                        // Valid selection
                        selectedEnd = dateObj;
                    }
                } else {
                    // If clicked date is before start, make it the new start
                    selectedEnd = null;
                    selectedStart = dateObj;
                }
            }

            // Rebuild calendar to update visual states
            buildCalendar(currentDate.getFullYear(), currentDate.getMonth());
            calculatePrice();
        }

        function calculatePrice() {
            if (!selectedStart || !selectedEnd) {
                totalPriceEl.textContent = '$0';
                rentalDaysEl.textContent = '0';
                return;
            }

            const timeDiff = selectedEnd - selectedStart;
            const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const total = days * dailyRate;

            rentalDaysEl.textContent = days;
            totalPriceEl.textContent = '$' + total;
        }

        // Navigation buttons (restricted to February-April)
        prevMonthBtn.addEventListener('click', function() {
            if (currentDate.getMonth() === 1) return; // Can't go before February
            currentDate.setMonth(currentDate.getMonth() - 1);
            buildCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });

        nextMonthBtn.addEventListener('click', function() {
            if (currentDate.getMonth() === 3) return; // Can't go past April
            currentDate.setMonth(currentDate.getMonth() + 1);
            buildCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });

        // Quick select buttons
        quickBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const days = parseInt(btn.dataset.days);
                selectedStart = new Date(2026, 1, 1); // Start at Feb 1, 2026
                selectedStart.setHours(0, 0, 0, 0);
                selectedEnd = new Date(2026, 1, 1);
                selectedEnd.setDate(selectedEnd.getDate() + days);
                selectedEnd.setHours(0, 0, 0, 0);

                buildCalendar(currentDate.getFullYear(), currentDate.getMonth());
                calculatePrice();
            });
        });

        // Rent button
        if (rentButton) {
            rentButton.addEventListener('click', function() {
                if (!selectedStart || !selectedEnd) {
                    alert('Please select rental dates on the calendar');
                    return;
                }

                // Validate minimum rental period (safety check)
                const timeDiff = selectedEnd - selectedStart;
                const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                if (days < MIN_RENTAL_DAYS) {
                    alert('Minimum rental period is ' + MIN_RENTAL_DAYS + ' days. Please select a longer period.');
                    return;
                }

                const daysText = rentalDaysEl.textContent;
                const total = totalPriceEl.textContent;
                const startFormatted = selectedStart.toLocaleDateString();
                const endFormatted = selectedEnd.toLocaleDateString();

                alert('Rental request submitted!\n\nStart Date: ' + startFormatted + '\nEnd Date: ' + endFormatted + '\nDuration: ' + daysText + ' days\nTotal: ' + total + '\n\n(Checkout coming soon)');
            });
        }

        // Initial render
        buildCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }

    // Initialize event listeners
    function init() {
        // Check URL parameter for mode
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        if (modeParam === 'sell') {
            currentMode = 'sell';
        }

        // Mode toggle (only on pages with toggle)
        if (modeToggle) {
            modeToggle.addEventListener('click', toggleMode);
        }

        // Search functionality (only on pages with search)
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', handleSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
            // Initialize rotating placeholder
            initSearchPlaceholder();
        }

        // Category cards (only on home page)
        categoryCards.forEach(function(card) {
            card.addEventListener('click', handleCategoryClick);
        });

        // Product cards (electronics page)
        initProductCards();

        // Image gallery (product detail page)
        initGallery();

        // Description toggle (product detail page)
        initDescriptionToggle();

        // Calendar (product detail page)
        initCalendar();

        // Set initial state (only if elements exist)
        if (modeToggle && heroTitle) {
            updateUI();
        }

        console.log('Black Flamingo marketplace initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
