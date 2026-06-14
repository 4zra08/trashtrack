function handleRegister(event) {
    event.preventDefault();

    if (document.getElementById("regPassword").value !== document.getElementById("regConfirmPassword").value) {
        alert("Fjalëkalimet nuk përputhen!");
        return false;
    }

    const nameValue = document.getElementById("regName").value;
    const emailValue = document.getElementById("regEmail").value;
    const passwordValue = document.getElementById("regPassword").value;

    const newUser = {
        fullName: nameValue,
        email: emailValue,
        password: passwordValue
    };

    fetch('http://localhost:4001/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {
            const savedPickup = localStorage.getItem('temporaryPickup');
            
            if (savedPickup) {
                const pickupObject = JSON.parse(savedPickup);
                pickupObject.userEmail = emailValue; 

                return fetch('http://localhost:4001/requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pickupObject)
                });
            }
        } else {
            throw new Error("Diçka shkoi gabim me regjistrimin.");
        }
    })
    .then(pickupResponse => {
        console.log("Llogaria u krijua dhe emri i plotë u ruajt:", nameValue);
        
        localStorage.setItem('userFullName', nameValue); 
        localStorage.setItem('currentUser', emailValue);  
        
        localStorage.removeItem('temporaryPickup'); 
        
        // Ridrejtimi te faqja me tabelë (Request)
        window.location.href = "request.html"; 
    })
    .catch(error => {
        console.error("Gabim:", error);
        alert("Ndodhi një gabim gjatë procesit. Sigurohu që JSON Server është i ndezur.");
    });

    return false;
}