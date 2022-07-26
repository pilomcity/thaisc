/*!/wp-content/themes/plant/js/main-vanilla.js*/
// Using event delegation https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/#web-performance
document.addEventListener(
  "click",
  function(event) {
    // Mobile Menu Toggle
    if (event.target.matches(".site-toggle")) {
      if (event.target.classList.contains("active")) {
        removeClass(".site-toggle, .site-nav-m", "active");
        removeClass("#page", "show-nav");
      } else {
        addClass(".site-toggle, .site-nav-m", "active");
        addClass("#page", "show-nav");
      }
    }
    if (event.target.matches("#site-nav-m .menu-item-has-children i")) {
      if (event.target.parentNode.classList.contains("active")) {
        event.target.parentNode.classList.remove("active");
      } else {
        event.target.parentNode.classList.add("active");
      }
    }
    // Close menu on click (useful for One Page Website)
    if (event.target.matches("#site-nav-m a")) {
      if (event.target.getAttribute("href") == "#") {
        if (event.target.parentNode.classList.contains("active")) {
          event.target.parentNode.classList.remove("active");
        } else {
          event.target.parentNode.classList.add("active");
        }
      } else {
        removeClass(".site-toggle, .site-nav-m", "active");
      }
    }
  },
  false
);

// Mobile Menu - Add Dropdown Toggle
document.querySelectorAll("#site-nav-m .menu-item-has-children").forEach(e => {
  e.insertAdjacentHTML("beforeend", '<i class="si-caret-down"></i>');
});

// Slider
var sliders = document.querySelectorAll(".s-slider");
if (sliders) {
  for (var i = 0, len = sliders.length; i < len; i++) {
    var slider = sliders[i];
    if (slider.classList.contains("-togrid")) {
      var flkty = new Flickity(slider, {
        cellAlign: "left",
        contain: true,
        wrapAround: true,
        imagesLoaded: true,
        dragThreshold: 3,
        watchCSS: true
      });
    } else {
      var flkty = new Flickity(slider, {
        cellAlign: "left",
        contain: true,
        wrapAround: true,
        imagesLoaded: true,
        dragThreshold: 3
      });
    }
  }
}
// Fix iOS13 flickity performance - https://gist.github.com/bakura10/b0647ef412eb7757fa6f0d2c74c1f145
(function() {
  let touchingCarousel = false,
    touchStartCoords;
  document.body.addEventListener("touchstart", function(e) {
    if (e.target.closest(".flickity-slider")) {
      touchingCarousel = true;
    } else {
      touchingCarousel = false;
      return;
    }
    touchStartCoords = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
  });
  document.body.addEventListener(
    "touchmove",
    function(e) {
      if (!(touchingCarousel && e.cancelable)) {
        return;
      }
      let moveVector = {
        x: e.touches[0].pageX - touchStartCoords.x,
        y: e.touches[0].pageY - touchStartCoords.y
      };
      if (Math.abs(moveVector.x) > 5) e.preventDefault();
    },
    { passive: false }
  );
})();

// Scroll and Show Site Header on Home Page
if (document.body.classList.contains("home")) {
  var header = document.querySelector("#masthead");
  var header_scroll = header.getAttribute("data-scroll");
  if (!header_scroll) {
    header_scroll = 300;
  }
  window.onscroll = function changeClass() {
    var scroll = window.pageYOffset | document.body.scrollTop;
    if (scroll > header_scroll) {
      addClass(".site-header", "-active");
      removeClass(".site-header", "-not-active");
    } else if (scroll <= 300) {
      addClass(".site-header", "-not-active");
      removeClass(".site-header", "-active");
    }
  };
}

// Auto Show Header on scroll - https://www.sysleaf.com/js-toggle-header-on-scroll/
var lastKnownScrollY = 0;
var currentScrollY = 0;
var ticking = false;
var idOfHeader = "masthead";
var eleHeader = null;
var height = 50;
const classes = {
  pinned: "-show",
  unpinned: "-hide"
};
function onScroll() {
  currentScrollY = window.pageYOffset;
  if (currentScrollY > height) {
    requestTick();
  }
}
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(update);
  }
  ticking = true;
}
function update() {
  if (currentScrollY < lastKnownScrollY) {
    pin();
  } else if (currentScrollY > lastKnownScrollY) {
    unpin();
  }
  lastKnownScrollY = currentScrollY;
  ticking = false;
}
function pin() {
  if (eleHeader.classList.contains(classes.unpinned)) {
    eleHeader.classList.remove(classes.unpinned);
    eleHeader.classList.add(classes.pinned);
  }
}
function unpin() {
  if (eleHeader.classList.contains(classes.pinned) || !eleHeader.classList.contains(classes.unpinned)) {
    eleHeader.classList.remove(classes.pinned);
    eleHeader.classList.add(classes.unpinned);
  }
}
window.onload = function() {
  eleHeader = document.getElementById(idOfHeader);
  if (eleHeader.classList.contains("-overlay")) {
    height = 0;
  } else {
    height = eleHeader.offsetHeight;
  }
  document.addEventListener("scroll", onScroll, false);
};