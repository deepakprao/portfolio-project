// ===== API Configuration =====
const API_URL = 'http://localhost:3000/api';

// ===== Contact Form Submission =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Validate
    if (!validateForm(formData)) {
        return;
    }

    // Show loading
    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';
            console.log('✅ Message sent!', data);
        } else {
            alert('❌ ' + (data.error || 'Failed to send message'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Failed to send message. Please try again.');
    } finally {
        setLoading(false);
    }
});

// ===== Form Validation =====
function validateForm(data) {
    let isValid = true;

    // Name validation
    if (!data.name) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (data.name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(data.email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }

    // Message validation
    if (!data.message) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (data.message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    field.classList.add('error');
    errorEl.textContent = message;
}

function clearErrors() {
    ['name', 'email', 'message'].forEach(field => {
        document.getElementById(field).classList.remove('error');
        document.getElementById(field + 'Error').textContent = '';
    });
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoading.style.display = isLoading ? 'inline' : 'none';
}

function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'block';
    successMessage.style.display = 'none';
    clearErrors();
}

// ===== Animate Stats =====
function animateStats() {
    const projectsCount = document.getElementById('projects-count');
    const experience = document.getElementById('experience');
    const skillsCount = document.getElementById('skills-count');

    animateNumber(projectsCount, 10);
    animateNumber(experience, 3);
    animateNumber(skillsCount, 4);
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// ===== Animate Skill Bars =====
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
        const progress = bar.dataset.progress;
        bar.style.width = progress + '%';
    });
}

// ===== Intersection Observer for Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about')) {
                animateStats();
            }
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
        }
    });
}, { threshold: 0.3 });

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about');
    const skillsSection = document.querySelector('.skills');

    if (aboutSection) observer.observe(aboutSection);
    if (skillsSection) observer.observe(skillsSection);

    console.log('🎨 Portfolio loaded!');
    console.log(`📡 API URL: ${API_URL}`);
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Real-time Input Validation =====
document.getElementById('name').addEventListener('input', (e) => {
    if (e.target.value.length >= 2) {
        e.target.classList.remove('error');
        document.getElementById('nameError').textContent = '';
    }
});

document.getElementById('email').addEventListener('input', (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(e.target.value)) {
        e.target.classList.remove('error');
        document.getElementById('emailError').textContent = '';
    }
});

document.getElementById('message').addEventListener('input', (e) => {
    if (e.target.value.length >= 10) {
        e.target.classList.remove('error');
        document.getElementById('messageError').textContent = '';
    }
});

console.log('🚀 Portfolio script loaded!');
