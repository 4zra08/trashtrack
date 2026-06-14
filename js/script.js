const baseUrl = "http://localhost:4001/";

if (!localStorage.getItem('currentUser')) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    
    const userDisplay = document.getElementById("userNameDisplay");
    const avatarDisplay = document.getElementById("userAvatarDisplay");
    const currentUserEmail = localStorage.getItem('currentUser');

    if (currentUserEmail) {
        fetch(`${baseUrl}users?email=${currentUserEmail}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                const realName = users[0].fullName;
                if (realName) {
                    if (userDisplay) userDisplay.textContent = realName;
                    if (avatarDisplay) {
                        const initials = realName.split(" ").map(f => f[0]).join("").toUpperCase();
                        avatarDisplay.textContent = initials.substring(0, 2);
                    }
                }
            }
        })
        .catch(err => console.error("Gabim te emri në index:", err));
    }

    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.style.position = 'relative';
        userProfile.style.cursor = 'pointer';

        const dropdownMenu = document.createElement('div');
        dropdownMenu.style.cssText = `
            position: absolute;
            top: 110%;
            right: 0;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 10px 14px;
            display: none;
            z-index: 1000;
            min-width: 130px;
        `;

        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.innerHTML = '<i class="fa-solid fa-right-from-bracket" style="margin-right: 8px;"></i>Logout';
        logoutLink.style.cssText = 'color: #ef4444; font-size: 14px; text-decoration: none; font-weight: 500; display: block; width: 100%; text-align: left;';
        
        dropdownMenu.appendChild(logoutLink);
        userProfile.appendChild(dropdownMenu);

        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            const isDisplayed = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isDisplayed ? 'none' : 'block';
        });

        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });

        document.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
        });
    }

    const form = document.getElementById("pickupForm");
    const pageTitle = document.querySelector(".page-title") || document.querySelector("h1");
    const submitBtn = form ? form.querySelector("button[type='submit']") : null;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');

    if (editId) {
        if (pageTitle) pageTitle.textContent = "Edit Pickup Request";
        if (submitBtn) submitBtn.textContent = "Save Changes";
        
        fetch(`${baseUrl}requests/${editId}`)
        .then(response => response.json())
        .then(item => {
            if (document.getElementById("requestId")) document.getElementById("requestId").value = item.requestId || "";
            if (document.getElementById("area")) document.getElementById("area").value = item.area || "";
            if (document.getElementById("trashType")) document.getElementById("trashType").value = item.trashType || "";
            if (document.getElementById("pickupDate")) document.getElementById("pickupDate").value = item.pickupDate || "";
            if (document.getElementById("assignedTo")) document.getElementById("assignedTo").value = item.assignedTo || "";
            if (document.getElementById("status")) document.getElementById("status").value = item.status || "";
            if (document.getElementById("binCount")) document.getElementById("binCount").value = item.binCount || "";
            if (document.getElementById("notes")) document.getElementById("notes").value = item.notes || "";
            
            if (document.getElementById("requestId")) document.getElementById("requestId").disabled = true;
        })
        .catch(err => console.error("Gabim gjatë marrjes së të dhënave:", err));
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const requestBody = {
                requestId: document.getElementById("requestId").value,
                area: document.getElementById("area").value,
                trashType: document.getElementById("trashType").value,
                pickupDate: document.getElementById("pickupDate").value,
                assignedTo: document.getElementById("assignedTo").value,
                status: document.getElementById("status").value,
                binCount: document.getElementById("binCount").value,
                notes: document.getElementById("notes").value
            };

            const urlTarget = editId ? `${baseUrl}requests/${editId}` : `${baseUrl}requests`;
            const methodTarget = editId ? "PUT" : "POST";

            fetch(urlTarget, {
                method: methodTarget,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            })
            .then(response => {
                if (response.ok) {
                    form.reset();
                    window.location.href = "request.html";
                }
            })
            .catch(err => console.error("Gabim:", err));
        });
    }

    const cancelBtn = document.getElementById("btnCancel");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "request.html";
        });
    }
});