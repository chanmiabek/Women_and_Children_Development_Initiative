// // Donation Processing Script

// document.addEventListener('DOMContentLoaded', function() {
//     initDonationButtons();
//     initDonationModal();
//     initPaymentProcessing();
// });

// let selectedAmount = null;
// let isRecurring = false;

// function initDonationButtons() {
//     const amountButtons = document.querySelectorAll('.donation-amount');
//     const customAmount = document.getElementById('custom-amount');
//     const recurringCheckbox = document.querySelector('input[type="checkbox"]');
    
//     if (amountButtons) {
//         amountButtons.forEach(button => {
//             button.addEventListener('click', function() {
//                 // Remove active class from all buttons
//                 amountButtons.forEach(btn => {
//                     btn.classList.remove('bg-orange-600', 'text-white');
//                     btn.classList.add('bg-gray-100', 'text-gray-800');
//                 });
                
//                 // Add active class to clicked button
//                 this.classList.remove('bg-gray-100', 'text-gray-800');
//                 this.classList.add('bg-orange-600', 'text-white');
                
//                 selectedAmount = parseInt(this.dataset.amount);
//                 if (customAmount) customAmount.value = '';
//             });
//         });
//     }
    
//     if (customAmount) {
//         customAmount.addEventListener('input', function() {
//             if (this.value) {
//                 selectedAmount = parseFloat(this.value);
//                 // Remove selection from preset buttons
//                 amountButtons?.forEach(btn => {
//                     btn.classList.remove('bg-orange-600', 'text-white');
//                     btn.classList.add('bg-gray-100', 'text-gray-800');
//                 });
//             }
//         });
//     }
    
//     if (recurringCheckbox) {
//         recurringCheckbox.addEventListener('change', function() {
//             isRecurring = this.checked;
//         });
//     }
// }

// function initDonationModal() {
//     const modal = document.getElementById('donation-modal');
//     const closeBtns = document.querySelectorAll('.close-modal');
    
//     if (closeBtns) {
//         closeBtns.forEach(btn => {
//             btn.addEventListener('click', () => {
//                 if (modal) modal.classList.remove('active');
//             });
//         });
//     }
    
//     // Close modal when clicking outside
//     if (modal) {
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) {
//                 modal.classList.remove('active');
//             }
//         });
//     }
// }

// async function processDonation() {
//     if (!selectedAmount || selectedAmount <= 0) {
//         showToast('Please select or enter a donation amount', 'error');
//         return;
//     }
    
//     const program = document.querySelector('select')?.value || 'general';
//     const donationData = {
//         amount: selectedAmount,
//         program: program,
//         recurring: isRecurring,
//         timestamp: new Date().toISOString()
//     };
    
//     // Show payment modal
//     showPaymentModal(donationData);
// }

// function showPaymentModal(donationData) {
//     const modal = document.getElementById('payment-modal');
//     if (!modal) {
//         // Create modal if it doesn't exist
//         createPaymentModal(donationData);
//     } else {
//         modal.classList.add('active');
//         updatePaymentModal(donationData);
//     }
// }

// function createPaymentModal(donationData) {
//     const modalHTML = `
//         <div id="payment-modal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
//                 <div class="flex justify-between items-center mb-6">
//                     <h3 class="text-2xl font-bold">Complete Your Donation</h3>
//                     <button class="close-modal text-gray-400 hover:text-gray-600">&times;</button>
//                 </div>
//                 <div class="mb-6">
//                     <div class="bg-orange-50 p-4 rounded-lg mb-4">
//                         <p class="text-sm text-gray-600">Donation Amount</p>
//                         <p class="text-2xl font-bold text-orange-600">$${donationData.amount}</p>
//                         ${donationData.recurring ? '<p class="text-sm text-gray-500">Monthly Recurring</p>' : ''}
//                         <p class="text-sm text-gray-500 mt-1">Program: ${donationData.program}</p>
//                     </div>
                    
//                     <form id="payment-form">
//                         <div class="mb-4">
//                             <label class="block text-gray-700 mb-2">Cardholder Name</label>
//                             <input type="text" id="card-name" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600">
//                         </div>
//                         <div class="mb-4">
//                             <label class="block text-gray-700 mb-2">Card Number</label>
//                             <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600">
//                         </div>
//                         <div class="grid grid-cols-2 gap-4 mb-4">
//                             <div>
//                                 <label class="block text-gray-700 mb-2">Expiry Date</label>
//                                 <input type="text" id="card-expiry" placeholder="MM/YY" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600">
//                             </div>
//                             <div>
//                                 <label class="block text-gray-700 mb-2">CVV</label>
//                                 <input type="text" id="card-cvv" placeholder="123" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600">
//                             </div>
//                         </div>
//                         <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
//                             Donate $${donationData.amount}
//                         </button>
//                     </form>
//                 </div>
//                 <div class="text-center text-xs text-gray-500">
//                     <i class="fas fa-lock mr-1"></i> Secure payment processing
//                 </div>
//             </div>
//         </div>
//     `;
    
//     document.body.insertAdjacentHTML('beforeend', modalHTML);
    
//     const modal = document.getElementById('payment-modal');
//     const closeBtn = modal.querySelector('.close-modal');
//     const paymentForm = document.getElementById('payment-form');
    
//     closeBtn.addEventListener('click', () => modal.classList.remove('active'));
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) modal.classList.remove('active');
//     });
    
//     paymentForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         await processPayment(donationData);
//     });
// }

// function updatePaymentModal(donationData) {
//     const modal = document.getElementById('payment-modal');
//     const amountDisplay = modal.querySelector('.bg-orange-50 p.text-2xl');
//     if (amountDisplay) {
//         amountDisplay.textContent = `$${donationData.amount}`;
//     }
// }

// async function processPayment(donationData) {
//     const submitBtn = document.querySelector('#payment-form button[type="submit"]');
//     showLoading(submitBtn);
    
//     // Simulate payment processing
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // Generate receipt
//     const receipt = {
//         transactionId: generateTransactionId(),
//         amount: donationData.amount,
//         program: donationData.program,
//         recurring: donationData.recurring,
//         date: new Date().toISOString(),
//         email: document.getElementById('card-name')?.value || 'Donor'
//     };
    
//     // Save to localStorage
//     saveDonation(receipt);
    
//     // Send email receipt
//     await sendReceipt(receipt);
    
//     hideLoading(submitBtn);
    
//     // Close modal and show success
//     document.getElementById('payment-modal')?.classList.remove('active');
//     showDonationSuccess(receipt);
// }

// function generateTransactionId() {
//     return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
// }

// function saveDonation(receipt) {
//     const donations = JSON.parse(localStorage.getItem('donations') || '[]');
//     donations.push(receipt);
//     localStorage.setItem('donations', JSON.stringify(donations));
// }

// async function sendReceipt(receipt) {
//     // Simulate sending email receipt
//     console.log('Sending receipt to donor:', receipt);
    
//     // Store receipt in localStorage for demo
//     localStorage.setItem('last_receipt', JSON.stringify(receipt));
// }

// function showDonationSuccess(receipt) {
//     const successHTML = `
//         <div id="donation-success" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
//                 <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <i class="fas fa-check text-green-600 text-3xl"></i>
//                 </div>
//                 <h3 class="text-2xl font-bold mb-2">Thank You for Your Donation!</h3>
//                 <p class="text-gray-600 mb-4">Your generosity makes a difference in the lives of women and children.</p>
//                 <div class="bg-gray-50 p-4 rounded-lg mb-4 text-left">
//                     <p class="text-sm"><strong>Transaction ID:</strong> ${receipt.transactionId}</p>
//                     <p class="text-sm"><strong>Amount:</strong> $${receipt.amount}</p>
//                     <p class="text-sm"><strong>Program:</strong> ${receipt.program}</p>
//                     <p class="text-sm"><strong>Date:</strong> ${new Date(receipt.date).toLocaleString()}</p>
//                 </div>
//                 <button onclick="window.print()" class="bg-gray-600 text-white px-6 py-2 rounded-lg mr-3 hover:bg-gray-700 transition">
//                     <i class="fas fa-print mr-2"></i> Print Receipt
//                 </button>
//                 <button onclick="closeDonationSuccess()" class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
//                     Close
//                 </button>
//             </div>
//         </div>
//     `;
    
//     document.body.insertAdjacentHTML('beforeend', successHTML);
    
//     // Track donation in analytics
//     trackDonation(receipt);
// }

// function closeDonationSuccess() {
//     const successModal = document.getElementById('donation-success');
//     if (successModal) successModal.remove();
// }

// function trackDonation(receipt) {
//     // Google Analytics or other tracking
//     if (typeof gtag !== 'undefined') {
//         gtag('event', 'donation', {
//             'event_category': 'Donations',
//             'event_label': receipt.program,
//             'value': receipt.amount
//         });
//     }
    
//     console.log('Donation tracked:', receipt);
// }

// // Make processDonation available globally
// window.processDonation = processDonation;
// window.closeDonationSuccess = closeDonationSuccess;