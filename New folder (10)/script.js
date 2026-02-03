document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const reveals = document.querySelectorAll('.reveal');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Hero Canvas Animation ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const frameCount = 192;
    const images = [];
    const frameSequence = { frame: 0 };

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Preload images
    const currentFrame = index => (
        `hero_section_banground/frame_${index.toString().padStart(3, '0')}_delay-0.04${index % 2 === 0 ? '2' : '1'}s.png`
    );

    // Precise preloading
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                render(); // Start rendering once all loaded
            }
        };
        images.push(img);
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = images[frameSequence.frame];

        // Draw image covering the canvas (like object-fit: cover)
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        frameSequence.frame = (frameSequence.frame + 1) % frameCount;
        requestAnimationFrame(render);
    }

    // --- Intersection Observer for animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
