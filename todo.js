// const user1 = document.getElementById('user')
// user1.innerText = localStorage.getItem('name')

const redirect = () => {
    const token = localStorage.getItem('token')
    console.log(token)
    if (token === null) {
        window.location.href = '../auth/auth.html'
    }
}
redirect()


const API = 'http://localhost:5050'


// const getName = async ()=>{
//     const res = await fetch(API + '/auth/sign-in',
//         {
//             headers: {
//                 "x-access-token": localStorage.getItem('token'),
//                 'Content-Type': 'application/json'
//             },
//         })
//
//     const req = await res.json()
//     console.log(req)
//
// }
// getName()


const getName = async ()=>{
    const req = await fetch(API + '/get-user-name', {
        headers: {
            "x-access-token": localStorage.getItem('token'),
            "Content-Type": "application/json; charset=utf-8"
        },
        method: 'GET',
    })
    const res = await req.json()
    console.log(res)
    const name = document.getElementById('user')
    name.textContent=res.name
}
getName()

const createTodo = async (e) => {

    e.preventDefault()
    const name = document.getElementById('name').value
    const description = document.getElementById('description').value


    const data = {
        title: name,
        description: description
    }
    console.log(data)

    const res = await fetch(API + '/create-todo', {
        headers: {
            "x-access-token": localStorage.getItem('token'),
            'Content-Type': 'application/json'

        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    const req = await res.json()

    await getAllTodos()
    document.getElementById('name').value = ''
    document.getElementById('description').value = ''
    alert(req.success.message)


}

const getAllTodos = async () => {
    const res = await fetch(API + '/get-all-todo',
        {
            headers: {
                "x-access-token": localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })

    const req = await res.json()
    console.log(req)
    renderTodo(req)
}

getAllTodos()


let idEdit = []
const modal = document.querySelector('.container-modal')
const renderTodo = (arr) => {
    const output = document.getElementById('output')
    output.innerHTML = ''
    arr.reverse().map((el, index) => {
        console.log(el)
        const outputBox = document.createElement('div')
        outputBox.className = 'output-box'
        const col8 = document.createElement('div')
        col8.className = 'col-8'
        const col4 = document.createElement('div')
        col4.className = 'col-4'
        const nameRender = document.createElement('p')
        const descriptionRender = document.createElement('p')
        const deleteTodo = document.createElement('button')
        deleteTodo.innerText = 'Delete'
        const edit = document.createElement('button')
        edit.innerText = 'Edit'
        const done = document.createElement('button')
        done.innerText = 'Done'
        output.append(outputBox)
        outputBox.append(col8, col4)
        col8.append(nameRender, descriptionRender)
        col4.append(deleteTodo, edit, done)
        nameRender.innerHTML = `<p><span>Name: </span>${el.title}</p>`
        descriptionRender.innerHTML = `<p><span>Description: </span>${el.description}</p>`

        if (el.status === true) {
            outputBox.style.background = 'gray'
            const allDone = document.createElement('p')
            allDone.className = 'todo-done'
            allDone.innerText = 'Todo is completed!!!'
            col8.append(allDone)
        }

        deleteTodo.addEventListener('click', async () => {
            await deleteFunc(el._id)
        })

        done.addEventListener('click', async () => {
            await doneFunc(el._id, el.status, col8, outputBox)
        })


        edit.addEventListener('click', async () => {
            await modal_id(el._id)

        })

    })
}
console.log(idEdit)


const submitEdit = document.getElementById('reg-auth')
submitEdit.addEventListener('submit', async (e) => {
    e.preventDefault()
    await editTodo()
    await getAllTodos()
    modal.style.display = 'none'
})

const modal_id = async (id) => {
    modal.style.display = 'flex'
    if (idEdit.length === 1) {
        idEdit.splice(-1)
    }
    idEdit.push(id)

    const close = document.querySelector('.close')
    close.addEventListener('click', () => {
        modal.style.display = 'none'
    })

}

const doneFunc = async (id, status, col8, outputBox) => {
    const res = await fetch(API + `/done/${id}`,
        {
            headers: {
                "x-access-token": localStorage.getItem('token'),
                'Content-Type': 'application/json'

            },
            method: 'POST'
        })

    const req = await res.json()
    alert(req.message)
    if (status === false) {
        outputBox.style.background = 'gray'
        const allDone = document.createElement('p')
        allDone.className = 'todo-done'
        allDone.innerText = 'Todo is completed!!!'
        col8.append(allDone)
    }
}


const deleteFunc = async (id) => {
    const res = await fetch(API + `/delete-todo/${id}`,

        {
            headers: {
                "x-access-token": localStorage.getItem('token'),
                'Content-Type': 'application/json'

            },
            method: 'DELETE'
        }
    )
    const req = await res.json()
    alert(req.message)
    await getAllTodos()
}

const editTodo = async () => {
    const name = document.getElementById('edit-name').value
    const description = document.getElementById('edit-description').value

    const data = {
        title: name,
        description: description
    }

    const res = await fetch(API + `/update-todo/${idEdit[0]}`, {
        headers: {
            "x-access-token": localStorage.getItem('token'),
            'Content-Type': 'application/json'

        },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
    const req = await res.json()
    alert(req.message)

}


const log_out = document.getElementById('log_out')
log_out.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = "../auth/auth.html"

})

