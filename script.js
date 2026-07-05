// ================= PERFORMANCE & SECURITY BUFFERED SCRIPT =================
document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    const safeAddListener = (el, event, handler) => {
        if (el) el.addEventListener(event, handler);
    };

    safeAddListener(hamburger, "click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("show");
        hamburger.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
            hamburger.classList.remove("active");
        });
    });

    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove("show");
            hamburger.classList.remove("active");
        }
    });



    // Mobile Menu: Close when clicking outside
    document.addEventListener("click", (e) => {
    if (!navLinks || !hamburger) return;

    const clickedInsideMenu = navLinks.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (!clickedInsideMenu && !clickedHamburger) {
        navLinks.classList.remove("show");
        hamburger.classList.remove("active");
    }
});

    // Consolidated High-Performance Scroll Loop
    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;

        // Navbar styling
        if (navbar) {
            navbar.classList.toggle("scrolled", scrollPos > 50);
        }

        // Back to top visibility
        if (backToTop) {
            backToTop.style.display = scrollPos > 400 ? "block" : "none";
        }

        // Track active navigation link
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollPos >= sectionTop) {
                current = section.getAttribute("id") || "";
            }
        });

        navLinksAll.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    }, { passive: true }); // passive: true improves touch/scroll responsiveness

    // Back to top click handler
    safeAddListener(backToTop, "click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // ================= MODERN INTERSECTION OBSERVER =================
    // Fixes performance for scroll reveals AND ensures counters trigger only when visible
    const revealElements = document.querySelectorAll(".reveal");
    const counters = document.querySelectorAll(".counter");

    const observerOptions = {
        root: null,
        threshold: 0.1, // Trigger when 10% of element is visible
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Handle Scroll Reveal
            if (entry.target.classList.contains("reveal")) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }

            // Handle Animated Counter
            if (entry.target.classList.contains("counter")) {
                const counter = entry.target;
                const target = +counter.getAttribute("data-target") || 0;
                let current = 0;
                const increment = Math.ceil(target / 100) || 1;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = current;
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => elementObserver.observe(el));
    counters.forEach(counter => elementObserver.observe(counter));


    // ================= SECURITY-SAFE GUESTBOOK =================
    const guestbookBtn = document.getElementById("submitGuestbook"); // Add id="submitGuestbook" to your HTML button
    
    window.addMessage = function () {
    const nameInput = document.getElementById("guestName");
    const messageInput = document.getElementById("guestMessage");
    const container = document.getElementById("messages");

    if (!nameInput || !messageInput || !container) return;

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        showToast("Please fill all fields");
        return;
    }

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem("guestbook")) || [];

    messages.unshift({
        name,
        message
    });

    localStorage.setItem("guestbook", JSON.stringify(messages));

   

// Clear inputs
nameInput.value = "";
messageInput.value = "";

// Reload messages from localStorage
loadGuestbook();

// Success notification
showToast("Message added 🎉");
};

// Support both inline onclick and button event listener
safeAddListener(guestbookBtn, "click", window.addMessage);
function loadGuestbook() {
    const container = document.getElementById("messages");

    if (!container) return;

    container.innerHTML = "";

    const messages = JSON.parse(localStorage.getItem("guestbook")) || [];

    messages.forEach((item) => {
        const card = document.createElement("div");
        card.className = "message-card";

        const h4 = document.createElement("h4");
        h4.textContent = item.name;

        const p = document.createElement("p");
        p.textContent = item.message;

        card.appendChild(h4);
        card.appendChild(p);

        container.appendChild(card);
    });
}

loadGuestbook();

    // ================= GALLERY LIGHTBOX (WITH TOUCH) =================
    const images = document.querySelectorAll(".gallery-img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox .close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        lightbox.style.display = "flex";
        lightboxImg.src = images[currentIndex].src;
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => openLightbox(index));
    });

    safeAddListener(closeBtn, "click", () => {
        if (lightbox) lightbox.style.display = "none";
    });

    const showNextImg = () => {
        if (!lightboxImg || !images.length) return;
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex].src;
    };

    const showPrevImg = () => {
        if (!lightboxImg || !images.length) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
    };

    safeAddListener(nextBtn, "click", showNextImg);
    safeAddListener(prevBtn, "click", showPrevImg);

    // Close lightbox clicking on backdrop
    safeAddListener(lightbox, "click", (e) => {
        if (e.target === lightbox) lightbox.style.display = "none";
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
        if (lightbox && lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") showNextImg();
            if (e.key === "ArrowLeft") showPrevImg();
            if (e.key === "Escape") lightbox.style.display = "none";
        }
    });

    // Touch Support for Mobile Swiping
    safeAddListener(lightbox, "touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    safeAddListener(lightbox, "touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50; // Minimum distance in px to recognize swipe
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0) {
                showNextImg(); // Swipe Left -> Next
            } else {
                showPrevImg(); // Swipe Right -> Prev
            }
        }
    }

    // ================= TOAST & UTILITIES =================
    window.copyText = function(id) {
        const el = document.getElementById(id);
        if (!el) return;
        
        navigator.clipboard.writeText(el.innerText).then(() => {
            showToast("Copied!");
        }).catch(() => {
            showToast("Failed to copy");
        });
    };

    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.innerText = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }
});

// ================= SMOOTH PRELOADER TRANSITION =================
// Handled outside DOMContentLoaded window frame to hide immediately when assets finish loading
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.transition = "opacity 0.4s ease, visibility 0.4s ease";
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        setTimeout(() => {
            loader.style.display = "none";
        }, 400);
    }
});
