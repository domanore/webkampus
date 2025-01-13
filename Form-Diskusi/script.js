function userDropdown() {
    const userdropdown = document.getElementById("userdropdownMenu");
    userdropdown.style.display = userdropdown.style.display === "none" ? "block" : "none";
}

// Optional: Close the dropdown if the user clicks outside of it
window.addEventListener("click", function (e) {
    const userdropdown = document.getElementById("userdropdownMenu");
    const userDiv = document.querySelector(".user");

    if (!userDiv.contains(e.target)) {
        userdropdown.style.display = "none";
    }
});
