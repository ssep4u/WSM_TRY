// toggle(show/hide) menu
const toggleMenu = () => {
    const toggleDiv = document.getElementById("nav_toggle");
    const navListUl = document.getElementsByClassName("nav-list")[0];
    const toggleI = toggleDiv.getElementsByTagName("i")[0];

    toggleDiv.onclick = () => {
        // class에 show-menu를 붙이거나/떼자
        navListUl.classList.toggle("show-menu");

        // toggleIcon 바꾸자: bi-list <-> bi-x-lg
        toggleI.classList.toggle("bi-list");
        toggleI.classList.toggle("bi-x-lg");
    };
}
toggleMenu();