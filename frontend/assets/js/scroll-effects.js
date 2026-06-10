// // Scroll Effects and Animations

// document.addEventListener('DOMContentLoaded', function() {
//     initScrollSpy();
//     initScrollProgress();
//     initFadeOnScroll();
//     initStickyElements();
//     initScrollDirection();
// });

// // Scroll Spy - Active navigation highlighting
// function initScrollSpy() {
//     const sections = document.querySelectorAll('section[id]');
//     const navLinks = document.querySelectorAll('.nav-link');
    
//     const options = {
//         threshold: 0.3,
//         rootMargin: '0px 0px -50% 0px'
//     };
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const id = entry.target.getAttribute('id');
                
//                 navLinks.forEach(link => {
//                     link.classList.remove('active', 'text-orange-600');
//                     const href = link.getAttribute('href');
//                     if (href === `#${id}` || href === `/pages/${id}.html`) {
//                         link.classList.add('active', 'text-orange-600');
//                     }
//                 });
//             }
//         });
//     }, options);
    
//     sections.forEach(section => observer.observe(section));
// }

// // Scroll Progress Indicator
// function initScrollProgress() {
//     const progressBar = document.createElement('div');
//     progressBar.className = 'scroll-progress';
//     progressBar.style.cssText = `
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 0%;
//         height: 3px;
//         background: linear-gradient(90deg, #f97316, #ea580c);
//         z-index: 10000;
//         transition: width 0.1s ease;
//     `;
//     document.body.appendChild(progressBar);
    
//     window.addEventListener('scroll', () => {
//         const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
//         const scrolled = (window.scrollY / windowHeight) * 100;
//         progressBar.style.width = scrolled + '%';
//     });
// }

// // Fade elements on scroll
// function initFadeOnScroll() {
//     const fadeElements = document.querySelectorAll('.fade-on-scroll');
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.style.opacity = '1';
//                 entry.target.style.transform = 'translateY(0)';
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, {
//         threshold: 0.1,
//         rootMargin: '0px 0px -50px 0px'
//     });
    
//     fadeElements.forEach(el => {
//         el.style.opacity = '0';
//         el.style.transform = 'translateY(30px)';
//         el.style.transition = 'all 0.6s ease';
//         observer.observe(el);
//     });
// }

// // Sticky elements
// function initStickyElements() {
//     const stickyElements = document.querySelectorAll('.sticky-on-scroll');
    
//     stickyElements.forEach(element => {
//         const offset = element.dataset.offset || 100;
//         const originalPosition = element.style.position;
        
//         window.addEventListener('scroll', throttle(() => {
//             const scrolled = window.scrollY;
            
//             if (scrolled > offset) {
//                 element.style.position = 'fixed';
//                 element.style.top = '20px';
//                 element.style.zIndex = '100';
//             } else {
//                 element.style.position = originalPosition;
//                 element.style.top = 'auto';
//             }
//         }, 100));
//     });
// }

// // Track scroll direction
// function initScrollDirection() {
//     let lastScroll = 0;
//     const header = document.querySelector('header, nav');
    
//     window.addEventListener('scroll', throttle(() => {
//         const currentScroll = window.scrollY;
        
//         if (currentScroll > lastScroll && currentScroll > 100) {
//             // Scrolling down
//             if (header) {
//                 header.style.transform = 'translateY(-100%)';
//             }
//         } else if (currentScroll < lastScroll) {
//             // Scrolling up
//             if (header) {
//                 header.style.transform = 'translateY(0)';
//             }
//         }
        
//         lastScroll = currentScroll;
//     }, 100));
// }

// // Parallax scrolling
// function initParallax() {
//     const parallaxElements = document.querySelectorAll('.parallax-scroll');
    
//     window.addEventListener('scroll', throttle(() => {
//         const scrolled = window.scrollY;
        
//         parallaxElements.forEach(element => {
//             const speed = element.dataset.speed || 0.5;
//             const offset = scrolled * speed;
//             element.style.transform = `translateY(${offset}px)`;
//         });
//     }, 10));
// }

// // Reveal elements on scroll with different animations
// function initRevealOnScroll() {
//     const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
//     const revealOptions = {
//         threshold: 0.1,
//         rootMargin: '0px 0px -100px 0px'
//     };
    
//     const revealObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const element = entry.target;
//                 const animation = element.dataset.animation || 'fadeInUp';
                
//                 element.classList.add('animated', animation);
//                 revealObserver.unobserve(element);
//             }
//         });
//     }, revealOptions);
    
//     revealElements.forEach(el => revealObserver.observe(el));
// }

// // Smooth reveal for images
// function initImageReveal() {
//     const images = document.querySelectorAll('.reveal-image');
    
//     const imageObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const img = entry.target;
//                 img.classList.add('revealed');
//                 imageObserver.unobserve(img);
//             }
//         });
//     }, {
//         threshold: 0.1,
//         rootMargin: '0px 0px -50px 0px'
//     });
    
//     images.forEach(img => {
//         img.style.opacity = '0';
//         img.style.transform = 'scale(0.95)';
//         img.style.transition = 'all 0.6s ease';
//         imageObserver.observe(img);
//     });
    
//     // Add CSS for revealed state
//     const style = document.createElement('style');
//     style.textContent = `
//         .reveal-image.revealed {
//             opacity: 1 !important;
//             transform: scale(1) !important;
//         }
//     `;
//     document.head.appendChild(style);
// }

// // Animate elements when they enter viewport
// function initViewportAnimations() {
//     const animatedElements = document.querySelectorAll('[data-animate]');
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const element = entry.target;
//                 const animation = element.dataset.animate;
//                 const delay = element.dataset.delay || 0;
                
//                 setTimeout(() => {
//                     element.classList.add('animate__animated', `animate__${animation}`);
//                     element.style.opacity = '1';
//                 }, delay);
                
//                 observer.unobserve(element);
//             }
//         });
//     }, {
//         threshold: 0.1
//     });
    
//     animatedElements.forEach(el => {
//         el.style.opacity = '0';
//         observer.observe(el);
//     });
// }

// // Initialize all scroll effects
// document.addEventListener('DOMContentLoaded', () => {
//     initRevealOnScroll();
//     initImageReveal();
//     initViewportAnimations();
//     initParallax();
// });

// // Throttle function for performance
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