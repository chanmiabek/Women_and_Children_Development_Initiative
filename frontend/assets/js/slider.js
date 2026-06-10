// // Swiper Slider Configuration

// document.addEventListener('DOMContentLoaded', function() {
//     initStorySlider();
//     initTestimonialSlider();
//     initGallerySlider();
//     initPartnerSlider();
// });

// // Story Slider
// function initStorySlider() {
//     const storySlider = document.querySelector('.story-slider');
    
//     if (storySlider) {
//         new Swiper('.story-slider', {
//             slidesPerView: 1,
//             spaceBetween: 30,
//             loop: true,
//             autoplay: {
//                 delay: 5000,
//                 disableOnInteraction: false,
//             },
//             pagination: {
//                 el: '.swiper-pagination',
//                 clickable: true,
//                 dynamicBullets: true,
//             },
//             navigation: {
//                 nextEl: '.swiper-button-next',
//                 prevEl: '.swiper-button-prev',
//             },
//             breakpoints: {
//                 640: {
//                     slidesPerView: 1,
//                     spaceBetween: 20,
//                 },
//                 768: {
//                     slidesPerView: 2,
//                     spaceBetween: 30,
//                 },
//                 1024: {
//                     slidesPerView: 3,
//                     spaceBetween: 30,
//                 },
//             },
//             effect: 'slide',
//             speed: 800,
//             grabCursor: true,
//             parallax: true,
//             keyboard: {
//                 enabled: true,
//             },
//         });
//     }
// }

// // Testimonial Slider
// function initTestimonialSlider() {
//     const testimonialSlider = document.querySelector('.testimonial-slider');
    
//     if (testimonialSlider) {
//         new Swiper('.testimonial-slider', {
//             slidesPerView: 1,
//             spaceBetween: 30,
//             loop: true,
//             autoplay: {
//                 delay: 6000,
//                 disableOnInteraction: false,
//             },
//             pagination: {
//                 el: '.swiper-pagination',
//                 clickable: true,
//             },
//             navigation: {
//                 nextEl: '.swiper-button-next',
//                 prevEl: '.swiper-button-prev',
//             },
//             effect: 'fade',
//             fadeEffect: {
//                 crossFade: true
//             },
//             speed: 1000,
//         });
//     }
// }

// // Gallery Slider
// function initGallerySlider() {
//     const gallerySlider = document.querySelector('.gallery-slider');
    
//     if (gallerySlider) {
//         new Swiper('.gallery-slider', {
//             slidesPerView: 2,
//             spaceBetween: 15,
//             loop: true,
//             navigation: {
//                 nextEl: '.swiper-button-next',
//                 prevEl: '.swiper-button-prev',
//             },
//             breakpoints: {
//                 640: {
//                     slidesPerView: 2,
//                     spaceBetween: 20,
//                 },
//                 768: {
//                     slidesPerView: 3,
//                     spaceBetween: 30,
//                 },
//                 1024: {
//                     slidesPerView: 4,
//                     spaceBetween: 30,
//                 },
//             },
//             zoom: {
//                 enabled: true,
//                 maxRatio: 3,
//             },
//             grabCursor: true,
//         });
//     }
// }

// // Partner Slider
// function initPartnerSlider() {
//     const partnerSlider = document.querySelector('.partner-slider');
    
//     if (partnerSlider) {
//         new Swiper('.partner-slider', {
//             slidesPerView: 2,
//             spaceBetween: 20,
//             loop: true,
//             autoplay: {
//                 delay: 3000,
//                 disableOnInteraction: false,
//             },
//             breakpoints: {
//                 640: {
//                     slidesPerView: 3,
//                     spaceBetween: 30,
//                 },
//                 768: {
//                     slidesPerView: 4,
//                     spaceBetween: 40,
//                 },
//                 1024: {
//                     slidesPerView: 6,
//                     spaceBetween: 50,
//                 },
//             },
//             speed: 500,
//             allowTouchMove: false,
//         });
//     }
// }

// // Custom Slider Controls
// class CustomSlider {
//     constructor(container, options = {}) {
//         this.container = container;
//         this.slides = container.querySelectorAll('.slide');
//         this.currentIndex = 0;
//         this.totalSlides = this.slides.length;
//         this.autoPlay = options.autoPlay || false;
//         this.interval = options.interval || 5000;
//         this.autoPlayId = null;
        
//         this.init();
//     }
    
//     init() {
//         this.createControls();
//         this.updateSlides();
        
//         if (this.autoPlay) {
//             this.startAutoPlay();
//         }
//     }
    
//     createControls() {
//         // Previous button
//         const prevBtn = document.createElement('button');
//         prevBtn.className = 'slider-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10';
//         prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
//         prevBtn.addEventListener('click', () => this.prev());
        
//         // Next button
//         const nextBtn = document.createElement('button');
//         nextBtn.className = 'slider-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10';
//         nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
//         nextBtn.addEventListener('click', () => this.next());
        
//         // Dots
//         const dotsContainer = document.createElement('div');
//         dotsContainer.className = 'slider-dots absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10';
        
//         for (let i = 0; i < this.totalSlides; i++) {
//             const dot = document.createElement('button');
//             dot.className = 'w-2 h-2 rounded-full bg-white opacity-50 transition-all duration-300';
//             dot.addEventListener('click', () => this.goTo(i));
//             dotsContainer.appendChild(dot);
//         }
        
//         this.container.style.position = 'relative';
//         this.container.appendChild(prevBtn);
//         this.container.appendChild(nextBtn);
//         this.container.appendChild(dotsContainer);
        
//         this.dots = dotsContainer.children;
//     }
    
//     updateSlides() {
//         this.slides.forEach((slide, index) => {
//             slide.style.display = index === this.currentIndex ? 'block' : 'none';
//         });
        
//         // Update dots
//         if (this.dots) {
//             Array.from(this.dots).forEach((dot, index) => {
//                 if (index === this.currentIndex) {
//                     dot.classList.add('bg-white', 'opacity-100');
//                     dot.classList.remove('opacity-50');
//                 } else {
//                     dot.classList.remove('bg-white', 'opacity-100');
//                     dot.classList.add('opacity-50');
//                 }
//             });
//         }
//     }
    
//     next() {
//         this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
//         this.updateSlides();
//         this.resetAutoPlay();
//     }
    
//     prev() {
//         this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
//         this.updateSlides();
//         this.resetAutoPlay();
//     }
    
//     goTo(index) {
//         this.currentIndex = index;
//         this.updateSlides();
//         this.resetAutoPlay();
//     }
    
//     startAutoPlay() {
//         if (this.autoPlayId) {
//             clearInterval(this.autoPlayId);
//         }
//         this.autoPlayId = setInterval(() => this.next(), this.interval);
//     }
    
//     stopAutoPlay() {
//         if (this.autoPlayId) {
//             clearInterval(this.autoPlayId);
//             this.autoPlayId = null;
//         }
//     }
    
//     resetAutoPlay() {
//         if (this.autoPlay) {
//             this.stopAutoPlay();
//             this.startAutoPlay();
//         }
//     }
// }

// // Initialize custom sliders
// document.querySelectorAll('.custom-slider').forEach(slider => {
//     new CustomSlider(slider, {
//         autoPlay: true,
//         interval: 5000
//     });
// });