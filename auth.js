// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    // Handle tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });

    // Function to get registered users from localStorage
    function getRegisteredUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : {};
    }

    // Function to save registered users to localStorage
    function saveRegisteredUsers(users) {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Simple validation
        if (!phone.match(/^03[0-9]{9}$/)) {
            alert('Please enter a valid phone number');
            return;
        }

        // Get registered users
        const users = getRegisteredUsers();

        // Check if user exists and password matches
        if (!users[phone]) {
            alert('Account not found. Please sign up first.');
            return;
        }

        if (users[phone].password !== password) {
            alert('Incorrect password. Please try again.');
            return;
        }

        // Successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userName', users[phone].name);
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        window.location.href = 'index.html';
    });

    // Sign up form submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const terms = document.getElementById('terms').checked;

        // Validation
        if (!phone.match(/^03[0-9]{9}$/)) {
            alert('Please enter a valid phone number');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!terms) {
            alert('Please agree to the Terms & Conditions');
            return;
        }

        // Get registered users
        const users = getRegisteredUsers();

        // Check if user already exists
        if (users[phone]) {
            alert('An account with this phone number already exists. Please login instead.');
            document.querySelector('[data-tab="login"]').click();
            return;
        }

        // Add new user
        users[phone] = {
            name: name,
            password: password,
            registeredOn: new Date().toISOString()
        };

        // Save updated users
        saveRegisteredUsers(users);

        // Automatically log in the user
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userName', name);

        // Show success message and redirect to home page
        alert('Account created successfully! Redirecting to home page...');
        window.location.href = 'index.html';
    });

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true' && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}); 