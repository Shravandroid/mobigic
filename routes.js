


module.exports = function (app) {
    app.use('/',  require('./controller/home'))
    app.use('/users',  require('./controller/user'))
    app.use('/login',  require('./controller/login'))
}