const container = document.getElementById('game-container');
const allNumbers = [];

// Create 20 numbers
for (let i = 0; i < 20; i++) {
    allNumbers.push(createNumber());
}

function createNumber() {
    const num = document.createElement('div');
    num.className = 'game-number';
    const val = Math.floor(Math.random() * 10);
    num.innerText = val;
    num.dataset.value = val; // Store the number value for checking
    
    let posX = Math.random() * window.innerWidth;
    let posY = Math.random() * window.innerHeight;
    let speed = 0.5 + Math.random() * 1.5;

    num.style.left = posX + 'px';
    num.style.top = posY + 'px';
    num.style.padding = "20px"; 
    container.appendChild(num);

    let isDragging = false;

    function animate() {
        if (!isDragging) {
            posY -= speed;
            if (posY < -50) posY = window.innerHeight + 50;
            num.style.top = posY + 'px';
        }
        requestAnimationFrame(animate);
    }
    animate();

    num.addEventListener('mousedown', (e) => {
        isDragging = true;
        num.style.zIndex = '1000';

        function moveAt(pageX, pageY) {
            posX = pageX - num.offsetWidth / 2;
            posY = pageY - num.offsetHeight / 2;
            num.style.left = posX + 'px';
            num.style.top = posY + 'px';

            // Every time we move, check if we hit another number
            checkCollision(num);
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
            isDragging = false;
            num.style.zIndex = '5';
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });

    num.ondragstart = () => false;
    return num;
}

function checkCollision(draggingNum) {
    const val1 = draggingNum.dataset.value;

    allNumbers.forEach(otherNum => {
        if (draggingNum === otherNum) return; // Don't check against self

        const val2 = otherNum.dataset.value;

        // Check if one is 6 and the other is 7
        if ((val1 == "6" && val2 == "7") || (val1 == "7" && val2 == "6")) {
            
            // Get positions
            const rect1 = draggingNum.getBoundingClientRect();
            const rect2 = otherNum.getBoundingClientRect();

            // Calculate distance between centers
            const dx = (rect1.left + rect1.width/2) - (rect2.left + rect2.width/2);
            const dy = (rect1.top + rect1.height/2) - (rect2.top + rect2.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If they are close enough (within 50 pixels)
            if (distance < 60) {
                triggerWow(rect1.left, rect1.top);
            }
        }
    });
}

function triggerWow(x, y) {
    // Prevent spamming 100 wows at once
    if (document.querySelector('.wow-effect')) return;

    const wow = document.createElement('div');
    wow.className = 'wow-effect';
    wow.innerText = '67';
    wow.style.left = x + 'px';
    wow.style.top = (y - 50) + 'px';
    
    document.body.appendChild(wow);

    // Remove from DOM after animation finishes
    setTimeout(() => {
        wow.remove();
    }, 800);
}