// // Animation Triggers for WCDI

// // Initialize AOS
// AOS.init({
//     duration: 1000,
//     once: true,
//     offset: 100,
//     disable: 'mobile'
// });

// // Custom Animation Triggers
// document.addEventListener('DOMContentLoaded', function() {
//     initParallax();
//     initTypingEffect();
//     initRippleEffect();
//     initParticles();
//     initStaggeredAnimations();
// });

// // Parallax Effect
// function initParallax() {
//     const parallaxElements = document.querySelectorAll('.parallax');
    
//     window.addEventListener('scroll', throttle(() => {
//         const scrolled = window.pageYOffset;
        
//         parallaxElements.forEach(element => {
//             const speed = element.dataset.speed || 0.5;
//             const yPos = -(scrolled * speed);
//             element.style.transform = `translateY(${yPos}px)`;
//         });
//     }, 10));
// }

// // Typing Effect
// function initTypingEffect() {
//     const typingElements = document.querySelectorAll('.typing-effect');
    
//     typingElements.forEach(element => {
//         const text = element.textContent;
//         element.textContent = '';
//         element.style.width = '0';
        
//         let i = 0;
//         const typeWriter = () => {
//             if (i < text.length) {
//                 element.textContent += text.charAt(i);
//                 i++;
//                 setTimeout(typeWriter, 100);
//             }
//         };
        
//         typeWriter();
//     });
// }

// // Ripple Effect
// function initRippleEffect() {
//     const rippleElements = document.querySelectorAll('.ripple');
    
//     rippleElements.forEach(element => {
//         element.addEventListener('click', function(e) {
//             const rect = this.getBoundingClientRect();
//             const x = e.clientX - rect.left;
//             const y = e.clientY - rect.top;
            
//             const ripple = document.createElement('span');
//             ripple.className = 'ripple-effect';
//             ripple.style.left = `${x}px`;
//             ripple.style.top = `${y}px`;
//             ripple.style.position = 'absolute';
//             ripple.style.width = '0';
//             ripple.style.height = '0';
//             ripple.style.borderRadius = '50%';
//             ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
//             ripple.style.transform = 'translate(-50%, -50%)';
//             ripple.style.transition = 'width 0.6s, height 0.6s, opacity 0.6s';
            
//             this.style.position = 'relative';
//             this.style.overflow = 'hidden';
//             this.appendChild(ripple);
            
//             setTimeout(() => {
//                 ripple.style.width = '300px';
//                 ripple.style.height = '300px';
//                 ripple.style.opacity = '0';
//             }, 10);
            
//             setTimeout(() => ripple.remove(), 600);
//         });
//     });
// }

// // Particle Animation
// function initParticles() {
//     const particleContainers = document.querySelectorAll('.particle-container');
    
//     particleContainers.forEach(container => {
//         setInterval(() => {
//             const particle = document.createElement('div');
//             particle.className = 'particle';
//             particle.style.left = Math.random() * 100 + '%';
//             particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
//             particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
//             particle.style.animationDuration = Math.random() * 3 + 2 + 's';
//             particle.style.animationDelay = Math.random() * 2 + 's';
            
//             container.appendChild(particle);
            
//             setTimeout(() => particle.remove(), 5000);
//         }, 500);
//     });
// }

// // Staggered Animations
// function initStaggeredAnimations() {
//     const staggeredElements = document.querySelectorAll('.stagger-children');
    
//     if ('IntersectionObserver' in window) {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('loaded');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         });
        
//         staggeredElements.forEach(el => observer.observe(el));
//     }
// }

// // Scroll-triggered Animations
// function initScrollAnimations() {
//     const animatedElements = document.querySelectorAll('.reveal');
    
//     if ('IntersectionObserver' in window) {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('active');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, {
//             threshold: 0.1,
//             rootMargin: '0px 0px -50px 0px'
//         });
        
//         animatedElements.forEach(el => observer.observe(el));
//     }
// }

// // Number Counter Animation
// function animateCounter(element, start, end, duration) {
//     let startTimestamp = null;
//     const step = (timestamp) => {
//         if (!startTimestamp) startTimestamp = timestamp;
//         const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//         const currentValue = Math.floor(progress * (end - start) + start);
//         element.textContent = currentValue.toLocaleString();
//         if (progress < 1) {
//             window.requestAnimationFrame(step);
//         }
//     };
//     window.requestAnimationFrame(step);
// }

// // Initialize Counters on Scroll
// function initCounters() {
//     const counters = document.querySelectorAll('.counter');
    
//     if ('IntersectionObserver' in window) {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const counter = entry.target;
//                     const target = parseInt(counter.dataset.target);
//                     if (target && !counter.classList.contains('animated')) {
//                         counter.classList.add('animated');
//                         animateCounter(counter, 0, target, 2000);
//                     }
//                     observer.unobserve(counter);
//                 }
//             });
//         });
        
//         counters.forEach(counter => observer.observe(counter));
//     }
// }

// // Animate Progress Bars
// function initProgressBars() {
//     const progressBars = document.querySelectorAll('.progress-bar');
    
//     if ('IntersectionObserver' in window) {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const bar = entry.target;
//                     const progress = bar.dataset.progress;
//                     if (progress && !bar.classList.contains('animated')) {
//                         bar.classList.add('animated');
//                         bar.style.width = progress + '%';
//                     }
//                     observer.unobserve(bar);
//                 }
//             });
//         });
        
//         progressBars.forEach(bar => observer.observe(bar));
//     }
// }

// // Hover Animation for Cards
// function initCardHoverEffects() {
//     const cards = document.querySelectorAll('.hover-lift');
    
//     cards.forEach(card => {
//         card.addEventListener('mouseenter', function() {
//             this.style.transform = 'translateY(-10px)';
//             this.style.transition = 'all 0.3s ease';
//         });
        
//         card.addEventListener('mouseleave', function() {
//             this.style.transform = 'translateY(0)';
//         });
//     });
// }

// // Initialize all animations
// document.addEventListener('DOMContentLoaded', () => {
//     initScrollAnimations();
//     initCounters();
//     initProgressBars();
//     initCardHoverEffects();
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