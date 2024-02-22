$(document).ready(function() {
    $("#tabs").tabs();

    let images = []; 
    let cards = []; 
    let flippedCards = [];
    let matchesFound = 0;
    let attempts = 0;
    let playerName = sessionStorage.getItem('playerName') || '';
    let playerHighScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
    let correctPercent = localStorage.getItem('correct') ? parseInt(localStorage.getItem('correct')) : 0;
    let numOfCards = sessionStorage.getItem('numOfCards') ? parseInt(sessionStorage.getItem('numOfCards')) : 48;

    preloadImages();
    initializeGame();

    $('#save_settings').click(function() {
        playerName = $('#player_name').val() || '';
        numOfCards = parseInt($('#num_cards').val()) || 48;
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('numOfCards', numOfCards);
        location.reload(); 
    });

    $('#new_game a').click(function(e) {
        e.preventDefault();
        initializeGame();
    });

    function preloadImages() {
        for (let i = 1; i <= 24; i++) {
            images.push(`images/card_${i}.png`);
        }
        images.push('images/back.png');
        images.push('images/blank.png');
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    function initializeGame() {
        attempts = 0;
        matchesFound = 0;
        updateUI();
        cards = generateCards(numOfCards);
        shuffleCards(cards);
        displayCards();
    }

    function generateCards(num) {
        let cardSet = [];
        for (let i = 1; i <= num / 2; i++) {
            let cardValue = i <= 24 ? i : i % 24;
            cardSet.push(cardValue, cardValue); 
        }
        return cardSet;
    }

    function shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayCards() {
        $('#cards').empty(); 
        cards.forEach((value, index) => {
            const cardElement = $(`<a href="#" class="card" id="card_${index}" data-value="${value}">
                <img src="images/back.png" alt="" draggable="false">
            </a>`);
            cardElement.click(function() { handleCardClick($(this), value); });
            $('#cards').append(cardElement);
        });
    }

    function handleCardClick(card, value) {
        if (flippedCards.length < 2 && !card.hasClass('flipped')) {
            card.find('img').attr('src', `images/card_${value}.png`);
            card.addClass('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                attempts++;
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
            setTimeout(() => {
                flippedCards.forEach(card => card.fadeOut(500, function() {
                    $(this).replaceWith('<img src="images/blank.png" class="matched">');
                }));
                matchesFound++;
                checkGameOver();
                flippedCards = [];
            }, 1000);
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.find('img').attr('src', 'images/back.png').end().removeClass('flipped');
                });
                flippedCards = [];
            }, 2000);
        }
    }

    function checkGameOver() {
        if (matchesFound * 2 === numOfCards) {
            let score = Math.round((matchesFound / attempts) * 100);
            alert(`Game Over! Your score: ${score}`);
            if (score > playerHighScore) {
                playerHighScore = score;
                localStorage.setItem('highScore', playerHighScore);
            }
            correctPercent = calculateCorrectPercent();
            initializeGame(); 
        }
    }

    function calculateCorrectPercent() {
        return attempts > 0 ? Math.round((matchesFound / attempts) * 100) : 0;
    }

    function updateUI() {
        $('#player').text(`Player: ${playerName}`);
        $('#high_score').text(`High Score: ${playerHighScore}`);
        $('#correct').text(`Correct: ${correctPercent}%`);
    }
});
