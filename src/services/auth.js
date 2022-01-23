const storeAuth = (auth) => {
    localStorage.auth = JSON.stringify(auth);
}

const removeAuth = () => { 
    delete localStorage.auth;
}

const getToken = () => {
    const storedAuth = localStorage.auth ? JSON.parse(localStorage.auth) : null
    return storedAuth?.access_token
}

const getRefreshToken = () => {
    const storedAuth = localStorage.auth ? JSON.parse(localStorage.auth) : null
    return storedAuth?.refresh_token
}

export {storeAuth, removeAuth, getToken, getRefreshToken};