const express = require('express');
const port = 3001;
const cors = require('cors');

const jwtToken = require('jsonwebtoken');
const KEY_TOKEN = 'Jns21Asw4D2oAauD3eLHb523b13AnySD'

const app = express();

const data = [
    { id: 1, userName: 'lizander', user: 'admin' },
    { id: 21, userName: 'jorge gonz', user: 'jg' },
    { id: 13, userName: 'dani', user: 'superuser' },
    { id: 13, userName: 'chivi', user: 'superuser' },
]

app.use(express.json());
app.use(cors())


const verifyToken = (req, res, next) => {
    try {
        const getHeader = req.headers['authorization'].split(' ');
        const currentToken = getHeader[1]
        currentToken ?? res.status(400).json('---error no hay token')

        if (getHeader[0] == 'Bearer') {
            if (!!currentToken) {
                const { user } = jwtToken.verify(currentToken, KEY_TOKEN)
                req.params.userLogged = user;
                next()
            }
        }

    } catch (e) {
        res.status(400).json('---error autoriacion de token')
    }
}


app.get('/data/:id', verifyToken, (req, resp) => {
    console.log(req.params.userLogged)
    const currentUserLogged = req.params.userLogged;
    resp.status(200).json({ currentUserLogged, data });
})


app.post('/login/', (req, resp) => {
    const user = req.body.userLogin;
    const password = req.body.passLogin;


    if (user == 'admin' && password == '123123') {
        const currentToken = jwtToken.sign({ user }, KEY_TOKEN, { expiresIn: "2h" })
        // resp.sendStatus(200)
        resp.json({ user, currentToken })
        // resp.send('admin successfully logged in')
    } else {
        if (user == 'jg' && password == '123') {
            const currentToken = jwtToken.sign({ user }, KEY_TOKEN, { expiresIn: "2h" })
            resp.json({ user, currentToken })
            // resp.send('superuser  successfully logged in')
        } else {
            resp.status(400).send('error')
            console.log('se hizo un post')
        }
    }
    // resp.sendStatus(401)
})

app.post('/login/logout', (req, res) => {
    // jwtToken.destroy()
    res.json('try logout')
})

app.listen(port, () => {
    console.log(`backend en puerto ${port}`)
});