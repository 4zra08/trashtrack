function handleLogin(event) {
    event.preventDefault();
    
    const emailValue = document.getElementById("loginEmail").value;
    const passwordValue = document.getElementById("loginPassword").value;

    fetch(`http://localhost:4001/users?email=${emailValue}`)
    .then(response => response.json())
    .then(users => {
        if (users.length === 0) {
            alert("Ky email nuk është i regjistruar!");
            return;
        }

        const user = users[0];

        if (user.password === passwordValue) {
            localStorage.setItem('currentUser', emailValue);
            
            window.location.href = "request.html";
        } else {
            alert("Fjalëkalimi është i pasaktë!");
        }
    })
    .catch(error => {
        console.error("Gabim:", error);
        alert("Sigurohu që JSON Server është i ndezur!");
    });

    return false;
}