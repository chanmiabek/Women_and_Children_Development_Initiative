// // Form Submission Handler

// document.addEventListener('DOMContentLoaded', function() {
//     initContactForm();
//     initVolunteerForm();
//     initNewsletterForm();

//     const observer = new MutationObserver(() => initNewsletterForm());
//     observer.observe(document.body, { childList: true, subtree: true });
// });

// // Contact Form Handler
// function initContactForm() {
//     const contactForm = document.getElementById('contact-form');
    
//     if (contactForm) {
//         contactForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             const submitBtn = contactForm.querySelector('button[type="submit"]');
//             const formData = {
//                 name: document.getElementById('contact-name')?.value,
//                 email: document.getElementById('contact-email')?.value,
//                 subject: document.getElementById('contact-subject')?.value,
//                 message: document.getElementById('contact-message')?.value
//             };
            
//             // Validate form data
//             if (!formData.name || !formData.email || !formData.message) {
//                 showFormMessage(contactForm, 'Please fill in all required fields', 'error');
//                 return;
//             }
            
//             if (!isValidEmail(formData.email)) {
//                 showFormMessage(contactForm, 'Please enter a valid email address', 'error');
//                 return;
//             }
            
//             // Show loading state
//             showLoading(submitBtn);
            
//             try {
//                 // Simulate API call
//                 await simulateApiCall(formData);
                
//                 // Success message
//                 showFormMessage(contactForm, 'Thank you for your message! We\'ll get back to you soon.', 'success');
//                 contactForm.reset();
                
//                 // Send to Google Sheets or email service
//                 await sendToGoogleSheets(formData, 'contact');
                
//             } catch (error) {
//                 console.error('Form submission error:', error);
//                 showFormMessage(contactForm, 'Something went wrong. Please try again later.', 'error');
//             } finally {
//                 hideLoading(submitBtn);
//             }
//         });
//     }
// }

// // Volunteer Form Handler
// function initVolunteerForm() {
//     const volunteerForm = document.getElementById('volunteer-form');
    
//     if (volunteerForm) {
//         // Initialize skill tags
//         initSkillTags();
        
//         volunteerForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             const submitBtn = volunteerForm.querySelector('button[type="submit"]');
            
//             const formData = {
//                 fullName: document.getElementById('volunteer-name')?.value,
//                 email: document.getElementById('volunteer-email')?.value,
//                 phone: document.getElementById('volunteer-phone')?.value,
//                 age: document.getElementById('volunteer-age')?.value,
//                 occupation: document.getElementById('volunteer-occupation')?.value,
//                 availability: document.getElementById('volunteer-availability')?.value,
//                 skills: getSelectedSkills(),
//                 motivation: document.getElementById('volunteer-motivation')?.value,
//                 experience: document.getElementById('volunteer-experience')?.value
//             };
            
//             // Validate
//             if (!formData.fullName || !formData.email || !formData.phone) {
//                 showFormMessage(volunteerForm, 'Please fill in all required fields', 'error');
//                 return;
//             }
            
//             if (!isValidEmail(formData.email)) {
//                 showFormMessage(volunteerForm, 'Please enter a valid email address', 'error');
//                 return;
//             }
            
//             if (!isValidPhone(formData.phone)) {
//                 showFormMessage(volunteerForm, 'Please enter a valid phone number', 'error');
//                 return;
//             }
            
//             showLoading(submitBtn);
            
//             try {
//                 await simulateApiCall(formData);
//                 showFormMessage(volunteerForm, 'Thank you for applying to volunteer! We\'ll contact you soon.', 'success');
//                 volunteerForm.reset();
//                 resetSkillTags();
//                 await sendToGoogleSheets(formData, 'volunteer');
//             } catch (error) {
//                 console.error('Volunteer form error:', error);
//                 showFormMessage(volunteerForm, 'Something went wrong. Please try again.', 'error');
//             } finally {
//                 hideLoading(submitBtn);
//             }
//         });
//     }
// }

// // Newsletter Form Handler
// function initNewsletterForm() {
//     const newsletterForms = document.querySelectorAll('#newsletter-form, #footer-newsletter, .newsletter-form');

//     newsletterForms.forEach(newsletterForm => {
//         if (newsletterForm.dataset.newsletterBound === 'true') return;
//         newsletterForm.dataset.newsletterBound = 'true';

//         newsletterForm.addEventListener('submit', async function(e) {
//             e.preventDefault();

//             const emailInput = newsletterForm.querySelector('input[type="email"]');
//             const email = emailInput?.value;
            
//             if (!email || !isValidEmail(email)) {
//                 showFormMessage(newsletterForm, 'Please enter a valid email address', 'error');
//                 return;
//             }
            
//             const submitBtn = newsletterForm.querySelector('button[type="submit"]');
//             showLoading(submitBtn);
            
//             try {
//                 await simulateApiCall({ email });
//                 showFormMessage(newsletterForm, 'Successfully subscribed to newsletter!', 'success');
//                 emailInput.value = '';
                
//                 // Save to localStorage
//                 saveSubscriber(email);
//                 await sendToGoogleSheets({ email, subscribedAt: new Date().toISOString() }, 'newsletter');
//             } catch (error) {
//                 console.error('Newsletter error:', error);
//                 showFormMessage(newsletterForm, 'Something went wrong. Please try again.', 'error');
//             } finally {
//                 hideLoading(submitBtn);
//             }
//         });
//     });
// }

// // Helper Functions
// function showFormMessage(form, message, type) {
//     let messageDiv = form.querySelector('.form-message');
    
//     if (!messageDiv) {
//         messageDiv = document.createElement('div');
//         messageDiv.className = 'form-message mt-4 p-3 rounded-lg';
//         form.appendChild(messageDiv);
//     }
    
//     messageDiv.textContent = message;
//     messageDiv.className = `form-message mt-4 p-3 rounded-lg ${
//         type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//     }`;
    
//     // Auto-hide after 5 seconds
//     setTimeout(() => {
//         if (messageDiv) {
//             messageDiv.style.opacity = '0';
//             setTimeout(() => messageDiv.remove(), 300);
//         }
//     }, 5000);
// }

// function showLoading(button) {
//     const originalText = button.innerHTML;
//     button.disabled = true;
//     button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
//     button.dataset.originalText = originalText;
// }

// function hideLoading(button) {
//     button.disabled = false;
//     button.innerHTML = button.dataset.originalText || 'Submit';
// }

// function simulateApiCall(data) {
//     return new Promise((resolve) => {
//         setTimeout(() => resolve(data), 1500);
//     });
// }

// // Google Sheets Integration
// async function sendToGoogleSheets(data, formType) {
//     // Add your Google Apps Script URL here when a live backend is ready.
//     const SCRIPT_URL = '';

//     if (!SCRIPT_URL) {
//         saveToLocalStorage(data, formType);
//         return;
//     }
    
//     try {
//         const response = await fetch(SCRIPT_URL, {
//             method: 'POST',
//             mode: 'no-cors',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 formType: formType,
//                 data: data,
//                 timestamp: new Date().toISOString()
//             })
//         });
        
//         console.log(`Form data sent to Google Sheets: ${formType}`);
//     } catch (error) {
//         console.error('Failed to send to Google Sheets:', error);
//         saveToLocalStorage(data, formType);
//     }
// }

// // LocalStorage fallback
// function saveToLocalStorage(data, formType) {
//     const key = `${formType}_submissions`;
//     const existing = JSON.parse(localStorage.getItem(key) || '[]');
//     existing.push({
//         ...data,
//         timestamp: new Date().toISOString()
//     });
//     localStorage.setItem(key, JSON.stringify(existing));
// }

// function saveSubscriber(email) {
//     const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
//     if (!subscribers.includes(email)) {
//         subscribers.push(email);
//         localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
//     }
// }

// // Skill Tags for Volunteer Form
// function initSkillTags() {
//     const skillTags = document.querySelectorAll('.skill-tag');
    
//     skillTags.forEach(tag => {
//         tag.addEventListener('click', () => {
//             tag.classList.toggle('selected');
//             tag.classList.toggle('bg-orange-600');
//             tag.classList.toggle('text-white');
//         });
//     });
// }

// function getSelectedSkills() {
//     const selected = [];
//     document.querySelectorAll('.skill-tag.selected').forEach(tag => {
//         selected.push(tag.textContent.trim());
//     });
//     return selected;
// }

// function resetSkillTags() {
//     document.querySelectorAll('.skill-tag').forEach(tag => {
//         tag.classList.remove('selected', 'bg-orange-600', 'text-white');
//     });
// }
