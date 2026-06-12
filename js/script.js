const baseUrl ="http://localhost:5001/";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pickupForm");
    const cancelBtn = document.getElementById("btnCancel");

    // Ngjarja kur dërgohet forma (Save Request)
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Ndalon rifreskimin e faqes

        // Marrja e vlerave nga fushat e formës
        const requestData = {
            requestId: document.getElementById("requestId").value,
            area: document.getElementById("area").value,
            trashType: document.getElementById("trashType").value,
            pickupDate: document.getElementById("pickupDate").value,
            assignedTo: document.getElementById("assignedTo").value,
            status: document.getElementById("status").value,
            binCount: document.getElementById("binCount").value,
            notes: document.getElementById("notes").value
        };

        // Këtu mund t'i shfaqësh në console ose t'i dërgosh në një server
        console.log("Kërkesa u ruajt me sukses:", requestData);
        
        alert(`Kërkesa ${requestData.requestId} u krijua me sukses!`);
        
        form.reset(); // Pastron formën pas ruajtjes
    });

    // Ngjarja për butonin Cancel
    cancelBtn.addEventListener("click", () => {
        if (confirm("A jeni i sigurt që dëshironi të anuloni plotësimin?")) {
            form.reset();
        }
    });
});