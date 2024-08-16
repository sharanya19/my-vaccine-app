// Function to set the token in local storage
function setToken(token: string) {
    localStorage.setItem('authToken', token);
}

// Function to get the token from local storage
function getToken() {
    return localStorage.getItem('authToken') || '';
}

export { setToken, getToken };