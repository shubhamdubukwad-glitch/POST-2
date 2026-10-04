const cl = console.log;

const postForm = document.getElementById('postForm')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userID = document.getElementById('userID')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')
const postConatiner = document.getElementById('postConatiner')
const spinner=document.getElementById('spinner')

const BASE_URL = `https://shubham-92216-default-rtdb.asia-southeast1.firebasedatabase.app`;
const post_url = `${BASE_URL}/post.json`;


const state = {
    postArr: [],
    EDIT_ID: null,
}

function showspinner() {
    spinner.classList.remove('d-none')
}
function hidespinner() {
    spinner.classList.add('d-none')
}
function toggelspiner() {
    spinner.classList.toggle('d-none')
}

//templeting//

function templeting(arr) {
    showspinner()
    let result = ``;
    arr.forEach(ele => {
        result += `<div class="col-md-3 mt-5 mb-5" id="${ele.id}" >
            <div class="card h-100">
                <div class="card-header">
                    <h1>${ele.title}</h1>
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editpost(this)" type="button" class="btn btn-outline-success">EDIT</button>
                    <button onclick="deletepost(this)" type="button" class="btn btn-outline-danger">REMOVE</button>
                </div>
            </div>
        </div>`
    });
    postConatiner.innerHTML = result;
}

function fetchpost() {
    showspinner()
    fetch(post_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key;
                state.postArr.unshift(data[key])
            }
            templeting(state.postArr)
        })
        .catch(err=>{
            cl(err)
        })
        .finally(()=>{
            hidespinner()
        })
}
fetchpost()

//createpost//
function onaddpost(eve) {
    eve.preventDefault()
    let postObj = {
        title: title.value,
        body: body.value,
        userID: userID.value,
    }
    showspinner()
    fetch(post_url, {
        method: "POST",
        body: JSON.stringify(postObj),
        headers: {
            "content-type": "application/json",
            "Athorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            postObj.id = data.name;
            let col = document.createElement('div')
            col.className = `col-md-3 mt-5 mb-5`;
            col.id = postObj.id;
            col.innerHTML = ` <div class="card h-100">
                <div class="card-header">
                    <h1>${postObj.title}</h1>
                </div>
                <div class="card-body">
                    <p>${postObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editpost(this)" type="button" class="btn btn-outline-success">EDIT</button>
                    <button onclick="deletepost(this)" type="button" class="btn btn-outline-danger">REMOVE</button>
                </div>
            </div>`
            postConatiner.prepend(col)
            postForm.reset()
            Swal.fire({
                title: "POST ADDED SUCCESSFULLY!",
                text: "Your post crated has been successfully!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(()=>{
            hidespinner()
        })
}

//editpost//
function editpost(ele) {
    let edit_id = ele.closest('.col-md-3').id;
    showspinner()
    state.EDIT_ID = edit_id;
    let edit_url = `${BASE_URL}/post/${edit_id}.json`;

    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/josn",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            title.value = data.title;
            body.value = data.body,
                userID.value = data.userID,

                addPostBtn.classList.add('d-none');
            updatePostBtn.classList.remove('d-none');
        })
        .catch(err => {
            cl(err)
        })
        .finally(()=>{
            hidespinner()
        })
}

//uppdatepost//

function onupdatepost() {
    let updateId = state.EDIT_ID;
    let update_url = `${BASE_URL}/post/${updateId}.json`;
    let updateObj = {
        title: title.value,
        body: body.value,
        userID: userID.value
    }
    showspinner()
    fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(updateObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            let col = document.getElementById(updateId);
            col.innerHTML = ` <div class="card h-100">
                <div class="card-header">
                    <h1>${updateObj.title}</h1>
                </div>
                <div class="card-body">
                    <p>${updateObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editpost(this)" type="button" class="btn btn-outline-success">EDIT</button>
                    <button onclick="deletepost(this)" type="button" class="btn btn-outline-danger">REMOVE</button>
                </div>
            </div>`;

            addPostBtn.classList.remove('d-none');
            updatePostBtn.classList.add('d-none');
            postForm.reset()
            Swal.fire({
                title: "POST UPDATED SUCCESSFULLY!",
                text: "Your post updated has been successfully!",
                icon: "success",
                timer: 4000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(()=>{
            hidespinner()
        })
}
//deletepost//
function deletepost(ele) {
    let deleteid = ele.closest('.col-md-3').id;
    cl(deleteid)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showspinner()
            let delete_url = `${BASE_URL}/post/${deleteid}.json`;
            fetch(delete_url, {
                method: "DELETE",
                body: null,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "TOKEN JWT FROM LS"
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('somthing went wrong..?')
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = state.postArr.findIndex(p => p.id === deleteid)
                    state.postArr.splice(getIndex, 1);
                    ele.closest('.col-md-3').remove();

                    Swal.fire({
                        title: "Post Deleted successfully..!",
                        text: "Your post deleted has been deleted.",
                        icon: "success",
                        timer:4000
                    });
                })
                .catch(err => {
                    cl(err)
                })
                .finally(()=>{
                    hidespinner()
                })
        }
    });
}

postForm.addEventListener('submit', onaddpost);
updatePostBtn.addEventListener('click', onupdatepost)