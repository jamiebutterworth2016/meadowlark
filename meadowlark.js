const express = require('express')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')
const weather = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'scripts')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(weather.weatherMiddleware)

const port = process.env.PORT || 3000

app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        }
    }
}))

app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.get('/', handlers.home)
app.get('/about', handlers.about)
app.get('/headers', handlers.headers)
app.get('/error', handlers.error)
app.get('/contact-error', handlers.contactError)
app.get('/thank-you', handlers.thankYou)

app.get('/api/tours', handlers.tours)
app.put('/api/tours/:id', handlers.toursPut)
app.delete('/api/tours/:id', handlers.toursDelete)

app.get('/newsletter', handlers.newsletter)
app.get('/newsletter-signup', handlers.newsletterSignup)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
app.post('/process-contact', handlers.processContact)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

app.use(handlers.notFound)
app.use(handlers.serverError)

if (require.main === module) {
    app.listen(port, () => console.log(
        `Express started on http://localhost:${port}; ` +
        `press Ctrl-C to terminate.`
    ))
} else {
    module.exports = app
}