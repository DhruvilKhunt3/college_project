// Global variables
let selectedItemName = '';
let selectedItemPrice = 0;
let isLoggedIn = false;
let userRole = '';
let currentActiveSection = null;
let currentAuthMode = 'login'; // 'login' or 'signup'
let userData = {};

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

// Go to Home Function
function goToHome(navElement, event) {
    // Prevent default link behavior
    if (event) event.preventDefault();

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Special home button click animation
    const homeIcon = navElement.querySelector('.nav-icon');
    navElement.classList.add('clicked');

    // Enhanced home icon animation sequence
    gsap.timeline()
        .to(homeIcon, {
            scale: 1.6,
            rotation: 180,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(homeIcon, {
            scale: 1.2,
            rotation: 360,
            duration: 0.3,
            ease: "back.out(1.7)"
        })
        .to(homeIcon, {
            scale: 1,
            rotation: 0,
            duration: 0.2,
            ease: "power2.inOut"
        });

    // Add click animation to nav link
    navElement.classList.add('nav-link-clicked', 'clicked');

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to home nav link
    navElement.classList.add('active');

    // Hide current active section if exists
    if (currentActiveSection) {
        const currentSection = document.getElementById(currentActiveSection);
        if (currentSection) {
            currentSection.classList.add('section-slide-out');
            setTimeout(() => {
                currentSection.classList.add('section-hidden');
                currentSection.classList.remove('section-visible', 'section-slide-out');
            }, 500);
        }
        currentActiveSection = null;
    }

    // Show hero section with animation
    setTimeout(() => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Reset hero section visibility
            heroSection.style.display = 'flex';

            // Animate hero section back in
            gsap.fromTo(heroSection,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            );

            // Animate hero title
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) {
                gsap.fromTo(heroTitle,
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: 0.3,
                        ease: "power2.out"
                    }
                );
            }

            // Animate hero subtitle
            const heroSubtitle = heroSection.querySelector('.lead');
            if (heroSubtitle) {
                gsap.fromTo(heroSubtitle,
                    {
                        opacity: 0,
                        y: 20
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: 0.5,
                        ease: "power2.out"
                    }
                );
            }

            // Add welcome back effect
            showWelcomeBackEffect();
        }
    }, currentActiveSection ? 500 : 0);

    // Remove click animation
    setTimeout(() => {
        navElement.classList.remove('nav-link-clicked', 'clicked');
    }, 800);
}

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

    // Hide hero section when showing other sections
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        gsap.to(heroSection, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                heroSection.style.display = 'none';
            }
        });
    }

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
    }, currentActiveSection ? 500 : 400);

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

// Show Auth Modal with specific mode
function showAuthModal(mode = 'login') {
    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    const modal = new bootstrap.Modal(document.getElementById('loginModal'));

    // Show the correct section
    if (mode === 'login') {
        showLoginSection();
    } else {
        showSignupSection();
    }

    // Show modal with enhanced animation
    modal.show();

    setTimeout(() => {
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

// Show Login Section
function showLoginSection() {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const roleStep = document.getElementById('roleStep');

    // Hide other sections
    signupSection.style.display = 'none';
    roleStep.style.display = 'none';

    // Show login section
    loginSection.style.display = 'block';

    // Update modal title
    document.querySelector('.modal-title').textContent = 'Welcome Back';

    // Clear forms
    clearFormValidation(document.getElementById('loginForm'));
}

// Show Signup Section
function showSignupSection() {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const roleStep = document.getElementById('roleStep');

    // Hide other sections
    loginSection.style.display = 'none';
    roleStep.style.display = 'none';

    // Show signup section
    signupSection.style.display = 'block';

    // Update modal title
    document.querySelector('.modal-title').textContent = 'Join RENTIT';

    // Clear forms
    clearFormValidation(document.getElementById('signupForm'));

    // Initialize user type toggle
    initializeUserTypeToggle();
}

// Switch between Login and Signup with animations
function switchToSignup() {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Animate out login section
    gsap.to(loginSection, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            loginSection.style.display = 'none';
            signupSection.style.display = 'block';
            document.querySelector('.modal-title').textContent = 'Join RENTIT';

            // Animate in signup section
            gsap.fromTo(signupSection,
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                }
            );

            // Initialize user type toggle
            initializeUserTypeToggle();
        }
    });
}

function switchToLogin() {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Animate out signup section
    gsap.to(signupSection, {
        x: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            signupSection.style.display = 'none';
            loginSection.style.display = 'block';
            document.querySelector('.modal-title').textContent = 'Welcome Back';

            // Animate in login section
            gsap.fromTo(loginSection,
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                }
            );
        }
    });
}

// Initialize User Type Toggle
function initializeUserTypeToggle() {
    const customerRadio = document.getElementById('customerType');
    const sellerRadio = document.getElementById('sellerType');
    const toggleSlider = document.querySelector('.toggle-slider');

    // Add change event listeners
    customerRadio.addEventListener('change', () => {
        if (customerRadio.checked) {
            animateToggleSwitch('customer');
        }
    });

    sellerRadio.addEventListener('change', () => {
        if (sellerRadio.checked) {
            animateToggleSwitch('seller');
        }
    });

    // Set initial state
    customerRadio.checked = true;
    animateToggleSwitch('customer');
}

// Animate Toggle Switch
function animateToggleSwitch(type) {
    const toggleSlider = document.querySelector('.toggle-slider');
    const customerLabel = document.querySelector('label[for="customerType"]');
    const sellerLabel = document.querySelector('label[for="sellerType"]');

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    if (type === 'customer') {
        // Animate to customer side
        gsap.to(toggleSlider, {
            x: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        // Update colors and animations
        gsap.to(toggleSlider, {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.2)',
            duration: 0.3
        });

        // Animate icons
        gsap.to(customerLabel.querySelector('.toggle-icon'), {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: "back.out(1.7)"
        });

        gsap.to(sellerLabel.querySelector('.toggle-icon'), {
            scale: 1,
            rotation: 0,
            duration: 0.3
        });

    } else {
        // Animate to seller side
        const toggleWidth = toggleSlider.parentElement.offsetWidth / 2;
        gsap.to(toggleSlider, {
            x: toggleWidth - 4,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        // Update colors
        gsap.to(toggleSlider, {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.2)',
            duration: 0.3
        });

        // Animate icons
        gsap.to(sellerLabel.querySelector('.toggle-icon'), {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: "back.out(1.7)"
        });

        gsap.to(customerLabel.querySelector('.toggle-icon'), {
            scale: 1,
            rotation: 0,
            duration: 0.3
        });
    }
}

// Password Toggle Functionality
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggleBtn = field.parentElement.querySelector('.password-toggle');

    if (field.type === 'password') {
        field.type = 'text';
        toggleBtn.textContent = '🙈';

        // Animate toggle button
        gsap.to(toggleBtn, {
            scale: 1.2,
            rotation: 10,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
    } else {
        field.type = 'password';
        toggleBtn.textContent = '👁️';

        // Animate toggle button
        gsap.to(toggleBtn, {
            scale: 1.2,
            rotation: -10,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
    }
}

// Enhanced Password Strength Indicator
function updatePasswordStrength(password) {
    const strengthIndicator = document.querySelector('.password-strength-indicator');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (!strengthIndicator || !strengthFill || !strengthText) {
        console.log('Password strength elements not found');
        return;
    }

    const length = password.length;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    let strength = 0;
    let strengthLevel = '';
    let strengthColor = '';

    if (length >= 6) strength++;
    if (hasLetter) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    if (hasUpperCase) strength++;

    // Remove existing classes
    strengthIndicator.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

    if (strength <= 2) {
        strengthLevel = 'Weak';
        strengthColor = '#dc3545';
        strengthIndicator.classList.add('strength-weak');
    } else if (strength <= 3) {
        strengthLevel = 'Medium';
        strengthColor = '#ffc107';
        strengthIndicator.classList.add('strength-medium');
    } else {
        strengthLevel = 'Strong';
        strengthColor = '#28a745';
        strengthIndicator.classList.add('strength-strong');
    }

    strengthText.textContent = `Password strength: ${strengthLevel}`;
    strengthText.style.color = strengthColor;

    // Animate strength bar
    if (typeof gsap !== 'undefined') {
        gsap.to(strengthFill, {
            width: `${(strength / 5) * 100}%`,
            duration: 0.3,
            ease: "power2.out"
        });
    } else {
        strengthFill.style.width = `${(strength / 5) * 100}%`;
    }
}

// Social login functions removed - using direct login/signup only

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

// Go Back to Auth with Laptop Screen Effect
function goBackToAuth() {
    const authStep = document.getElementById('authStep');
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
            authStep.style.display = 'block';
            document.querySelector('.modal-title').textContent = 'Welcome to RENTIT';

            // Animate in auth step
            gsap.fromTo(authStep,
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

// Initialize Authentication System
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    loadUserData();
});

// Initialize Authentication Event Listeners
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Real-time validation
    setupFormValidation();
}

// Handle Login Form Submission
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validate form
    if (!validateLoginForm(email, password)) {
        return;
    }

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    const submitBtn = document.getElementById('loginBtn');
    const spinner = submitBtn.querySelector('.btn-spinner');

    // Show loading state
    setButtonLoading(submitBtn, spinner, true);

    // Simulate API call
    setTimeout(() => {
        const storedUsers = getStoredUsers();
        const user = storedUsers.find(u => u.email === email && u.password === password);

        if (user) {
            // Login successful
            userData = user;
            isLoggedIn = true;

            // Store current session
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            // Reset form and button
            document.getElementById('loginForm').reset();
            setButtonLoading(submitBtn, spinner, false);
            clearFormValidation(document.getElementById('loginForm'));

            // Show role selection
            showRoleStep();
        } else {
            // Login failed
            setButtonLoading(submitBtn, spinner, false);
            showFormError('loginEmail', 'Invalid email or password');
            showFormError('loginPassword', 'Invalid email or password');

            // Shake animation for error
            gsap.to('.modal-content', {
                x: [-10, 10, -10, 10, 0],
                duration: 0.5,
                ease: "power2.inOut"
            });
        }
    }, 1500);
}

// Handle Signup Form Submission
function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate form
    if (!validateSignupForm(name, email, password, confirmPassword, agreeTerms)) {
        return;
    }

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    const submitBtn = document.getElementById('signupBtn');
    const spinner = submitBtn.querySelector('.btn-spinner');

    // Show loading state
    setButtonLoading(submitBtn, spinner, true);

    // Simulate API call
    setTimeout(() => {
        const storedUsers = getStoredUsers();

        // Check if user already exists
        if (storedUsers.find(u => u.email === email)) {
            setButtonLoading(submitBtn, spinner, false);
            showFormError('signupEmail', 'An account with this email already exists');
            return;
        }

        // Create new user with selected type
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            userType: userType,
            createdAt: new Date().toISOString()
        };

        // Store user
        storedUsers.push(newUser);
        localStorage.setItem('rentitUsers', JSON.stringify(storedUsers));

        // Set as current user
        userData = newUser;
        userRole = userType;
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'true');

        // Reset form and button
        document.getElementById('signupForm').reset();
        setButtonLoading(submitBtn, spinner, false);
        clearFormValidation(document.getElementById('signupForm'));

        // Show success message
        showSignupSuccess(name, userType);

        // Close modal and update UI
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            updateUIForLoggedInUser();
        }, 2500);

    }, 1500);
}

// Form Validation Functions
function validateLoginForm(email, password) {
    let isValid = true;

    // Clear previous errors
    clearFormValidation(document.getElementById('loginForm'));

    // Email validation
    if (!email) {
        showFormError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFormError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!password) {
        showFormError('loginPassword', 'Password is required');
        isValid = false;
    }

    return isValid;
}

function validateSignupForm(name, email, password, confirmPassword, agreeTerms) {
    let isValid = true;

    // Clear previous errors
    clearFormValidation(document.getElementById('signupForm'));

    // Name validation
    if (!name || name.trim().length < 2) {
        showFormError('signupName', 'Name must be at least 2 characters long');
        isValid = false;
    }

    // Email validation
    if (!email) {
        showFormError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFormError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!password) {
        showFormError('signupPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFormError('signupPassword', 'Password must be at least 6 characters long');
        isValid = false;
    } else if (!isStrongPassword(password)) {
        showFormError('signupPassword', 'Password should contain letters and numbers');
        isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
        showFormError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showFormError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    // Terms validation
    if (!agreeTerms) {
        showFormError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }

    return isValid;
}

// Real-time Form Validation Setup
function setupFormValidation() {
    // Login form real-time validation
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    if (loginEmail) {
        loginEmail.addEventListener('blur', () => {
            const email = loginEmail.value;
            if (email && !isValidEmail(email)) {
                showFormError('loginEmail', 'Please enter a valid email address');
            } else if (email) {
                clearFieldError('loginEmail');
            }
        });
    }

    // Signup form real-time validation
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    if (signupName) {
        signupName.addEventListener('blur', () => {
            const name = signupName.value.trim();
            if (name && name.length < 2) {
                showFormError('signupName', 'Name must be at least 2 characters long');
            } else if (name) {
                clearFieldError('signupName');
            }
        });
    }

    if (signupEmail) {
        signupEmail.addEventListener('blur', () => {
            const email = signupEmail.value;
            if (email && !isValidEmail(email)) {
                showFormError('signupEmail', 'Please enter a valid email address');
            } else if (email) {
                clearFieldError('signupEmail');
            }
        });
    }

    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const password = signupPassword.value;
            if (password) {
                updatePasswordStrength(password);
            } else {
                // Clear strength indicator when password is empty
                const strengthIndicator = document.querySelector('.password-strength-indicator');
                if (strengthIndicator) {
                    strengthIndicator.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
                    const strengthFill = document.querySelector('.strength-fill');
                    const strengthText = document.querySelector('.strength-text');
                    if (strengthFill) strengthFill.style.width = '0%';
                    if (strengthText) strengthText.textContent = '';
                }
            }
        });

        signupPassword.addEventListener('blur', () => {
            const password = signupPassword.value;
            if (password && password.length < 6) {
                showFormError('signupPassword', 'Password must be at least 6 characters long');
            } else if (password && !isStrongPassword(password)) {
                showFormError('signupPassword', 'Password should contain letters and numbers');
            } else if (password) {
                clearFieldError('signupPassword');
            }
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('blur', () => {
            const password = signupPassword.value;
            const confirm = confirmPassword.value;
            if (confirm && password !== confirm) {
                showFormError('confirmPassword', 'Passwords do not match');
            } else if (confirm) {
                clearFieldError('confirmPassword');
            }
        });
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    // At least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
}

function showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.invalid-feedback');

    field.classList.add('is-invalid');
    field.classList.remove('is-valid');

    if (feedback) {
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.invalid-feedback');

    field.classList.remove('is-invalid');
    field.classList.add('is-valid');

    if (feedback) {
        feedback.style.display = 'none';
    }
}

function clearFormValidation(form) {
    const fields = form.querySelectorAll('.form-control');
    const feedbacks = form.querySelectorAll('.invalid-feedback');

    fields.forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });

    feedbacks.forEach(feedback => {
        feedback.style.display = 'none';
    });
}

function setButtonLoading(button, spinner, isLoading) {
    if (isLoading) {
        button.disabled = true;
        spinner.classList.remove('d-none');
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        spinner.classList.add('d-none');
        button.style.opacity = '1';
    }
}

// Local Storage Functions
function getStoredUsers() {
    const users = localStorage.getItem('rentitUsers');
    return users ? JSON.parse(users) : [];
}

function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    const loggedIn = localStorage.getItem('isLoggedIn');

    if (currentUser && loggedIn === 'true') {
        userData = JSON.parse(currentUser);
        isLoggedIn = true;

        // Update UI if user is already logged in
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const authButtons = document.getElementById('authButtons');
    const profileSection = document.getElementById('profileSection');

    // Hide auth buttons and show profile section
    authButtons.classList.add('d-none');
    profileSection.classList.remove('d-none');

    // Default animated profile GIF - Local file
    const defaultProfileGif = '566d8887698947.60235a99c3355.gif';

    // Update profile information
    const profileName = document.getElementById('profileName');
    const profileDisplayName = document.getElementById('profileDisplayName');
    const profileEmail = document.getElementById('profileEmail');
    const profileBadge = document.getElementById('profileBadge');

    // Update profile icons with image or GIF
    const profileIcon = document.querySelector('.profile-icon');
    const profileAvatar = document.querySelector('.profile-avatar');

    if (userData.profilePicture) {
        // User has uploaded a profile picture
        profileIcon.innerHTML = `<img src="${userData.profilePicture}" alt="Profile">`;
        profileAvatar.innerHTML = `<img src="${userData.profilePicture}" alt="Profile">`;
    } else {
        // Use default animated GIF
        profileIcon.innerHTML = `<img src="${defaultProfileGif}" alt="Profile">`;
        profileAvatar.innerHTML = `<img src="${defaultProfileGif}" alt="Profile">`;
    }

    if (userData.name) {
        const firstName = userData.name.split(' ')[0];
        profileName.textContent = firstName;
        profileDisplayName.textContent = userData.name;
    }

    if (userData.email) {
        profileEmail.textContent = userData.email;
    }

    if (userData.userType) {
        profileBadge.textContent = userData.userType === 'customer' ? 'Customer' : 'Seller';
        profileBadge.className = `profile-badge ${userData.userType}`;
    }

    // Animate profile section in
    gsap.fromTo(profileSection,
        { opacity: 0, scale: 0.8, x: 20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: "back.out(1.7)" }
    );
}

function showSignupSuccess(name, userType) {
    const typeIcon = userType === 'customer' ? '🛒' : '💼';
    const typeText = userType === 'customer' ? 'Customer' : 'Seller';

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
            <span style="font-size: 1.5rem; margin-right: 10px;">🎉</span>
            <div>
                <strong>Welcome ${name}!</strong><br>
                Account created as ${typeText} ${typeIcon}
            </div>
        </div>
    `;

    document.body.appendChild(successDiv);

    // Animate in
    gsap.to(successDiv, {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    // Auto remove
    setTimeout(() => {
        gsap.to(successDiv, {
            opacity: 0,
            x: 100,
            rotationY: 90,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => successDiv.remove()
        });
    }, 2500);
}

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

function showUserMenu() {
    triggerLaptopScreenEffect();

    // Create user menu dropdown
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const userMenu = document.createElement('div');
    userMenu.id = 'userMenu';
    userMenu.className = 'position-fixed bg-dark border border-secondary rounded-3 p-3';
    userMenu.style.cssText = `
        top: 70px;
        right: 20px;
        z-index: 10000;
        min-width: 200px;
        opacity: 0;
        transform: translateY(-20px) scale(0.9);
        backdrop-filter: blur(20px);
        background: rgba(15, 23, 42, 0.95) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;

    userMenu.innerHTML = `
        <div class="text-center mb-3">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👤</div>
            <h6 class="text-white mb-1">${userData.name}</h6>
            <small class="text-secondary">${userData.email}</small>
        </div>
        <hr class="border-secondary">
        <div class="d-grid gap-2">
            <button class="btn btn-outline-light btn-sm" onclick="showProfile()">
                👤 Profile
            </button>
            <button class="btn btn-outline-light btn-sm" onclick="showBookings()">
                📋 My Bookings
            </button>
            <button class="btn btn-outline-light btn-sm" onclick="showSettings()">
                ⚙️ Settings
            </button>
            <hr class="border-secondary my-2">
            <button class="btn btn-outline-danger btn-sm" onclick="logout()">
                🚪 Logout
            </button>
        </div>
    `;

    document.body.appendChild(userMenu);

    // Animate in
    gsap.to(userMenu, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
    });

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeUserMenu);
    }, 100);
}

function closeUserMenu(event) {
    const userMenu = document.getElementById('userMenu');
    const loginBtn = document.querySelector('.navbar .btn');

    if (userMenu && !userMenu.contains(event.target) && !loginBtn.contains(event.target)) {
        gsap.to(userMenu, {
            opacity: 0,
            y: -20,
            scale: 0.9,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                userMenu.remove();
                document.removeEventListener('click', closeUserMenu);
            }
        });
    }
}

function logout() {
    triggerLaptopScreenEffect();

    // Clear user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    userData = {};
    isLoggedIn = false;
    userRole = '';

    // Reset UI
    const loginBtn = document.querySelector('.navbar .btn');
    const loginIcon = loginBtn.querySelector('.login-icon');

    loginIcon.textContent = '🔐';
    loginBtn.innerHTML = `<span class="login-icon">🔐</span>Login`;
    loginBtn.onclick = () => showLoginModal();

    // Close user menu
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.remove();
    }

    // Show logout success
    showLogoutSuccess();
}

function showLogoutSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-info position-fixed';
    successDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 280px;
        opacity: 0;
        transform: translateX(100%);
        border-radius: 15px;
        backdrop-filter: blur(10px);
    `;
    successDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <span style="font-size: 1.5rem; margin-right: 10px;">👋</span>
            <div>
                <strong>Logged out successfully!</strong><br>
                See you next time
            </div>
        </div>
    `;

    document.body.appendChild(successDiv);

    gsap.to(successDiv, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
    });

    setTimeout(() => {
        gsap.to(successDiv, {
            opacity: 0,
            x: 100,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => successDiv.remove()
        });
    }, 3000);
}

// Placeholder functions for menu items
function showProfile() {
    triggerLaptopScreenEffect();
    closeUserMenu({ target: document.body });
    console.log('Showing user profile');
    // Implement profile functionality
}

function showBookings() {
    triggerLaptopScreenEffect();
    closeUserMenu({ target: document.body });
    console.log('Showing user bookings');
    // Implement bookings functionality
}

function showSettings() {
    triggerLaptopScreenEffect();
    toggleProfileDropdown();

    // Show settings section
    showSection('settings', document.querySelector('.profile-menu-item'), null);

    // Initialize settings with user data
    initializeSettings();
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

// Welcome Back Effect
function showWelcomeBackEffect() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-back-notification';
    welcomeDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(99, 102, 241, 0.9);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 1.1rem;
        z-index: 10000;
        opacity: 0;
        scale: 0.5;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    `;
    welcomeDiv.innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <span style="font-size: 1.5rem;">🏠</span>
            <span>Welcome Home!</span>
        </div>
    `;

    document.body.appendChild(welcomeDiv);

    // Animate in
    gsap.to(welcomeDiv, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
    });

    // Auto remove
    setTimeout(() => {
        gsap.to(welcomeDiv, {
            opacity: 0,
            scale: 0.5,
            y: -20,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => welcomeDiv.remove()
        });
    }, 1500);
}
// Toggle Profile Dropdown
function toggleProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const profileMenu = document.getElementById('profileMenu');

    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    profileBtn.classList.toggle('active');
    profileMenu.classList.toggle('show');

    // Animate profile icon
    const profileIcon = profileBtn.querySelector('.profile-icon');
    if (profileBtn.classList.contains('active')) {
        gsap.to(profileIcon, {
            rotation: 360,
            scale: 1.2,
            duration: 0.6,
            ease: "back.out(1.7)"
        });
    } else {
        gsap.to(profileIcon, {
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
        });
    }
}

// Close profile dropdown when clicking outside
document.addEventListener('click', (event) => {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.profile-btn');

    if (profileDropdown && !profileDropdown.contains(event.target)) {
        profileMenu.classList.remove('show');
        if (profileBtn) profileBtn.classList.remove('active');

        // Reset profile icon
        const profileIcon = profileBtn?.querySelector('.profile-icon');
        if (profileIcon) {
            gsap.to(profileIcon, {
                rotation: 0,
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    }
});

// Profile Menu Functions
function showOrders() {
    triggerLaptopScreenEffect();
    toggleProfileDropdown();

    // Show orders notification
    showNotification('📦', 'Orders', 'Showing your order history');
    console.log('Showing user orders');
}

function showWishlist() {
    triggerLaptopScreenEffect();
    toggleProfileDropdown();

    // Show wishlist notification
    showNotification('❤️', 'Wishlist', 'Showing your saved items');
    console.log('Showing user wishlist');
}

// Enhanced Logout Function
function logout() {
    triggerLaptopScreenEffect();

    // Close profile dropdown
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.profile-btn');
    if (profileMenu) profileMenu.classList.remove('show');
    if (profileBtn) profileBtn.classList.remove('active');

    // Clear user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    userData = {};
    isLoggedIn = false;
    userRole = '';

    // Show logout animation
    const profileSection = document.getElementById('profileSection');
    gsap.to(profileSection, {
        opacity: 0,
        scale: 0.8,
        x: 20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
            // Hide profile section and show auth buttons
            profileSection.classList.add('d-none');
            const authButtons = document.getElementById('authButtons');
            authButtons.classList.remove('d-none');

            // Animate auth buttons back in
            gsap.fromTo(authButtons,
                { opacity: 0, scale: 0.8, x: -20 },
                { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: "back.out(1.7)" }
            );
        }
    });

    // Show logout success
    showLogoutSuccess();
}

// Generic Notification Function
function showNotification(icon, title, message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification-popup';
    notificationDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 15px;
        padding: 15px 20px;
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        opacity: 0;
        transform: translateX(100%);
    `;
    notificationDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <span style="font-size: 1.5rem; margin-right: 12px;">${icon}</span>
            <div>
                <strong class="text-white">${title}</strong><br>
                <small class="text-secondary">${message}</small>
            </div>
        </div>
    `;

    document.body.appendChild(notificationDiv);

    gsap.to(notificationDiv, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
    });

    setTimeout(() => {
        gsap.to(notificationDiv, {
            opacity: 0,
            x: 100,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => notificationDiv.remove()
        });
    }, 3000);
}
// Settings Functions
function initializeSettings() {
    // Populate profile form with user data
    if (userData.name) {
        const nameParts = userData.name.split(' ');
        document.getElementById('firstName').value = nameParts[0] || '';
        document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
    }

    if (userData.email) {
        document.getElementById('profileEmail').value = userData.email;
    }

    if (userData.phone) {
        document.getElementById('phoneNumber').value = userData.phone;
    }

    // Load saved addresses
    loadAddresses();

    // Load preferences
    loadPreferences();
}

function showSettingsTab(tabName) {
    // Trigger laptop screen effect
    triggerLaptopScreenEffect();

    // Remove active class from all nav items and tabs
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to clicked nav item and corresponding tab
    event.target.closest('.settings-nav-item').classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Animate tab content
    const activeTab = document.getElementById(tabName + 'Tab');
    gsap.fromTo(activeTab,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
}

// Address Management
function loadAddresses() {
    const addressesList = document.getElementById('addressesList');
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');

    if (savedAddresses.length === 0) {
        addressesList.innerHTML = `
            <div class="text-center py-4">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                <h5 class="text-white">No addresses added yet</h5>
                <p class="text-secondary">Add your first address to get started</p>
            </div>
        `;
        return;
    }

    addressesList.innerHTML = savedAddresses.map((address, index) => `
        <div class="address-card" data-index="${index}">
            <div class="address-header">
                <div class="address-type">
                    ${getAddressIcon(address.type)} ${address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                    ${address.isDefault ? '<span class="address-badge">Default</span>' : ''}
                </div>
                <div class="address-actions">
                    <button class="address-btn" onclick="editAddress(${index})">Edit</button>
                    <button class="address-btn delete" onclick="deleteAddress(${index})">Delete</button>
                </div>
            </div>
            <div class="address-details">
                <div class="address-name">${address.name}</div>
                <div class="address-phone">${address.phone}</div>
                <div>
                    ${address.line1}<br>
                    ${address.line2 ? address.line2 + '<br>' : ''}
                    ${address.city}, ${address.state} ${address.pincode}<br>
                    ${address.country}
                </div>
            </div>
        </div>
    `).join('');
}

function getAddressIcon(type) {
    const icons = {
        home: '🏠',
        work: '🏢',
        other: '📍'
    };
    return icons[type] || '📍';
}

function addNewAddress() {
    triggerLaptopScreenEffect();

    // Reset form
    document.getElementById('addressForm').reset();
    document.getElementById('addressModalTitle').textContent = 'Add New Address';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addressModal'));
    modal.show();
}

function editAddress(index) {
    triggerLaptopScreenEffect();

    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    const address = savedAddresses[index];

    if (!address) return;

    // Populate form with address data
    document.getElementById('addressType').value = address.type;
    document.getElementById('addressName').value = address.name;
    document.getElementById('addressPhone').value = address.phone;
    document.getElementById('addressLine1').value = address.line1;
    document.getElementById('addressLine2').value = address.line2 || '';
    document.getElementById('addressCity').value = address.city;
    document.getElementById('addressState').value = address.state;
    document.getElementById('addressPincode').value = address.pincode;
    document.getElementById('addressCountry').value = address.country;
    document.getElementById('defaultAddress').checked = address.isDefault || false;

    // Update modal title and store editing index
    document.getElementById('addressModalTitle').textContent = 'Edit Address';
    document.getElementById('addressForm').dataset.editIndex = index;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addressModal'));
    modal.show();
}

function deleteAddress(index) {
    triggerLaptopScreenEffect();

    if (confirm('Are you sure you want to delete this address?')) {
        const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        savedAddresses.splice(index, 1);
        localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));

        loadAddresses();
        showNotification('🗑️', 'Address Deleted', 'Address has been removed successfully');
    }
}

// Theme selection
function selectTheme(theme) {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });

    event.target.closest('.theme-option').classList.add('active');

    // Save theme preference
    localStorage.setItem('selectedTheme', theme);

    showNotification('🎨', 'Theme Selected', `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme selected`);
}

// Save preferences
function savePreferences() {
    triggerLaptopScreenEffect();

    const language = document.getElementById('language').value;
    const currency = document.getElementById('currency').value;
    const theme = document.querySelector('.theme-option.active')?.dataset?.theme || 'dark';

    const preferences = {
        language,
        currency,
        theme
    };

    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    showNotification('✅', 'Preferences Saved', 'Your preferences have been saved successfully');
}

// Load preferences
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

    if (preferences.language) {
        document.getElementById('language').value = preferences.language;
    }

    if (preferences.currency) {
        document.getElementById('currency').value = preferences.currency;
    }

    if (preferences.theme) {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[onclick="selectTheme('${preferences.theme}')"]`)?.classList.add('active');
    }
}

// Initialize settings forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Address form submission
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                type: document.getElementById('addressType').value,
                name: document.getElementById('addressName').value,
                phone: document.getElementById('addressPhone').value,
                line1: document.getElementById('addressLine1').value,
                line2: document.getElementById('addressLine2').value,
                city: document.getElementById('addressCity').value,
                state: document.getElementById('addressState').value,
                pincode: document.getElementById('addressPincode').value,
                country: document.getElementById('addressCountry').value,
                isDefault: document.getElementById('defaultAddress').checked
            };

            const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
            const editIndex = addressForm.dataset.editIndex;

            // If setting as default, remove default from other addresses
            if (formData.isDefault) {
                savedAddresses.forEach(addr => addr.isDefault = false);
            }

            if (editIndex !== undefined) {
                // Edit existing address
                savedAddresses[editIndex] = formData;
                showNotification('✅', 'Address Updated', 'Address has been updated successfully');
                delete addressForm.dataset.editIndex;
            } else {
                // Add new address
                savedAddresses.push(formData);
                showNotification('✅', 'Address Added', 'New address has been added successfully');
            }

            localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
            loadAddresses();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addressModal'));
            modal.hide();
        });
    }

    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Update user data
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('profileEmail').value;
            const phone = document.getElementById('phoneNumber').value;
            const dob = document.getElementById('dateOfBirth').value;
            const gender = document.getElementById('gender').value;

            userData.name = `${firstName} ${lastName}`.trim();
            userData.email = email;
            userData.phone = phone;
            userData.dateOfBirth = dob;
            userData.gender = gender;

            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Update UI
            updateUIForLoggedInUser();

            showNotification('✅', 'Profile Updated', 'Your profile has been updated successfully');
        });
    }

    // Security form submission
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;

            // Validate current password
            if (currentPassword !== userData.password) {
                showNotification('❌', 'Error', 'Current password is incorrect');
                return;
            }

            // Validate new passwords match
            if (newPassword !== confirmPassword) {
                showNotification('❌', 'Error', 'New passwords do not match');
                return;
            }

            // Update password
            userData.password = newPassword;
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Clear form
            securityForm.reset();

            showNotification('✅', 'Password Updated', 'Your password has been changed successfully');
        });
    }
});
// Card Stack functionality is now handled in card-stack.js