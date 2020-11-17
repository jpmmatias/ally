/* dashboard mobile */
$(document).ready(() => {

    //active item menu
    $("#menu ul .item a");
    const currentLocation = location.href;
    const menuLength = $("#menu ul .item a").length;
    for (let i = 0; i < menuLength; i++) {
        if ($("#menu ul .item a")[i].href === currentLocation) {

            $("#menu ul li")[i].className = "item active";
        }
    }



    addResizeListeners();
    setSidenavListeners();
    setMenuClickListener();
    setSidenavCloseListener();


});

const sidenavEl = $('.sidenav');
const gridEl = $('.dashboard');
$('.menutoggle').hide()

function toggleClass(el, className) {
    if (el.hasClass(className)) {
        el.removeClass(className);
    } else {
        el.addClass(className);
    }
}


function setSidenavListeners() {
    const subHeadings = $('.navList__subheading');
    const SUBHEADING_OPEN_CLASS = 'navList__subheading--open';
    const SUBLIST_HIDDEN_CLASS = 'subList--hidden';

    subHeadings.each((i, subHeadingEl) => {
        $(subHeadingEl).on('click', (e) => {
            const subListEl = $(subHeadingEl).siblings();

            if (subHeadingEl) {
                toggleClass($(subHeadingEl), SUBHEADING_OPEN_CLASS);
                sidenavEl.css("display", "block").delay(800);
            }
        });
    });
}

function toggleClass(el, className) {
    if (el.hasClass(className)) {
        el.removeClass(className);
    } else {
        el.addClass(className);
    }
}

function addResizeListeners() {
    $(window).resize(function (e) {
        const width = window.innerWidth;
        sidenavEl.css("display", "none").delay(800);
        $('.menutoggle').show();
        if (width > 750) {

            sidenavEl.css("display", "block").delay(800);
            $('.menutoggle').hide();

        }
    });
}

function setMenuClickListener() {
    $('.menutoggle').on('click', function (e) {
        $('.menutoggle').attr('aria-expanded', 'true');
        sidenavEl.css("display", "block");

    });
}

function setSidenavCloseListener() {
    $('.close').on('click', function (e) {


        sidenavEl.css("display", "block");
        $('.menutoggle').attr('aria-expanded', 'false');
        sidenavEl.css("display", "none");
        $('.menutoggle').css("display", "block");
    });
}
