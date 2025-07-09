// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

hamburger.addEventListener('click', () => {
    mobileMenuOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenuOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close mobile menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Page Navigation
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-nav a');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Refresh AOS
    setTimeout(() => {
        AOS.refresh();
    }, 100);
}

// Add event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
        }
    });
});

// FAQ Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Contact Modal
const modal = document.getElementById('contact-modal');
const closeBtn = document.querySelector('.close');
const contactForm = document.getElementById('contact-form');

function openContactModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking the X
closeBtn.addEventListener('click', closeContactModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeContactModal();
    }
});

// Contact Form Submission// Get form element
// const contactForm = document.getElementById('contact-form');

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const status = document.getElementById('status').value;
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!firstName || !lastName || !phone || !email || !status || !message) {
        Toastify({
            text: "Please fill in all required fields.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff6b6b, #ff5252)",
            stopOnFocus: true,
        }).showToast();
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Toastify({
            text: "Please enter a valid email address.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff6b6b, #ff5252)",
            stopOnFocus: true,
        }).showToast();
        return;
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        Toastify({
            text: "Please enter a valid phone number.",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff6b6b, #ff5252)",
            stopOnFocus: true,
        }).showToast();
        return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('status', status);
    formData.append('message', message);

    // Show loading state
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Send data to Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbxHWW_BYTnCExSvJW_B5AWOGHUF6A7_kHKCtNi4UW-e267i2ihHWV-g-LsHaOPRDwCG8A/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            Toastify({
                text: "Thank you for your message! We'll get back to you soon.",
                duration: 5000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #1e7b1e, #28a428)",
                stopOnFocus: true,
            }).showToast();

            contactForm.reset(); // Reset form
            closeContactModal(); // Close modal (make sure you have this function)
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Toastify({
            text: "Sorry, there was an error sending your message. Please try again.",
            duration: 3500,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff6b6b, #ff5252)",
            stopOnFocus: true,
        }).showToast();
    })
    .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
});

// Apply for Job Function
function applyForJob(jobTitle) {
    const subject = encodeURIComponent(`Application for ${jobTitle} Position`);
    const body = encodeURIComponent(`Dear FlyRoad Dispatch Team,

I am writing to express my interest in the ${jobTitle} position at FlyRoad Dispatch. 

I would like to apply for this role and would appreciate the opportunity to discuss my qualifications further.

Thank you for your consideration.

Best regards,
[Your Name]`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=dispatch@flyroaddispatch.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        navbar.style.transform = 'translateY(0)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

function showPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    console.log('FlyRoad Dispatch website initialized');
});

// Button hover effects
const buttons = document.querySelectorAll('.cta-button, .service-cta-button, .apply-button, .submit-button');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
});

// Image hover effects
const images = document.querySelectorAll('.service-image img, .about-image img, .about-hero-image img');

images.forEach(img => {
    img.addEventListener('mouseenter', () => {
        img.style.filter = 'brightness(1.1) contrast(1.1)';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.filter = 'brightness(1) contrast(1)';
    });
});


// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add custom cursor effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        background: #32cd32;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 20px rgba(50, 205, 50, 0.5);
        transition: transform 0.1s ease;
    }
`;
document.head.appendChild(cursorStyle);