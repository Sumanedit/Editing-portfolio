// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && message) {
            // In a real application, you would send this data to a server
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .about-content > *');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.4s ease';
        observer.observe(el);
    });
});

// Shining effect for buttons - Linear inclined ray effect
function setupRayEffect(button) {
    if (!button) return;
    
    // Fixed ray angle (135deg = diagonal from top-left to bottom-right)
    const fixedRayAngle = 135;
    
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        
        // Get cursor position relative to button
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate the position along the ray line (projection onto the diagonal)
        // The ray is at 135deg, so we need to project the cursor position onto this line
        // Convert angle to radians for calculations
        const angleRad = (fixedRayAngle * Math.PI) / 180;
        
        // Calculate the perpendicular distance from cursor to the ray line
        // For a line at 135deg passing through the center: y = -x + c
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Project point onto the line: find closest point on the diagonal line
        // Line equation: cos(angle) * x + sin(angle) * y = d
        const cosAngle = Math.cos(angleRad);
        const sinAngle = Math.sin(angleRad);
        
        // Project cursor position onto the ray line
        // Invert the projection to match cursor movement direction
        const projection = -((mouseX - centerX) * cosAngle + (mouseY - centerY) * sinAngle);
        
        // Calculate maximum projection distance (diagonal of button)
        const maxProjection = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
        
        // Convert to percentage (0-100%), centered at 50%
        const position = 50 + (projection / maxProjection) * 50;
        
        // Clamp position to reasonable bounds to prevent overflow
        const clampedPosition = Math.max(25, Math.min(75, position));
        
        button.style.setProperty('--ray-angle', `${fixedRayAngle}deg`);
        button.style.setProperty('--ray-position', `${clampedPosition}%`);
    });
    
}

// Apply the ray effect to all primary buttons
document.addEventListener('DOMContentLoaded', () => {
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(button => {
        setupRayEffect(button);
    });
});

function setupServiceCardGradient(card) {
    if (!card) return;

    let raf = null;

    const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // atan2 returns radians; convert to degrees and rotate so 0deg points up nicely
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

        // Compute a radius based on cursor distance from center (subtle effect)
        const maxDist = Math.hypot(rect.width / 2, rect.height / 2);
        const dist = Math.hypot(dx, dy);
        const norm = Math.min(1, dist / maxDist);
        const minRadius = 8; // px
        const maxRadius = 20; // px
        const radius = Math.round(minRadius + norm * (maxRadius - minRadius));

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            card.style.setProperty('--angle', `${deg}deg`);
            card.style.setProperty('--radius', `${radius}px`);
            raf = null;
        });
    };

    const onEnter = () => {
        // starting hover radius
        card.style.setProperty('--radius', '14px');
    };

    const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.setProperty('--angle', '135deg');
        // reset to default radius
        card.style.setProperty('--radius', '8px');
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card').forEach(card => setupServiceCardGradient(card));
});

// Portfolio hover radial center follows cursor (rAF-throttled)
function setupPortfolioHover(item) {
    if (!item) return;

    const image = item.querySelector('.portfolio-image');
    if (!image) return;

    let raf = null;

    const onMove = (e) => {
        const rect = image.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            image.style.setProperty('--mx', `${x}%`);
            image.style.setProperty('--my', `${y}%`);
            raf = null;
        });
    };

    const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        image.style.setProperty('--mx', `50%`);
        image.style.setProperty('--my', `40%`);
    };

    item.addEventListener('mousemove', onMove);
    // item.addEventListener('mouseleave', onLeave);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.portfolio-item').forEach(item => setupPortfolioHover(item));
});