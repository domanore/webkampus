
function userDropdown() {
  const userdropdown = document.getElementById("userdropdownMenu");
  userdropdown.style.display = userdropdown.style.display === "none" ? "block" : "none";
}

window.addEventListener("click", function (e) {
  const userdropdown = document.getElementById("userdropdownMenu");
  const userDiv = document.querySelector(".user");

  if (!userDiv.contains(e.target)) {
      userdropdown.style.display = "none";
  }
});


function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('active');
  }
  
  document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.dropdown');
    const isClickInside = dropdown.contains(event.target);
  
    if (!isClickInside) {
      dropdown.classList.remove('active');
    }
  });

  const hide = () => {
  let keterangan = document.querySelector('.keterangan');
  let dropdown1 = document.querySelector('.dropdown-toggle');
  keterangan.style.display = 'block';
  dropdown1.innerText = '12 Maret 2024';
  const dropdown = document.querySelector('.dropdown');
  dropdown.classList.remove('active');
}