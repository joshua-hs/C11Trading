"use strict";

const localhostApiEndpoint = "http://localhost:8080/"

let userId;

//Login page
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredName = document.getElementById("name").value;
    let foundUser = false;

    axios.get(localhostApiEndpoint + "getUsers")
    .then(res => {
        const users = res.data;
        users.forEach(user => {
            if (user.name == enteredName) {
                foundUser = true;
                userId = user.id;
                localStorage.setItem("userId", userId)
                window.location.replace("http://127.0.0.1:5500/C11Trading/app.html");
            }
        })

        if (!foundUser) {
            createUser();
        }
    })

})

function createUser() {
    const enteredName = document.getElementById("name").value;
    let userCreationJson = {
        "name": enteredName,
        "availableCapital": 1000000
    }
    axios.post(localhostApiEndpoint + "createUser", userCreationJson)
    .then(res => {
        userId = res.data.id;
        localStorage.setItem("userId", userId)
        window.location.replace("http://127.0.0.1:5500/C11Trading/app.html");
    }).catch(err => console.log(err));
}