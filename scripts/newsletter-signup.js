const form = document.getElementById('newsletterSignupForm')

form.addEventListener('submit', e => {
    e.preventDefault()
    const form = e.target
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.name.value,
        email: form.elements.email.value
    })

    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('newsletterSignupFormContainer')

    fetch('/api/newsletter-signup', { method:'post',body,headers})
    .then(resp => {
        const successful = resp.status >= 200 || resp.status <= 299
        if (successful)
            return resp.json()
        else
            throw new Error(`Request failed with status ${resp.status}`)
    })
    .then(json => {
        container.innerHTML = '<b>Thank you for signing up!</b>'
    })
    .catch(err => {
        container.innerHTML = `<b>We're sorry, we had a problem ` +
            `signing you up. Please <a href="/newsletter"try again</a>`
    })
})