const {Router} = require('express')
const Auth = require('../models/Auth')
const Todo = require('../models/Todo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require("express-validator")
const verify = require('../middleware/verify')
let router = Router()

router
    .get('/', async (req, res) => {
        res.status(200).send('NodeJS success')
    })
    .post('/auth/reg', [
        check('name', "Имя пользователя не может быть пустым").notEmpty(),
        check('email', "Введите корректный email").isEmail(),
        check('pass', "Пароль должен быть больше 8 и меньше 10 символов").isLength({min: 4, max: 10}),
        check("pass", "любой символ, одна заглавная буква и цифра").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    ], async (req, res) => {

        try {
            // console.log(req.body)
            const {name, email, pass} = req.body
            // const name = req.body.name
            // const email = req.body.email
            // const pass = req.body.pass
            console.log(pass)
            if (!(email && pass && name)) {
                res.status(400).send('Enter all input')
            }
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            password = await bcrypt.hash(pass, 10)
            user = await Auth.create({
                name,
                email,
                hash_pass: password
            })

            const token = jwt.sign(
                {
                    user_id: user._id, email
                }, 'Rest'
            )
            user.token = token
            res.status(201).json(user)
        } catch (err) {
            console.log(err)
        }

    })
    .post('/auth/sign-in', [
        check('email', "Введите корректный email").isEmail(),
        check('pass', "Пароль должен быть больше 8 и меньше 10 символов").isLength({min: 4, max: 10}),
        check("pass", "любой символ, одна заглавная буква и цифра").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    ], async (req, res) => {
            console.log(req.body)
        try {
            const {email, pass,name} = req.body
            console.log(req.body)
            if (!(email && pass)) {
                res.status(400).send('Enter all input')
            }
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const user = await Auth.findOne({email})
            console.log(user)

            console.log(user)
            if (user && (await bcrypt.compare(pass, user.hash_pass))) {// почитать про hash_pass
                const token = jwt.sign(
                    {
                        user_id: user._id, email
                    }, 'Rest'
                );
                user.token = token
                res.status(200).send(user)
            } else {
                res.status(400).send('Invalid credentials')
            }
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    })
    .get('/get-user-name',verify,async(req,res)=>{
        const user = await Auth.findById(req.user.user_id)
        console.log(user.name)
        if(user){
            res.status(200).send({name:user.name})
        }else{
            res.status(400).send("We can't get a name")
        }

    })
    .get('/home', verify, async (req, res) => {
        res.status(200).json(req.user)
    })
    .post('/create-todo', verify, async (req, res) => {
        const todo = {
            title: req.body.title,
            description: req.body.description,
            user_id: req.user.user_id
        }
        console.log(todo)
        let new_todo = new Todo(todo)
        new_todo.save()
        res.status(201).send({
            success: {
                message: 'Todo has been added successfully'
            }
        })
    })
    .get('/get-all-todo', verify, async (req, res) => {
        const todos = await Todo.find({user_id: req.user.user_id})
        // console.log(todos)
        const arr = JSON.parse(JSON.stringify(todos))
        arr.map(el => delete el.user_id)
        // console.log(arr)
        res.send(arr)
    })
    .post('/done/:id', verify, async (req, res) => {
        let todo_id = req.params.id
        let todo = await Todo.findById(todo_id)
        if (todo.user_id == req.user.user_id) {
            console.log(todo.user_id)
            todo.status = true
            await todo.save()
            res.status(201).send({
                message: 'todo completed'
            })
        } else {
            res.status(403).send({
                message: 'error'
            })
        }
    })

    .patch('/update-todo/:id', verify, async (req, res) => {
        let todo_id = req.params.id
        let todo = await Todo.findById(todo_id)
        if (todo.user_id == req.user.user_id) {
            console.log(todo.user_id)
            let data = req.body
            todo.title = data.title
            todo.description = data.description
            await todo.save()
            res.status(201).send({
                message: 'Todo updated'
            })
        } else {
            res.status(403).send({
                message: 'Error'
            })
        }
    })


    .delete('/delete-todo/:id', verify, async (req, res) => {
        let todo_id = req.params.id
        let todo = await Todo.findById(todo_id)
        if (todo.user_id == req.user.user_id) {
            console.log(todo.user_id)
            await Todo.findByIdAndDelete(todo_id)
            res.status(201).send({
                message: 'Todo deleted'
            })
        } else {
            res.status(403).send({
                message: 'Something wrong'
            })
        }
    })


module.exports = router

// валидация express-validator мин 8 символов , любой символ, одна заглавная буква и цифра