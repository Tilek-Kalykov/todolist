const API = 'http://localhost:5050'


let form = document.getElementById('reg-form')
let error = document.getElementById('error')

const registration = async (e) => {

    e.preventDefault()
    let name = document.getElementById('username').value
    let email = document.getElementById('email').value
    let pass = document.getElementById('pass').value


    let data = {
        name,
        email,
        pass
    }

    const req = await fetch(API + '/auth/reg', {

        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        method: 'POST',
        body: JSON.stringify(data)
    })


        const res = await req.json()

        // console.log(res.token)
        if(res.token){
            await localStorage.setItem('token', res.token);
            await localStorage.setItem('name', res.name);
            window.location.href = "../todo/todo.html";
        }else{
            error.innerHTML=res.errors.errors[0].msg
            console.log(res)
        }



}
const redirect = () =>{
    let token = localStorage.getItem('token')
    // console.log('asd', token)
    if(token){
        window.location.href = '../todo/todo.html'
    }

}
redirect()
form.addEventListener('submit',registration)




