const API = 'http://localhost:5050'


let form = document.getElementById('reg-auth')




const auth = async (e) => {
    e.preventDefault()
    let email = document.getElementById('email').value
    let pass = document.getElementById('pass').value
    let error = document.getElementById('error')


    let data = {
        email,
        pass
    }

    const req = await fetch(API + '/auth/sign-in', {
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    const res = await req.json()

    console.log(res)
    if(res.token){
        await localStorage.setItem('token', res.token);

        window.location.href = "../todo/todo.html"
        user.innerHTML=res.name

    }

    else{
        error.innerHTML=res.errors.errors[0].msg
        console.log(res)
    }


}
const redirect = () =>{
    let token = localStorage.getItem('token')
    console.log('asd', token)
    if(token){
        window.location.href = '../todo/todo.html'
    }

}
redirect()
form.addEventListener('submit',auth)




