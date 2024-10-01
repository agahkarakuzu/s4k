$.extend($.easing, {
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function ($) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    function getResponsiveOffset() {
        var width = $(window).width();
        if (width > 1024) {
            return 170;  // Desktop offset
        } else if (width > 768) {
            return 120;  // Tablet offset
        } else {
            return 70;   // Mobile offset
        }
    }

    $.fn.navScroller = function (options) {
        settings = $.extend({
            scrollToOffset: getResponsiveOffset(),
            scrollSpeed: 800,
            activateParentNode: true,
        }, options);
        navItems = this;

        // Attach click listener (no touchstart, using click is enough)
        navItems.on('click', function (event) {
            event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); // Recalculate section positions
            $('html,body').animate({
                scrollTop: sections[navID] - settings.scrollToOffset
            }, settings.scrollSpeed, "easeInOutExpo", function () {
                disableScrollFn = false;
            });
        });

        // Populate lookup of clickable elements and destination sections
        populateDestinations();

        // Setup scroll listener
        $(document).scroll(function () {
            if (disableScrollFn) { return; }
            var pos = $(this).scrollTop();
            var pageHeight = $(window).height();
            for (var i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + pageHeight) {
                    activateNav(i);
                }
            }
        });

        // Recalculate offsets on window resize
        $(window).resize(function () {
            settings.scrollToOffset = getResponsiveOffset();
            populateDestinations();
        });
    };

    function populateDestinations() {
        navItems.each(function () {
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode) ? this.parentNode : this;

            var element = document.getElementById(scrollID);
            if (element) { // Check if the element exists
                sections[scrollID] = $(element).offset().top;
            } else {
                console.warn(`Element with ID ${scrollID} not found.`);
            }
        });
    }

    function activateNav(navID) {
        for (var nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
    }

})(jQuery);

$(document).ready(function () {

    // Initialize side navigation for mobile
    $(".button-collapse").sideNav();

    // Initialize navScroller for smooth scrolling in nav items
    $('nav li a').navScroller();

    // Section divider icon click scrolls to the section
    $(".sectiondivider").on('click', function (event) {
        $('html,body').animate({ scrollTop: $(event.target.parentNode).offset().top - 50 }, 400, "linear");
    });

    // Links going to other sections smoothly scroll
    $(".container a").each(function () {
        if ($(this).attr("href").charAt(0) == '#') {
            $(this).on('click', function (event) {
                event.preventDefault();
                var target = $(this).attr("href");
                var targetHeight = $(target).offset().top;
                $('html,body').animate({ scrollTop: targetHeight - 170 }, 800, "easeInOutExpo");
            });
        }
    });

    // Initialize carousel with Slick settings
    $('.partners').slick({
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        arrows: true,
        dots: true,
        responsive: [
            {
                breakpoint: 976,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 6
                }
            }
        ]
    });

    // Call Gridder
    $('.gridder').gridderExpander({
        scroll: true,
        scrollOffset: 60,
        scrollTo: "panel",
        animationSpeed: 400,
        animationEasing: "easeInOutExpo",
        showNav: true,
        nextText: "<i class=\"fa fa-arrow-right\"></i>",
        prevText: "<i class=\"fa fa-arrow-left\"></i>",
        closeText: "<i class=\"fa fa-times\"></i>",
        onStart: function () {
            console.log("Gridder Initialized");
        },
        onContent: function () {
            console.log("Gridder Content Loaded");
        },
        onClosed: function () {
            console.log("Gridder Closed");
        }
    });

});
