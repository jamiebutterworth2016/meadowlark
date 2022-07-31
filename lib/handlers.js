const fortune = require('./fortune')

exports.home = (req, res) => {
    res.render('home')
}

exports.about = (req, res) => res.render('about', { fortune: fortune.getFortune() })
exports.notFound = (req, res) => res.status(404).render('404')
exports.serverError = (err, req, res, next) => {
    console.log(err)
    res.status(500).render('500')
}

exports.headers = (req, res) => {
    res.type('text/plain')
    const headers = Object.entries(req.headers)
        .map(([key, value]) => `${key}:${value}`)
    res.send(headers.join('\n'))
}

exports.error = (req, res) => res.status(500).render('error')

exports.greeting = (req, res) => {
    res.render('/greeting', {
        message: 'Hello esteemed programmer!',
        style: req.query.style,
        userid: req.cookies.userid,
        username: req.session.username
    })
}

exports.noLayout = (req, res) => {
    res.render('no-layout', { layout: null })
}

exports.customLayout = (req, res) => {
    res.render('custom-layout', { layout: 'custom' })
}

exports.text = (req, res) => {
    res.type('text/plain').send('this is a test')
}

exports.processContact = (req, res) => {

    try {
        if (req.body.simulateError) throw new Error("error saving contact!")

        console.log(`contact from ${req.body.name} <${req.body.email}>`)

        res.format({
            'text/html': () => res.redirect(303, 'thank-you'),
            'application/json': () => res.json({ success: true })
        })
    } catch (err) {
        console.error(`error processing contact from ${req.body.name} <${req.body.email}>`)

        res.format({
            'text/html': () => res.redirect(303, 'contact-error'),
            'application/json': () => res.status(500).json({
                error: 'error saving contact information'
            })
        })
    }
}

exports.thankYou = (req, res) => {
    res.render('thank-you')
}

exports.contactError = (req, res) => {
    res.render('contact-error')
}

const tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 }
]

exports.tours = (req, res) => {

    const toursAsXml = tours
        .map(p =>
            `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`)
        .join('')

    const toursXml = '<?xml version="1.0"?><tours>' + toursAsXml + '</tours>'

    const toursText = tours.map(p => `${p.id}: ${p.name} (${p.price})`).join('\n')

    res.format({
        'application/json': () => res.json(tours),
        'application/xml': () => res.type('application/xml').send(toursXml),
        'text/xml': () => res.type('text/xml').send(toursXml),
        'text/plain': () => res.type('text/plain').send(toursText)
    })
}

exports.toursPut = (req, res) => {
    const p = tours.find(p => p.id === parseInt(req.params.id))

    if (!p) return res.status(404).json({ error: 'No such tour exists' })

    if (req.body.name) p.name = req.body.name
    if (req.body.price) p.price = req.body.price

    res.json({ success: true })
}

exports.toursDelete = (req, res) => {
    const idx = tours.findIndex(tour => tour.id === parseInt(req.params.id))

    if (idx < 0) return res.json({ error: 'No such tour exists' })
    tours.splice(idx, 1)
    res.json({ success: true })
}

exports.newsletterSignup = (req, res) => {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}

exports.newsletterSignupProcess = (req, res) => {
    console.log('Form (from querystring):' + req.query.form)
    console.log('CSRF token (from hidden form field):' + req.body._csrf)
    console.log('Name (from visible form field):' + req.body.name)
    console.log('Email (from visible form field):' + req.body.email)
    console.log(303, '/newsletter-signup/thank-you')
    res.redirect(303, 'thank-you')
}

exports.newsletterSignupThankYou = (req, res) => {
    console.log('redirect to newsletter signup thank you page')
    res.render('newsletter-signup-thank-you')
}

exports.newsletter = (req, res) => {
    res.render('newsletter', { csrf: 'CSRF token goes here' })
}

exports.api = {
    newsletterSignup: (req, res) => {
        res.send({ result: 'success' })
    }
}