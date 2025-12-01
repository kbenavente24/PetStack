const form = document.getElementById('login-Form');
const messageArea = document.getElementById('messageArea');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // If server doesn't send JSON (e.g. 404 HTML), this will be safer
        let data;
        try {
            data = await response.json();
        } catch (err) {
            showMessage(`Unexpected response from server (status ${response.status}).`);
            return;
        }

        if (data.success) {
            // Redirect to account page

            localStorage.setItem("userData", JSON.stringify(data));

            window.location.href = '/account.html';
        } else {
            showMessage(data.error || 'Login failed.');
        }
    } catch (err) {
        // This only runs on real network issues or if the connection is refused
        showMessage('Network error. Try again.');
    }
});

function showMessage(msg) {
    messageArea.textContent = msg;
    messageArea.style.display = 'block';
}
