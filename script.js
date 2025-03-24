// Mobile Menu Toggle
document.getElementById('mobile-menu')?.addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Toggle menu icon
    const icon = this.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenu?.contains(e.target) && !navLinks?.contains(e.target)) {
        navLinks?.classList.remove('active');
        const icon = mobileMenu?.querySelector('i');
        if (icon?.classList.contains('fa-times')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Check authentication state
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authLinks = document.querySelector('.auth-links');
    const userInfo = document.querySelector('.user-info');
    const userPhone = document.querySelector('.user-phone');
    const incomeSection = document.getElementById('income');

    if (isLoggedIn) {
        authLinks.style.display = 'none';
        userInfo.style.display = 'flex';
        userPhone.textContent = localStorage.getItem('userPhone');
        if (incomeSection) incomeSection.style.display = 'block';
    } else {
        authLinks.style.display = 'flex';
        userInfo.style.display = 'none';
        if (incomeSection) incomeSection.style.display = 'none';
        window.location.href = 'login.html';
    }
}

// Handle logout
document.querySelector('.logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('rememberMe');
    window.location.href = 'login.html';
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Plan Selection
document.querySelectorAll('.plan-button').forEach(button => {
    button.addEventListener('click', function() {
        const planCard = this.closest('.plan-card');
        const planName = planCard.querySelector('h3').textContent;
        
        // Get the investment amount from the button text
        const amountText = this.textContent;
        const amount = parseInt(amountText.match(/\d+,*\d*/)[0].replace(',', ''));
        
        // Show scroll indicator
        const depositSection = document.querySelector('.deposit-section');
        const scrollIndicator = depositSection.querySelector('.scroll-indicator');
        scrollIndicator.classList.add('visible');
        
        // Scroll to deposit section
        depositSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add highlight effect to deposit section
        depositSection.classList.add('highlight');
        
        // Pre-fill the deposit amount
        setTimeout(() => {
            const depositAmount = document.getElementById('deposit-amount');
            depositAmount.value = amount;
            depositAmount.focus();
            
            // Hide scroll indicator after a delay
            setTimeout(() => {
                scrollIndicator.classList.remove('visible');
            }, 1500);
            
            // Remove highlight class
            setTimeout(() => {
                depositSection.classList.remove('highlight');
            }, 1000);
        }, 800); // Wait for scroll to complete
    });
});

// Currency conversion rate (1 USD = 279 PKR)
const USD_TO_PKR = 279;

// Format currency in PKR
function formatPKR(amount) {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
}

// Simulated income data (in PKR)
let accountData = {
    dailyIncome: 125.50 * USD_TO_PKR,
    availableBalance: 1250.75 * USD_TO_PKR,
    totalWithdrawn: 750.00 * USD_TO_PKR
};

// Update income statistics
function updateIncomeStats() {
    document.getElementById('daily-income').textContent = formatPKR(accountData.dailyIncome);
    document.getElementById('available-balance').textContent = formatPKR(accountData.availableBalance);
    document.getElementById('total-withdrawn').textContent = formatPKR(accountData.totalWithdrawn);
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
}

// Handle deposit form submission
document.getElementById('deposit-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('deposit-amount').value);

    if (amount < 500) {
        alert('Minimum deposit amount is Rs. 500');
        return;
    }

    // Create a new deposit order
    const order = {
        id: 'DP' + Date.now(),
        type: 'deposit',
        amount: amount,
        status: 'Pending',
        date: new Date().toISOString()
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('withdrawalOrders') || '[]');
    
    // Add new order to the beginning of the array
    existingOrders.unshift(order);
    
    // Save updated orders to localStorage
    localStorage.setItem('withdrawalOrders', JSON.stringify(existingOrders));

    // Redirect to order status page
    window.location.href = 'order-status.html';
});

// Handle withdrawal form submission
document.getElementById('withdraw-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);

    if (amount < 500) {
        alert('Minimum withdrawal amount is Rs. 500');
        return;
    }

    // Create a new withdrawal order
    const order = {
        id: 'WD' + Date.now(),
        type: 'withdrawal',
        amount: amount,
        status: 'Pending',
        date: new Date().toISOString()
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('withdrawalOrders') || '[]');
    
    // Add new order to the beginning of the array
    existingOrders.unshift(order);
    
    // Save updated orders to localStorage
    localStorage.setItem('withdrawalOrders', JSON.stringify(existingOrders));

    // Redirect to order status page
    window.location.href = 'order-status.html';
});

// Function to reset withdrawal form
function resetWithdrawalForm() {
    window.location.reload();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Add animation to plan cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.plan-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Update minimum values for deposit and withdrawal inputs
    document.getElementById('deposit-amount').min = 500;
    document.getElementById('withdraw-amount').min = 500;
    
    // Initialize income section
    updateIncomeStats();

    // Simulate real-time updates
    setInterval(updateIncomeStats, 30000); // Update every 30 seconds
}); 