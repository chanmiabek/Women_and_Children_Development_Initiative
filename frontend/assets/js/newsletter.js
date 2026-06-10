// // Newsletter Subscription Handler

// document.addEventListener('DOMContentLoaded', function() {
//     initNewsletterSignup();
//     initEmailPreferences();
// });

// function initNewsletterSignup() {
//     const newsletterForms = document.querySelectorAll('.newsletter-form');
    
//     newsletterForms.forEach(form => {
//         form.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             const emailInput = this.querySelector('input[type="email"]');
//             const email = emailInput?.value;
//             const subscribeBtn = this.querySelector('button[type="submit"]');
            
//             if (!email || !isValidEmail(email)) {
//                 showNewsletterMessage(this, 'Please enter a valid email address', 'error');
//                 return;
//             }
            
//             showLoading(subscribeBtn);
            
//             try {
//                 const result = await subscribeToNewsletter(email);
//                 if (result.success) {
//                     showNewsletterMessage(this, 'Successfully subscribed! Check your email for confirmation.', 'success');
//                     emailInput.value = '';
                    
//                     // Store in localStorage
//                     saveSubscriber(email);
                    
//                     // Send to backend
//                     await sendToNewsletterAPI(email);
//                 } else {
//                     showNewsletterMessage(this, result.message || 'Subscription failed. Please try again.', 'error');
//                 }
//             } catch (error) {
//                 console.error('Newsletter subscription error:', error);
//                 showNewsletterMessage(this, 'Something went wrong. Please try again later.', 'error');
//             } finally {
//                 hideLoading(subscribeBtn);
//             }
//         });
//     });
// }

// async function subscribeToNewsletter(email) {
//     // Simulate API call
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({ success: true, message: 'Subscribed successfully!' });
//         }, 1000);
//     });
// }

// async function sendToNewsletterAPI(email) {
//     // Replace with your actual newsletter service API
//     const API_KEY = 'YOUR_MAILCHIMP_API_KEY';
//     const LIST_ID = 'YOUR_LIST_ID';
//     const DATACENTER = 'us1';
    
//     try {
//         const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `apikey ${API_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 email_address: email,
//                 status: 'subscribed'
//             })
//         });
        
//         if (response.ok) {
//             console.log('Successfully added to Mailchimp');
//         }
//     } catch (error) {
//         console.error('Mailchimp API error:', error);
//         // Fallback: Save to localStorage
//         saveToLocalStorage(email);
//     }
// }

// function showNewsletterMessage(form, message, type) {
//     let messageDiv = form.querySelector('.newsletter-message');
    
//     if (!messageDiv) {
//         messageDiv = document.createElement('div');
//         messageDiv.className = 'newsletter-message mt-3 text-sm';
//         form.appendChild(messageDiv);
//     }
    
//     messageDiv.textContent = message;
//     messageDiv.className = `newsletter-message mt-3 text-sm ${
//         type === 'success' ? 'text-green-600' : 'text-red-600'
//     }`;
    
//     setTimeout(() => {
//         if (messageDiv) messageDiv.remove();
//     }, 5000);
// }

// function saveSubscriber(email) {
//     const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
//     if (!subscribers.includes(email)) {
//         subscribers.push({
//             email: email,
//             subscribedAt: new Date().toISOString(),
//             status: 'active'
//         });
//         localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        
//         // Update subscriber count
//         updateSubscriberCount();
//     }
// }

// function saveToLocalStorage(email) {
//     const pendingSubscribers = JSON.parse(localStorage.getItem('pending_subscribers') || '[]');
//     if (!pendingSubscribers.includes(email)) {
//         pendingSubscribers.push(email);
//         localStorage.setItem('pending_subscribers', JSON.stringify(pendingSubscribers));
//     }
// }

// function updateSubscriberCount() {
//     const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
//     const countElements = document.querySelectorAll('.subscriber-count');
    
//     countElements.forEach(element => {
//         element.textContent = subscribers.length.toLocaleString();
//     });
// }

// function initEmailPreferences() {
//     const prefForm = document.getElementById('email-preferences');
    
//     if (prefForm) {
//         prefForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             const email = document.getElementById('pref-email')?.value;
//             const preferences = {
//                 newsletters: document.getElementById('pref-newsletters')?.checked || false,
//                 events: document.getElementById('pref-events')?.checked || false,
//                 updates: document.getElementById('pref-updates')?.checked || false,
//                 volunteer: document.getElementById('pref-volunteer')?.checked || false
//             };
            
//             if (!email || !isValidEmail(email)) {
//                 showFormMessage(prefForm, 'Please enter a valid email address', 'error');
//                 return;
//             }
            
//             const submitBtn = prefForm.querySelector('button[type="submit"]');
//             showLoading(submitBtn);
            
//             try {
//                 await updateEmailPreferences(email, preferences);
//                 showFormMessage(prefForm, 'Your preferences have been updated!', 'success');
//             } catch (error) {
//                 console.error('Error updating preferences:', error);
//                 showFormMessage(prefForm, 'Failed to update preferences. Please try again.', 'error');
//             } finally {
//                 hideLoading(submitBtn);
//             }
//         });
//     }
// }

// async function updateEmailPreferences(email, preferences) {
//     // Simulate API call
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             localStorage.setItem(`preferences_${email}`, JSON.stringify(preferences));
//             resolve({ success: true });
//         }, 1000);
//     });
// }

// // Unsubscribe handler
// function initUnsubscribe() {
//     const unsubscribeForm = document.getElementById('unsubscribe-form');
    
//     if (unsubscribeForm) {
//         unsubscribeForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             const email = document.getElementById('unsubscribe-email')?.value;
            
//             if (!email || !isValidEmail(email)) {
//                 showFormMessage(unsubscribeForm, 'Please enter a valid email address', 'error');
//                 return;
//             }
            
//             const confirmUnsubscribe = confirm('Are you sure you want to unsubscribe from all newsletters?');
//             if (!confirmUnsubscribe) return;
            
//             const submitBtn = unsubscribeForm.querySelector('button[type="submit"]');
//             showLoading(submitBtn);
            
//             try {
//                 await unsubscribeFromNewsletter(email);
//                 showFormMessage(unsubscribeForm, 'You have been unsubscribed successfully.', 'success');
//                 unsubscribeForm.reset();
//             } catch (error) {
//                 console.error('Unsubscribe error:', error);
//                 showFormMessage(unsubscribeForm, 'Failed to unsubscribe. Please try again.', 'error');
//             } finally {
//                 hideLoading(submitBtn);
//             }
//         });
//     }
// }

// async function unsubscribeFromNewsletter(email) {
//     // Update localStorage
//     const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
//     const updatedSubscribers = subscribers.filter(sub => sub.email !== email);
//     localStorage.setItem('newsletter_subscribers', JSON.stringify(updatedSubscribers));
    
//     // Simulate API call
//     return new Promise((resolve) => {
//         setTimeout(() => resolve({ success: true }), 1000);
//     });
// }

// // Export functions
// window.subscribeToNewsletter = subscribeToNewsletter;
// window.unsubscribeFromNewsletter = unsubscribeFromNewsletter;