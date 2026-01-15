// Simple Card Stack Carousel
let currentCardIndex = 0;
let isDetailsOpen = false;
const totalCards = 4;

// Initialize card stack
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeCardStack();
    }, 500);
});

function initializeCardStack() {
    updateCardStack();

    // Auto-rotate every 5 seconds (only when details are closed)
    setInterval(() => {
        if (!isDetailsOpen) {
            nextCard();
        }
    }, 5000);
}

function nextCard() {
    triggerLaptopScreenEffect();

    currentCardIndex = (currentCardIndex + 1) % totalCards;
    updateCardStack();

    // Animate next button
    const nextBtn = document.querySelector('.stack-nav.next');
    if (nextBtn) {
        gsap.to(nextBtn, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
}

function prevCard() {
    triggerLaptopScreenEffect();

    currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
    updateCardStack();

    // Animate prev button
    const prevBtn = document.querySelector('.stack-nav.prev');
    if (prevBtn) {
        gsap.to(prevBtn, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
}

function goToCard(index) {
    if (index < 0 || index >= totalCards) return;

    triggerLaptopScreenEffect();

    currentCardIndex = index;
    updateCardStack();

    // Animate indicator
    const dots = document.querySelectorAll('.stack-dot');
    if (dots[index]) {
        gsap.to(dots[index], {
            scale: 0.8,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
}

function updateCardStack() {
    const cards = document.querySelectorAll('.category-card');
    const dots = document.querySelectorAll('.stack-dot');

    if (cards.length === 0) return;

    // Reset all cards
    cards.forEach((card, index) => {
        card.classList.remove('active');

        // Calculate position in stack
        let position = (index - currentCardIndex + totalCards) % totalCards;

        // Apply stacking transforms - both sides like image
        switch (position) {
            case 0: // Front card (active) - center
                card.style.zIndex = '10';
                card.style.transform = 'translate(-50%, -50%) scale(1.1) rotateY(0deg) rotateZ(0deg)';
                card.style.opacity = '1';
                card.classList.add('active');
                break;
            case 1: // Right side card
                card.style.zIndex = '3';
                card.style.transform = 'translate(-50%, -50%) scale(0.85) rotateY(25deg) rotateZ(12deg) translateX(100px) translateY(-10px)';
                card.style.opacity = '0.7';
                break;
            case 2: // Left side card  
                card.style.zIndex = '3';
                card.style.transform = 'translate(-50%, -50%) scale(0.85) rotateY(-25deg) rotateZ(-12deg) translateX(-100px) translateY(-10px)';
                card.style.opacity = '0.7';
                break;
            case 3: // Back card - far behind
                card.style.zIndex = '1';
                card.style.transform = 'translate(-50%, -50%) scale(0.7) rotateY(0deg) rotateZ(0deg) translateY(20px)';
                card.style.opacity = '0.4';
                break;
        }
    });

    // Update indicators
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCardIndex);
    });
}

function toggleCardDetails(cardElement, category) {
    triggerLaptopScreenEffect();

    const detailsElement = cardElement.querySelector('.card-details');

    if (!detailsElement) return;

    // Close all other details first
    document.querySelectorAll('.card-details').forEach(details => {
        if (details !== detailsElement) {
            details.classList.remove('show');
        }
    });

    // Toggle current details
    const isCurrentlyOpen = detailsElement.classList.contains('show');

    if (isCurrentlyOpen) {
        // Close details
        detailsElement.classList.remove('show');
        isDetailsOpen = false;

        // Animate card back to normal
        gsap.to(cardElement, {
            scale: 1.05,
            rotationY: 0,
            duration: 0.4,
            ease: "power2.out"
        });

    } else {
        // Open details
        detailsElement.classList.add('show');
        isDetailsOpen = true;

        // Animate card expansion
        gsap.to(cardElement, {
            scale: 1.1,
            rotationY: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        // Animate detail items
        const detailItems = detailsElement.querySelectorAll('.detail-item');
        detailItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 20, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "back.out(1.7)"
                }
            );
        });

        // Show category notification
        showCategoryNotification(category);
    }

    // Add click animation
    gsap.to(cardElement, {
        scale: isCurrentlyOpen ? 1.05 : 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
}

function showCategoryNotification(category) {
    const categoryNames = {
        fashion: 'Fashion',
        gadgets: 'Gadgets',
        appliances: 'Appliances',
        adventure: 'Adventure'
    };

    const categoryIcons = {
        fashion: '👗',
        gadgets: '📱',
        appliances: '🏠',
        adventure: '🏕️'
    };

    const name = categoryNames[category] || 'Category';
    const icon = categoryIcons[category] || '🛍️';

    showNotification(icon, `${name} Details`, 'Explore rental options');
}

// Close details when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.category-card')) {
        document.querySelectorAll('.card-details.show').forEach(details => {
            details.classList.remove('show');
        });
        isDetailsOpen = false;
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (currentActiveSection === null) { // Only on hero section
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevCard();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextCard();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                e.preventDefault();
                goToCard(parseInt(e.key) - 1);
                break;
            case 'Escape':
                // Close all details
                document.querySelectorAll('.card-details.show').forEach(details => {
                    details.classList.remove('show');
                });
                isDetailsOpen = false;
                break;
        }
    }
});

// Touch/Swipe support for mobile
let startX = 0;
let endX = 0;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const stackContainer = document.querySelector('.card-stack-container');

        if (stackContainer) {
            stackContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            stackContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleStackSwipe();
            });
        }
    }, 500);
});

function handleStackSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold && !isDetailsOpen) {
        if (diff > 0) {
            // Swipe left - next card
            nextCard();
        } else {
            // Swipe right - previous card
            prevCard();
        }
    }
}

// Debug function
function debugCardStack() {
    console.log('Current Card Index:', currentCardIndex);
    console.log('Total Cards:', totalCards);
    console.log('Details Open:', isDetailsOpen);
    console.log('Cards:', document.querySelectorAll('.category-card').length);
}