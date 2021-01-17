let player_total = 0;
let dealer_total = 0;
let game_over = false;
let player_stick_value = 0;
let dealer_stick_value = 0;


const player_win = () => {
    player_result = "win";
}

const player_lose = () => {
    player_result = "lose";
}

const player_play = ( current_div, current_cards, card_num,
                      card_suit) => {

    // Ask for one more card

    player_total += parseInt(card_num);
    console.log(player_total);

    //Check if player is out
    if (player_total > 21) {
        const dealer_msg = document.getElementById("dealer_message");
        dealer_msg.innerHTML = `<div class="win">Dealer win! Dealer has ${dealer_total}</div>`;
        const player_msg = document.getElementById("player_message");
        player_msg.innerHTML = `<div class="lose">You lose!, you got ${player_total}</div>`;
        game_over = true;

        // Manage the result
        player_lose();
    }

    let current_card_data = `<span class='card'>${card_num}<br/>de<br/>${card_suit}</span>`;
    current_cards += current_card_data;
    current_div.innerHTML = current_cards;

}

// when the computer plays ....
const dealer_play = ( current_div, current_cards, card_num,
                      card_suit) => {

    // Ask for one more card
    dealer_total += parseInt(card_num);
    console.log(dealer_total);

    // Check if computer is out
    if (dealer_total > 21) {
        const player_msg = document.getElementById("player_message");
        player_msg.innerHTML = `<div class="win">You win!, You have : ${player_total}</div>`;
        const dealer_msg = document.getElementById("dealer_message");
        dealer_msg.innerHTML = `<div class="lose">Dealer lose!, dealer has : ${dealer_total}</div>`;
        game_over = true;

        // Manage the result
        player_win();
    }

    let current_card_data = `<span class='card'>${card_num}<br/>de<br/>${card_suit}</span>`;
    current_cards += current_card_data;
    current_div.innerHTML = current_cards;
}

const playerSticks = () => {
    player_stick_value = 2;
    const player_msg = document.getElementById("player_message");
    player_msg.innerHTML = `<div class="win">Player sticks.</div>`;
}

const newGame = () => {
    player_total = 0;
    dealer_total = 0;
    game_over = false;
    player_stick_value = 0;
    dealer_stick_value = 0;

    document.getElementById("player_message").innerHTML = "";
    document.getElementById("dealer_message").innerHTML = "";

    document.getElementById("player_cards").innerHTML = "";
    document.getElementById("dealer_cards").innerHTML = "";


}