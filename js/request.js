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
        .catch(err => console.error("Gabim te emri:", err));
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

    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const areaFilter = document.getElementById('areaFilter');
    const statusFilter = document.getElementById('statusFilter');
    const currentRowsCount = document.getElementById('currentRowsCount');

    const statTotal = document.getElementById('statTotal');
    const statPending = document.getElementById('statPending');
    const statCollected = document.getElementById('statCollected');
    const statOverflow = document.getElementById('statOverflow');

    const deleteModal = document.getElementById('deleteModal');
    const modalRequestId = document.getElementById('modalRequestId');
    const btnCancelDelete = document.getElementById('btnCancelDelete');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    
    let allRequests = [];
    let filteredRequests = [];
    let currentPage = 1;
    const rowsPerPage = 5; 
    let idToExecuteDelete = null; 

    function getStatusClass(status) {
        switch(status?.toLowerCase()) {
            case 'pending': return 'badge-pending';
            case 'completed': 
            case 'collected': return 'badge-collected';
            case 'in-progress': return 'badge-inprogress';
            case 'cancelled': return 'badge-cancelled';
            default: return '';
        }
    }

    function updateStatistics(data) {
        if (!statTotal) return;
        statTotal.textContent = data.length;
        statPending.textContent = data.filter(item => item.status?.toLowerCase() === 'pending').length;
        statCollected.textContent = data.filter(item => item.status?.toLowerCase() === 'completed' || item.status?.toLowerCase() === 'collected').length;
        statOverflow.textContent = data.filter(item => item.status?.toLowerCase() === 'in-progress').length;
    }

    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";
        
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:30px;">Nuk u gjet asnjë kërkesë.</td></tr>`;
            
            const paginationTextDiv = document.querySelector('.pagination-text');
            if (paginationTextDiv) {
                paginationTextDiv.innerHTML = `Showing <span id="currentRowsCount">0</span> of 0 requests`;
            }
            
            updateStatistics(allRequests);
            return;
        }

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedItems = data.slice(startIndex, endIndex);

        paginatedItems.forEach(item => {
            const row = document.createElement('tr');
            
            let displayStatus = item.status || "Pending";
            if(displayStatus === "in-progress") displayStatus = "In Progress";
            if(displayStatus === "completed") displayStatus = "Completed";
            if(displayStatus === "pending") displayStatus = "Pending";

            const idTarget = item.id; 
            const readableId = item.requestId ? `TR-${item.requestId}` : `TR-${item.id}`;

            row.innerHTML = `
                <td style="font-weight: 600;">${readableId}</td>
                <td style="text-transform: capitalize;">${item.area || 'N/A'}</td>
                <td style="text-transform: capitalize;">${item.trashType || 'N/A'}</td>
                <td>${item.pickupDate || 'N/A'}</td>
                <td><span class="badge-status ${getStatusClass(item.status)}">${displayStatus}</span></td>
                <td>${item.assignedTo === 'member1' ? 'Agon Krasniqi' : (item.assignedTo === 'member2' ? 'Blerta Gashi' : (item.assignedTo || 'Unassigned'))}</td>
                <td class="actions-cell">
                    <a href="#" class="view-act" onclick="event.preventDefault();">View</a>
                    <a href="#" class="edit-act" onclick="event.preventDefault(); window.location.href='index.html?editId=${idTarget}'">Edit</a>
                    <a href="#" class="del-act" onclick="event.preventDefault(); openDeleteModal('${idTarget}', '${readableId}')">Delete</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        const paginationTextDiv = document.querySelector('.pagination-text');
        if (paginationTextDiv) {
            paginationTextDiv.innerHTML = `Showing <span id="currentRowsCount">${paginatedItems.length}</span> of ${data.length} requests`;
        }

        updateStatistics(allRequests);
        updateActiveButtonVisuals();
    }

    function setupStaticPagination() {
        const pageButtons = document.querySelectorAll('.pagination-pages .page-click');
        
        pageButtons.forEach(btn => {
            const pageNumber = parseInt(btn.textContent.trim());
            
            if (!isNaN(pageNumber)) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = pageNumber; 
                    renderTable(filteredRequests); 
                });
            }
            
            if (btn.querySelector('.fa-chevron-left') || btn.textContent.trim() === '<') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                        currentPage--;
                        renderTable(filteredRequests);
                    }
                });
            }

            if (btn.querySelector('.fa-chevron-right') || btn.textContent.trim() === '>') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const maxPage = Math.ceil(filteredRequests.length / rowsPerPage);
                    if (currentPage < maxPage) {
                        currentPage++;
                        renderTable(filteredRequests);
                    }
                });
            }
        });
    }

    function updateActiveButtonVisuals() {
        const pageButtons = document.querySelectorAll('.pagination-pages .page-click');
        pageButtons.forEach(btn => {
            const pageNumber = parseInt(btn.textContent.trim());
            if (!isNaN(pageNumber)) {
                if (pageNumber === currentPage) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = '#4ade80'; 
                    btn.style.color = '#ffffff';
                } else {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }
            }
        });
    }

    window.openDeleteModal = function(serverId, printableId) {
        idToExecuteDelete = serverId; 
        if (modalRequestId) modalRequestId.textContent = printableId; 
        if (deleteModal) deleteModal.style.display = 'flex'; 
    }

    if (btnCancelDelete) {
        btnCancelDelete.addEventListener('click', () => {
            if (deleteModal) deleteModal.style.display = 'none';
            idToExecuteDelete = null;
        });
    }

    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener('click', () => {
            if (!idToExecuteDelete) return;

            fetch(`${baseUrl}requests/${idToExecuteDelete}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    if (deleteModal) deleteModal.style.display = 'none'; 
                    fetchRequestsFromServer(); 
                }
            })
            .catch(err => console.error("Gabim:", err));
        });
    }

    function fetchRequestsFromServer() {
        fetch(`${baseUrl}requests`)
        .then(response => response.json())
        .then(data => {
            allRequests = data;
            filteredRequests = data;
            renderTable(filteredRequests);
            setupStaticPagination(); 
        })
        .catch(err => console.error(err));
    }

    function filterData() {
        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        const areaValue = areaFilter ? areaFilter.value.toLowerCase() : "";
        const statusValue = statusFilter ? statusFilter.value.toLowerCase() : "";

        filteredRequests = allRequests.filter(item => {
            const idText = `tr-${item.requestId || item.id}`.toLowerCase();
            const areaText = (item.area || "").toLowerCase();
            const typeText = (item.trashType || "").toLowerCase();

            const matchesSearch = idText.includes(searchValue) || areaText.includes(searchValue) || typeText.includes(searchValue);
            const matchesArea = areaValue === "" || areaValue.includes("all") || areaText === areaValue;
            
            let dbStatus = (item.status || "").toLowerCase();
            let selectedFilterStatus = statusValue;
            if(selectedFilterStatus === "in progress") selectedFilterStatus = "in-progress";
            if(selectedFilterStatus === "collected") selectedFilterStatus = "completed";

            const matchesStatus = statusValue === "" || statusValue.includes("all") || dbStatus === selectedFilterStatus;

            return matchesSearch && matchesArea && matchesStatus;
        });

        currentPage = 1; 
        renderTable(filteredRequests);
    }

    if (searchInput) searchInput.addEventListener('input', filterData);
    if (areaFilter) areaFilter.addEventListener('change', filterData);
    if (statusFilter) statusFilter.addEventListener('change', filterData);

    const btnNewRequest = document.getElementById('btnNewRequest');
    if (btnNewRequest) {
        btnNewRequest.addEventListener('click', () => {
            window.location.href = "index.html"; 
        });
    }

    fetchRequestsFromServer();
});