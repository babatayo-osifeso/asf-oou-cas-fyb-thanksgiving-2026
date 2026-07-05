const firebaseConfig = {
apiKey: "AIzaSyCXOmhYwZvHGoCUw5ISZkHJVgGSCa74DKY",
authDomain: "asf-guestbook.firebaseapp.com",
projectId: "asf-guestbook",
storageBucket: "asf-guestbook.firebasestorage.app",
messagingSenderId: "931111844841",
appId: "1:931111844841:web:f19b4c8c47ba5f85e7a978",
measurementId: "G-SG8BRZ9FC6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// ================= PERFORMANCE & SECURITY BUFFERED SCRIPT =================
document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("section");
const navLinksAll = document.querySelectorAll(".nav-link");

    const safeAddListener = (el, event, handler) => {
        if (el) el.addEventListener(event, handler);
    };

    safeAddListener(hamburger, "click", (e) => {
    e.stopPropagation();
    if (navLinks) navLinks.classList.toggle("show");
    if (hamburger) hamburger.classList.toggle("active");
});

    document.querySelectorAll(".nav-link").forEach(link => {
    safeAddListener(link, "click", () => {
        if (navLinks) navLinks.classList.remove("show");
        if (hamburger) hamburger.classList.remove("active");
    });
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


// ================= FIREBASE GUESTBOOK =================

const guestbookBtn = document.getElementById("submitGuestbook");

window.addMessage = async function () {
    const nameInput = document.getElementById("guestName");
    const messageInput = document.getElementById("guestMessage");

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        showToast("Please fill all fields");
        return;
    }

    guestbookBtn.disabled = true;

    try {
        await db.collection("guestbook").add({
            name,
            message,
            time: firebase.firestore.FieldValue.serverTimestamp()
        });

        nameInput.value = "";
        messageInput.value = "";

        showToast("Message sent successfully!");
    } catch (error) {
        console.error(error);
        showToast("Failed to send message");
    } finally {
        guestbookBtn.disabled = false;
    }
};



function loadGuestbook() {
    const container = document.getElementById("messages");

    if (!container) return;

    db.collection("guestbook")
        .orderBy("time", "desc")
        .onSnapshot((snapshot) => {

            container.innerHTML = "";

            snapshot.forEach((doc) => {
                const data = doc.data();

                // Skip invalid or incomplete documents
                if (!data.name || !data.message) return;

                const card = document.createElement("div");
                card.className = "message-card";

                const h4 = document.createElement("h4");
                h4.textContent = data.name;

                const p = document.createElement("p");
                p.textContent = data.message;

                card.appendChild(h4);
                card.appendChild(p);

                container.appendChild(card);
            });

        }, (error) => {
            console.error(error);
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
