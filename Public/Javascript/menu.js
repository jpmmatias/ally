let show = true;
const menuSection = document.querySelector(".menu-section")
const menuToggle = menuSection.querySelector(".menu-toggle")

menuToggle.addEventListener("click", () => {

    document.body.style.overflow = show ? "hidden" : "initial"

    menuSection.classList.toggle("on", show);

    show = !show;

    menuToggle.setAttribute('aria-expanded', function (i, attr) {
        return attr == 'false' ? 'true' : 'false'
    });

})