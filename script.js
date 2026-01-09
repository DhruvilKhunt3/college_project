// Global variables
let selectedItemName = '';
let selectedItemPrice = 0;
let isLoggedIn = false;
let userRole = '';
let currentActiveSection = null;

// 1. Intro Animation Sequence with Laptop Screen Effect
window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();

    // Splash screen animation
    tl.to("#logo", { opacity: 1, scale: 1, duration: 1, ease: "power4.out" })
        .to("#logo", { letterSpacing: "10px", opacity: 0, duration: 0.8, delay: 0.5, ease: "power2.in" })
        .to("#splash-screen", { y: "-100%", duration: 1, ease: "expo.inOut" })
        .set("#main-content", { display: "block" })
        .to("#main-content", { opacity: 1, duration: 0.5 })

        // Bottom slider animation (laptop opening line)
        .to(".slider-line", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.3")

        // Only show hero section initially
        .to(".hero", {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            transformOrigin: "bottom center"
        }, "-=0.5")

        // Hide the bottom line after hero loads
        .to(".slider-line", {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.8,
            ease: "power2.inOut"
        }, "+=0.3");

    // Navbar animation
    tl.to(".reveal-nav", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=1");
});

// Show Section Function (Fullscreen - No Scroll)
function showSection(sectionId, navElement, event) {
    // Prevent default link behavior
    if (event) event.preventDefault();

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Add click animation to nav link
    navElement.classList.add('nav-link-clicked', 'clicked');

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to clicked nav link
    navElement.classList.add('active');

    // Hide current active section if exists
    if (currentActiveSection && currentActiveSection !== sectionId) {
        const currentSection = document.getElementById(currentActiveSection);
        if (currentSection) {
            currentSection.classList.add('section-slide-out');
            setTimeout(() => {
                currentSection.classList.add('section-hidden');
                currentSection.classList.remove('section-visible', 'section-slide-out');
            }, 500);
        }
    }

    // Show target section
    setTimeout(() => {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('section-hidden');
            targetSection.classList.add('section-visible', 'section-slide-in');

            // Animate individual items after section appears
            setTimeout(() => {
                gsap.utils.toArray(`#${sectionId} .reveal-stagger`).forEach((elem, index) => {
                    gsap.fromTo(elem,
                        { opacity: 0, y: 30, scale: 0.9 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.6,
                            delay: index * 0.08,
                            ease: "back.out(1.7)"
                        }
                    );
                });
            }, 300);
        }

        currentActiveSection = sectionId;
    }, currentActiveSection ? 500 : 0);

    // Remove click animation
    setTimeout(() => {
        navElement.classList.remove('nav-link-clicked', 'clicked');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('section-slide-in');
        }
    }, 800);
}

// Laptop Screen Slide Up Animation Function
function triggerLaptopScreenEffect() {
    const slider = document.querySelector('.slider-line');

    // Reset and show the bottom line
    gsap.set(slider, { scaleX: 1, transformOrigin: "left center" });
    gsap.fromTo(slider,
        { y: "100%", opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
                // Hide the line after showing
                gsap.to(slider, {
                    scaleX: 0,
                    transformOrigin: "right center",
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.inOut"
                });
            }
        }
    );
}

// Enhanced Category Click Handler
function handleCategoryClick(category, element) {
    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Add ripple effect
    element.classList.add('ripple-effect', 'active');

    // Enhanced click animation
    gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
            element.classList.remove('active');
            // Filter logic here
            console.log(`Filtering by category: ${category}`);
        }
    });

    // Add button click effect
    element.classList.add('btn-click-effect', 'clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 600);
}

// Enhanced Rent Click Handler
function handleRentClick(itemName, price, element) {
    selectedItemName = itemName;
    selectedItemPrice = price;

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Add ripple effect
    element.classList.add('ripple-effect', 'active');

    // Enhanced click animation
    gsap.to(element, {
        scale: 0.95,
        rotationY: 5,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
            element.classList.remove('active');

            if (isLoggedIn) {
                proceedWithRental();
            } else {
                showLoginModal(itemName, price);
            }
        }
    });

    // Add button click effect
    element.classList.add('btn-click-effect', 'clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 600);
}

// Show Login Modal with Bottom Slide Up Effect
function showLoginModal(itemName = '', price = 0) {
    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    const modal = new bootstrap.Modal(document.getElementById('loginModal'));

    // Reset modal to login step
    showLoginStep();

    if (itemName && price) {
        document.getElementById('selectedItem').innerHTML = `
            <strong>${itemName}</strong><br>
            <span class="text-primary">${price}/day</span>
        `;
    } else {
        document.getElementById('selectedItem').innerHTML = '';
    }

    // Show modal
    modal.show();

    // Add enhanced slide up animation
    setTimeout(() => {
        const modalDialog = document.querySelector('.modal-dialog');
        modalDialog.classList.add('modal-slide-up');

        gsap.fromTo(".modal-content",
            {
                scale: 0.7,
                opacity: 0,
                rotationX: 15,
                y: 100
            },
            {
                scale: 1,
                opacity: 1,
                rotationX: 0,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            }
        );
    }, 100);
}

// Show Login Step
function showLoginStep() {
    document.getElementById('loginStep').style.display = 'block';
    document.getElementById('roleStep').style.display = 'none';
    document.querySelector('.modal-title').textContent = 'Login Required';
}

// Show Role Selection Step with Laptop Screen Effect
function showRoleStep() {
    const loginStep = document.getElementById('loginStep');
    const roleStep = document.getElementById('roleStep');

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Animate out login step
    gsap.to(loginStep, {
        opacity: 0,
        x: -50,
        rotationY: -15,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
            loginStep.style.display = 'none';
            roleStep.style.display = 'block';
            document.querySelector('.modal-title').textContent = 'Choose Your Role';

            // Animate in role step
            gsap.fromTo(roleStep,
                { opacity: 0, x: 50, rotationY: 15 },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }
            );
        }
    });
}

// Go Back to Login with Laptop Screen Effect
function goBackToLogin() {
    const loginStep = document.getElementById('loginStep');
    const roleStep = document.getElementById('roleStep');

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Animate out role step
    gsap.to(roleStep, {
        opacity: 0,
        x: 50,
        rotationY: 15,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
            roleStep.style.display = 'none';
            loginStep.style.display = 'block';
            document.querySelector('.modal-title').textContent = 'Login Required';

            // Animate in login step
            gsap.fromTo(loginStep,
                { opacity: 0, x: -50, rotationY: -15 },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }
            );
        }
    });
}

// Select User Role with Laptop Screen Effect
function selectUserRole(role, event) {
    userRole = role;
    isLoggedIn = true;

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Animate role selection
    const selectedOption = event.currentTarget;
    selectedOption.classList.add('ripple-effect', 'active');

    gsap.to(selectedOption, {
        scale: 0.9,
        rotationY: 10,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
            selectedOption.classList.remove('active');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();

            // Show success message
            showRoleSuccessMessage(role);
        }
    });
}

// Handle Login Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trigger laptop screen effect
            triggerLaptopScreenEffect();

            // Simulate login process
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');

            setTimeout(() => {
                // Reset form
                loginForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');

                // Show role selection step
                showRoleStep();

            }, 1500);
        });
    }
});

// Show Role Success Message with Enhanced Animation
function showRoleSuccessMessage(role) {
    const roleText = role === 'customer' ? 'Customer' : 'Seller';
    const roleIcon = role === 'customer' ? '🛒' : '💼';

    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success position-fixed';
    successDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 320px;
        opacity: 0;
        transform: translateX(100%) rotateY(90deg);
        border-radius: 15px;
        backdrop-filter: blur(10px);
    `;
    successDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <span style="font-size: 1.5rem; margin-right: 10px;">${roleIcon}</span>
            <div>
                <strong>Welcome ${roleText}!</strong><br>
                ${selectedItemName ? `Proceeding with rental of <strong>${selectedItemName}</strong>` : 'You are now logged in'}
            </div>
        </div>
    `;

    document.body.appendChild(successDiv);

    // Enhanced animate in
    gsap.to(successDiv, {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
        gsap.to(successDiv, {
            opacity: 0,
            x: 100,
            rotationY: 90,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => successDiv.remove()
        });

        // Proceed based on role and context
        if (selectedItemName) {
            proceedWithRental();
        } else {
            updateUIForRole(role);
        }
    }, 4000);
}

// Update UI for Role
function updateUIForRole(role) {
    // Update navbar login button
    const loginBtn = document.querySelector('.navbar .btn');
    const loginIcon = loginBtn.querySelector('.login-icon');
    const roleIcon = role === 'customer' ? '🛒' : '💼';

    loginIcon.textContent = roleIcon;
    loginBtn.innerHTML = `<span class="login-icon">${roleIcon}</span>${role === 'customer' ? 'Customer' : 'Seller'}`;
    loginBtn.onclick = () => showUserMenu(role);

    // Animate button change
    gsap.from(loginBtn, {
        scale: 0.8,
        duration: 0.5,
        ease: "back.out(1.7)"
    });

    console.log(`UI updated for ${role} role`);
}

// Show User Menu (placeholder)
function showUserMenu(role) {
    triggerLaptopScreenEffect();
    console.log(`Showing ${role} menu`);
    // Here you would show user-specific menu options
}

// Proceed with Rental (placeholder)
function proceedWithRental() {
    triggerLaptopScreenEffect();
    console.log(`Proceeding with rental of ${selectedItemName} for ${selectedItemPrice}/day as ${userRole}`);
    // Here you would typically redirect to payment or booking page
}

// Add interactive effects to all clickable elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button, .service-card, .card-custom, .nav-link').forEach(element => {
        element.classList.add('interactive-element');
    });
});