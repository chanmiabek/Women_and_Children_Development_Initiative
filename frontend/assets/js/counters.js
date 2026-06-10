// // Counter Animation Script

// document.addEventListener('DOMContentLoaded', function() {
//     initImpactCounters();
// });

// function initImpactCounters() {
//     const counters = document.querySelectorAll('.counter');
    
//     const options = {
//         threshold: 0.5,
//         rootMargin: '0px'
//     };
    
//     const observer = new IntersectionObserver(function(entries, observer) {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const counter = entry.target;
//                 const target = parseInt(counter.getAttribute('data-target'));
//                 const duration = 2000;
//                 const step = target / (duration / 16);
                
//                 if (!counter.classList.contains('counted')) {
//                     counter.classList.add('counted');
//                     let current = 0;
                    
//                     const updateCounter = () => {
//                         current += step;
//                         if (current < target) {
//                             counter.textContent = Math.floor(current).toLocaleString();
//                             requestAnimationFrame(updateCounter);
//                         } else {
//                             counter.textContent = target.toLocaleString();
//                         }
//                     };
                    
//                     updateCounter();
//                 }
                
//                 observer.unobserve(counter);
//             }
//         });
//     }, options);
    
//     counters.forEach(counter => observer.observe(counter));
// }

// // Animate Percentage Counters
// function initPercentageCounters() {
//     const percentageCounters = document.querySelectorAll('.percentage-counter');
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const counter = entry.target;
//                 const target = parseInt(counter.dataset.target);
//                 const duration = 1500;
//                 let start = 0;
                
//                 const step = (timestamp) => {
//                     if (!start) start = timestamp;
//                     const progress = timestamp - start;
//                     const percentage = Math.min((progress / duration) * target, target);
//                     counter.textContent = Math.floor(percentage) + '%';
                    
//                     if (progress < duration) {
//                         requestAnimationFrame(step);
//                     }
//                 };
                
//                 requestAnimationFrame(step);
//                 observer.unobserve(counter);
//             }
//         });
//     });
    
//     percentageCounters.forEach(counter => observer.observe(counter));
// }

// // Animated Number Display
// class AnimatedNumber {
//     constructor(element, options = {}) {
//         this.element = element;
//         this.startValue = options.start || 0;
//         this.endValue = options.end || 100;
//         this.duration = options.duration || 2000;
//         this.decimals = options.decimals || 0;
//         this.prefix = options.prefix || '';
//         this.suffix = options.suffix || '';
//         this.currentValue = this.startValue;
//         this.animationId = null;
//     }
    
//     start() {
//         const startTime = performance.now();
//         const difference = this.endValue - this.startValue;
        
//         const animate = (currentTime) => {
//             const elapsed = currentTime - startTime;
//             const progress = Math.min(elapsed / this.duration, 1);
            
//             this.currentValue = this.startValue + (difference * progress);
//             this.updateDisplay();
            
//             if (progress < 1) {
//                 this.animationId = requestAnimationFrame(animate);
//             } else {
//                 this.cancel();
//             }
//         };
        
//         this.animationId = requestAnimationFrame(animate);
//     }
    
//     updateDisplay() {
//         const value = this.currentValue.toFixed(this.decimals);
//         this.element.textContent = `${this.prefix}${value}${this.suffix}`;
//     }
    
//     cancel() {
//         if (this.animationId) {
//             cancelAnimationFrame(this.animationId);
//             this.animationId = null;
//         }
//     }
// }

// // Usage example
// document.querySelectorAll('.animated-number').forEach(element => {
//     const target = parseInt(element.dataset.target);
//     const animatedNumber = new AnimatedNumber(element, {
//         end: target,
//         duration: 2000,
//         prefix: element.dataset.prefix || '',
//         suffix: element.dataset.suffix || ''
//     });
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 animatedNumber.start();
//                 observer.unobserve(element);
//             }
//         });
//     });
    
//     observer.observe(element);
// });