// // Main JavaScript for WCDI

// // DOM Content Loaded
// document.addEventListener('DOMContentLoaded', function() {
//     initializeApp();
// });

// // Determine the site base path so root-relative links like "/pages/..." work
// // even when the project is served from a subfolder or opened via file://.
// function getSiteBasePath() {
//     const pathname = window.location.pathname || '';

//     // If we're inside /pages/, base is the folder before /pages/
//     const pagesMarker = '/pages/';
//     if (pathname.includes(pagesMarker)) {
//         return pathname.split(pagesMarker)[0].replace(/\/$/, '') + '/';
//     }

//     // Otherwise, base is the current directory (strip file name if present)
//     return pathname.replace(/\/[^\/]*$/, '/');
// }

// function fixRootRelativeLinks(root = document) {
//     const base = getSiteBasePath();

//     root.querySelectorAll('a[href^="/"]').forEach(a => {
//         const href = a.getAttribute('href');
//         if (!href || href === '/' || href.startsWith('//')) return;
//         a.setAttribute('href', base + href.replace(/^\//, ''));
//     });

//     root.querySelectorAll('img[src^="/"]').forEach(img => {
//         const src = img.getAttribute('src');
//         if (!src || src.startsWith('//')) return;
//         img.setAttribute('src', base + src.replace(/^\//, ''));
//     });
// }

// // Initialize Application
// function initializeApp() {
//     fixRootRelativeLinks(document);
//     initMobileMenu();
//     initNavbarScroll();
//     initBackToTop();
//     initSmoothScroll();
//     initLazyLoad();
//     initFormValidation();
//     initScrollReveal();
//     initCookieConsent();
// }

// // Mobile Menu Toggle
// function initMobileMenu() {
//     const mobileBtn = document.getElementById('mobile-menu-btn');
//     const mobileMenu = document.getElementById('mobile-menu');
    
//     if (mobileBtn && mobileMenu) {
//         mobileBtn.addEventListener('click', () => {
//             mobileMenu.classList.toggle('hidden');
//             const icon = mobileBtn.querySelector('i');
//             if (icon) {
//                 icon.classList.toggle('fa-bars');
//                 icon.classList.toggle('fa-times');
//             }
//         });
//     }
// }

// // Navbar Scroll Effect
// function initNavbarScroll() {
//     const navbar = document.getElementById('navbar');
//     let lastScroll = 0;

//     if (!navbar) return;
    
//     window.addEventListener('scroll', () => {
//         const currentScroll = window.pageYOffset;
        
//         if (currentScroll > 100) {
//             navbar.classList.add('navbar-scrolled', 'shadow-lg');
//             if (currentScroll > lastScroll && currentScroll > 300) {
//                 navbar.style.transform = 'translateY(-100%)';
//             } else {
//                 navbar.style.transform = 'translateY(0)';
//             }
//         } else {
//             navbar.classList.remove('navbar-scrolled', 'shadow-lg');
//             navbar.style.transform = 'translateY(0)';
//         }
        
//         lastScroll = currentScroll;
//     });
// }

// // Back to Top Button
// function initBackToTop() {
//     const backBtn = document.getElementById('back-to-top');
    
//     if (backBtn) {
//         window.addEventListener('scroll', () => {
//             if (window.pageYOffset > 300) {
//                 backBtn.classList.remove('hidden');
//                 backBtn.classList.add('flex');
//             } else {
//                 backBtn.classList.add('hidden');
//                 backBtn.classList.remove('flex');
//             }
//         });
        
//         backBtn.addEventListener('click', () => {
//             window.scrollTo({
//                 top: 0,
//                 behavior: 'smooth'
//             });
//         });
//     }
// }

// // Smooth Scroll for Anchor Links
// function initSmoothScroll() {
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function(e) {
//             const href = this.getAttribute('href');
//             if (href === '#') return;
            
//             const target = document.querySelector(href);
//             if (target) {
//                 e.preventDefault();
//                 target.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'start'
//                 });
                
//                 // Update URL without jumping
//                 history.pushState(null, null, href);
//             }
//         });
//     });
// }

// // Lazy Load Images
// function initLazyLoad() {
//     if ('IntersectionObserver' in window) {
//         const imageObserver = new IntersectionObserver((entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const img = entry.target;
//                     const src = img.dataset.src;
//                     if (src) {
//                         img.src = src;
//                         img.classList.add('loaded');
//                     }
//                     observer.unobserve(img);
//                 }
//             });
//         });
        
//         document.querySelectorAll('img[data-src]').forEach(img => {
//             imageObserver.observe(img);
//         });
//     } else {
//         // Fallback for older browsers
//         document.querySelectorAll('img[data-src]').forEach(img => {
//             img.src = img.dataset.src;
//         });
//     }
// }

// // Form Validation
// function initFormValidation() {
//     const forms = document.querySelectorAll('form');
    
//     forms.forEach(form => {
//         form.addEventListener('submit', (e) => {
//             if (!validateForm(form)) {
//                 e.preventDefault();
//             }
//         });
        
//         // Real-time validation
//         const inputs = form.querySelectorAll('input, textarea, select');
//         inputs.forEach(input => {
//             input.addEventListener('blur', () => validateField(input));
//             input.addEventListener('input', () => {
//                 if (input.classList.contains('error')) {
//                     validateField(input);
//                 }
//             });
//         });
//     });
// }

// function validateForm(form) {
//     let isValid = true;
//     const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
//     inputs.forEach(input => {
//         if (!validateField(input)) {
//             isValid = false;
//         }
//     });
    
//     return isValid;
// }

// function validateField(field) {
//     const value = field.value.trim();
//     let isValid = true;
//     let errorMessage = '';
    
//     // Remove existing error
//     field.classList.remove('error');
//     const existingError = field.parentElement?.querySelector('.error-message');
//     if (existingError) existingError.remove();
    
//     // Check if required and empty
//     if (field.hasAttribute('required') && !value) {
//         isValid = false;
//         errorMessage = 'This field is required';
//     }
    
//     // Email validation
//     if (field.type === 'email' && value && !isValidEmail(value)) {
//         isValid = false;
//         errorMessage = 'Please enter a valid email address';
//     }
    
//     // Phone validation
//     if (field.type === 'tel' && value && !isValidPhone(value)) {
//         isValid = false;
//         errorMessage = 'Please enter a valid phone number';
//     }
    
//     if (!isValid) {
//         field.classList.add('error');
//         const error = document.createElement('div');
//         error.className = 'error-message text-red-500 text-sm mt-1';
//         error.textContent = errorMessage;
//         field.parentElement?.appendChild(error);
//     }
    
//     return isValid;
// }

// function isValidEmail(email) {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
// }

// function isValidPhone(phone) {
//     const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
//     return re.test(phone);
// }

// // Scroll Reveal Animation
// function initScrollReveal() {
//     const revealElements = document.querySelectorAll('[data-aos]');
    
//     if ('IntersectionObserver' in window) {
//         const revealObserver = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('aos-animate');
//                     revealObserver.unobserve(entry.target);
//                 }
//             });
//         }, {
//             threshold: 0.1,
//             rootMargin: '0px 0px -50px 0px'
//         });
        
//         revealElements.forEach(el => revealObserver.observe(el));
//     }
// }

// // Cookie Consent
// function initCookieConsent() {
//     if (localStorage.getItem('cookieConsent')) return;

//     const banner = document.createElement('div');
//     banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-gray-900 text-white rounded-xl shadow-2xl p-4 z-50';
//     banner.innerHTML = `
//         <div class="flex gap-3">
//             <i class="fas fa-cookie-bite text-orange-400 mt-1"></i>
//             <div>
//                 <p class="font-semibold">Cookie notice</p>
//                 <p class="text-sm text-gray-300 mt-1">We use essential browser storage to remember preferences and save demo form submissions on this device.</p>
//                 <div class="flex gap-2 mt-3">
//                     <button type="button" data-cookie-choice="accepted" class="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-semibold">Accept</button>
//                     <button type="button" data-cookie-choice="declined" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold">Decline</button>
//                 </div>
//             </div>
//         </div>
//     `;

//     banner.querySelectorAll('[data-cookie-choice]').forEach(button => {
//         button.addEventListener('click', () => {
//             localStorage.setItem('cookieConsent', button.dataset.cookieChoice);
//             banner.remove();
//         });
//     });

//     document.body.appendChild(banner);
// }

// // Show Toast Notification
// function showToast(message, type = 'success') {
//     const toast = document.createElement('div');
//     toast.className = `toast ${type} fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 z-50 animate-slide-in-right`;
    
//     let icon = '';
//     switch(type) {
//         case 'success':
//             icon = '<i class="fas fa-check-circle text-green-500"></i>';
//             break;
//         case 'error':
//             icon = '<i class="fas fa-exclamation-circle text-red-500"></i>';
//             break;
//         case 'info':
//             icon = '<i class="fas fa-info-circle text-blue-500"></i>';
//             break;
//     }
    
//     toast.innerHTML = `
//         ${icon}
//         <span class="text-gray-700">${message}</span>
//         <button class="ml-4 text-gray-400 hover:text-gray-600">&times;</button>
//     `;
    
//     document.body.appendChild(toast);
    
//     const closeBtn = toast.querySelector('button');
//     closeBtn.addEventListener('click', () => toast.remove());
    
//     setTimeout(() => toast.remove(), 5000);
// }

// // Loading State
// function showLoading(element) {
//     const loader = document.createElement('div');
//     loader.className = 'loading-spinner';
//     loader.innerHTML = '<div class="spinner"></div>';
//     element.appendChild(loader);
//     element.disabled = true;
// }

// function hideLoading(element) {
//     const loader = element.querySelector('.loading-spinner');
//     if (loader) loader.remove();
//     element.disabled = false;
// }

// // Debounce Utility
// function debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }

// // Throttle Utility
// function throttle(func, limit) {
//     let inThrottle;
//     return function(...args) {
//         if (!inThrottle) {
//             func.apply(this, args);
//             inThrottle = true;
//             setTimeout(() => inThrottle = false, limit);
//         }
//     };
// }

// // Export functions for global use
// window.showToast = showToast;
// window.showLoading = showLoading;
// window.hideLoading = hideLoading;
