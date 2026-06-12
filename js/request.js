
        // Të dhënat nga tabela e imazhit tuaj
        const requestsData = [
            { id: "TR-1001", area: "Downtown", type: "General Waste", date: "Apr 12, 2026", status: "Pending", user: "Alex" },
            { id: "TR-1002", area: "Riverside", type: "Recyclables", date: "Apr 13, 2026", status: "Collected", user: "Mira" },
            { id: "TR-1003", area: "West End", type: "Organic", date: "Apr 13, 2026", status: "In Progress", user: "Leon" },
            { id: "TR-1004", area: "Green Park", type: "General Waste", date: "Apr 14, 2026", status: "Pending", user: "Alex" },
            { id: "TR-1005", area: "Old Town", type: "Bulk Waste", date: "Apr 14, 2026", status: "Cancelled", user: "Mira" }
        ];

        const tableBody = document.getElementById('tableBody');
        const searchInput = document.getElementById('searchInput');
        const areaFilter = document.getElementById('areaFilter');
        const statusFilter = document.getElementById('statusFilter');
        const currentRowsCount = document.getElementById('currentRowsCount');

        // Funksioni për të kthyer klasën e duhur të statusit
        function getStatusClass(status) {
            switch(status) {
                case 'Pending': return 'status-pending';
                case 'Collected': return 'status-collected';
                case 'In Progress': return 'status-inprogress';
                case 'Cancelled': return 'status-cancelled';
                default: return '';
            }
        }

        // Funksioni për të shfaqur tabelën në ekran
        function renderTable(data) {
            tableBody.innerHTML = "";
            
            if(data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:30px;">Nuk u gjet asnjë rezultat.</td></tr>`;
                currentRowsCount.textContent = 0;
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-weight: 600; color: #1e293b;">${item.id}</td>
                    <td>${item.area}</td>
                    <td>${item.type}</td>
                    <td>${item.date}</td>
                    <td><span class="badge-status ${getStatusClass(item.status)}">${item.status}</span></td>
                    <td>${item.user}</td>
                    <td class="actions-links">
                        <a href="#" class="action-view" onclick="alert('Duke parë: ${item.id}')">View</a>
                        <a href="#" class="action-edit" onclick="alert('Duke modifikuar: ${item.id}')">Edit</a>
                        <a href="#" class="action-delete" onclick="alert('Duke fshirë: ${item.id}')">Delete</a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            currentRowsCount.textContent = data.length;
        }

        // Funksioni i filtrimit të të dhënave (Search & Select dropdowns)
        function filterData() {
            const searchValue = searchInput.value.toLowerCase();
            const areaValue = areaFilter.value;
            const statusValue = statusFilter.value;

            const filtered = requestsData.filter(item => {
                const matchesSearch = item.id.toLowerCase().includes(searchValue) || 
                                      item.area.toLowerCase().includes(searchValue) || 
                                      item.user.toLowerCase().includes(searchValue);
                const matchesArea = areaValue === "" || item.area === areaValue;
                const matchesStatus = statusValue === "" || item.status === statusValue;

                return matchesSearch && matchesArea && matchesStatus;
            });

            renderTable(filtered);
        }

        // Event Listeners për ndryshimet
        searchInput.addEventListener('input', filterData);
        areaFilter.addEventListener('change', filterData);
        statusFilter.addEventListener('change', filterData);

        // Event listener i thjeshtë për butonin New Request
        document.getElementById('btnNewRequest').addEventListener('click', () => {
            alert('Butoni "New Request" u klikua! Këtu mund të hapet një Formë.');
        });

        // Shfaqja fillestare e tabelës gjatë ngarkimit të faqes
        renderTable(requestsData);
    