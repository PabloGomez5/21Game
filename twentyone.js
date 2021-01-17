let nickname_data ;
let round_data;
let current_streak_data;
let longest_streak_data;
let player_result;
let do_we_have_nickname = false;


const getCard = () => {
    if (game_over) {
        console.log("game over");
        return;
    }

    let player_div = document.getElementById("player_cards");
    let dealer_div = document.getElementById("dealer_cards");

    let player_promise = get_card(player_div);
    player_promise.then(
        function(result) {
            get_player_total(result, dealer_div);
        }
    ).catch(
        function(error) {
            console.log(error);
        }
    )
};

const set_data = (current_div, data) => {

    let current_cards = current_div.innerHTML;
    let next_card = data['next_card']
    const card_num = next_card[0];
    const card_suit = next_card[1];

    // PLAYER TIME
    if (current_div.id === "player_cards") {
        if (game_over === true){

        }else {
            if (player_stick_value === 2) {
                //He has already stick
                // has the dealer stick too?
                if (dealer_stick_value === 2) {
                    // yes so we compare results
                    //alert("both stick ");

                    if (dealer_total >= player_total) { //Yes
                        const dealer_msg = document.getElementById("dealer_message");
                        dealer_msg.innerHTML = `<div class="win">Dealer win! Dealer has ${dealer_total}</div>`;
                        const player_msg = document.getElementById("player_message");
                        player_msg.innerHTML = `<div class="lose">You lose! You have ${player_total}</div>`;
                        game_over = true;

                        //manage the result
                        player_lose();

                    } else { //No, so call a computer simple play
                        const dealer_msg = document.getElementById("dealer_message");
                        dealer_msg.innerHTML = `<div class="lose">Dealer lose! Dealer has ${dealer_total}</div>`;
                        const player_msg = document.getElementById("player_message");
                        player_msg.innerHTML = `<div class="win">You win! You have ${player_total}</div>`;
                        game_over = true;

                        //manege the result
                        player_win();

                    }
                }else{
                    //no so we dont do anything and let him play
                }
            } else {
                // Call a player simple play
                player_play(current_div, current_cards, card_num, card_suit);
            }
        }
    }

    // DEALER TIME
    if (current_div.id === "dealer_cards") {
        if (game_over === true){

        }else {
            if (dealer_stick_value === 2) {
                //Dealer has already stick
            } else {

                // Has the player stick?
                if (player_stick_value === 0) { //No
                    // Computer time : stick or play?
                    if (dealer_total > 16) { // Computer has +16 so stick
                        dealer_stick_value = 2;
                        const dealer_msg = document.getElementById("dealer_message");
                        dealer_msg.innerHTML = `<div class="win">Dealer sticks</div>`;
                    } else {  // Computer has -16 so call a computer simple play
                        dealer_play(current_div, current_cards, card_num, card_suit);
                    }
                } else { //Yes
                    // ¿ Do we have the same or more than the player?
                    if (dealer_total >= player_total) { //Yes
                        const dealer_msg = document.getElementById("dealer_message");
                        dealer_msg.innerHTML = `<div class="win">Dealer win! Dealer has ${dealer_total}</div>`;
                        const player_msg = document.getElementById("player_message");
                        player_msg.innerHTML = `<div class="lose">You lose! You have ${player_total}</div>`;
                        game_over = true;

                        //manage the result
                        player_lose();

                    } else { //No, so call a computer simple play
                        dealer_play(current_div, current_cards, card_num, card_suit);
                    }
                }
            }
        }
    }
}

const get_card = async(parent_div) => {
    const api_url = "http://localhost:8080/next_card";

    const response = await fetch(api_url);
    let data = await response.json();
    await set_data(parent_div, data);

}

const get_player_total = (result, dealer_div) => {
    console.log("check the total here");
    get_card(dealer_div);
}

const set_nickname = () => {

    // we get the nickname
    const nickname_element = document.getElementById("fname");
    let nickname = nickname_element.value;
    //alert(nickname);

    if (nickname === ""){

        do_we_have_nickname = false;

        // we tell him that he must enter a nickname
        const nickname_confirmation_msg = document.getElementById("player_nickname_confirmation");
        nickname_confirmation_msg.innerHTML = `<span >Please, Enter a nickname to play </span>`;

        // we make empty the streak data elements, in a way of hiding them.
        const round = document.getElementById("round");
        round.innerHTML = `<span ></span>`;
        const round_value = document.getElementById("round_value");
        round_value.innerHTML = `<span ></span>`;

        const current_streak = document.getElementById("current_streak");
        current_streak.innerHTML = `<span ></span>`;
        const current_streak_value = document.getElementById("current_streak_value");
        current_streak_value.innerHTML = `<span ></span>`;

        const longest_streak = document.getElementById("longest_streak");
        longest_streak.innerHTML = `<span ></span>`;
        const longest_streak_value = document.getElementById("longest_streak_value");
        longest_streak_value.innerHTML = `<span ></span>`;

    }else{

        do_we_have_nickname = true;
        nickname_data = nickname;
        const nickname_confirmation_msg = document.getElementById("player_nickname_confirmation");
        nickname_confirmation_msg.innerHTML = `<span >Now you are playing like : </span>`;

        const nickname_msg = document.getElementById("player_nickname");
        nickname_msg.innerHTML = `<span >[ ${nickname} ]</span>`;

        // HERE WE HAVE TO CHECK IF IT EXIST BEFORE

        // here we should call 2 methods like the get_data
        // set_nickname_db();     // saved into data base

        set_start_streak_values_html(); // show it in html front
    }
}

const new_game = () => {
    //alert("asi es como estaria el do we have nickname : " + do_we_have_nickname)
    if (do_we_have_nickname === false) {
        // we dont do anything, no player registered
    } else {

        // yes we have a nickname so we update the party data
        //alert("ha entrado en que si tenemos nickname");

        // always we says 1 more round, if not someone could cheat
        round_data++;

        //alert("ahora miramos como esta el resultado " + player_result)
        //we have to see who win and lose
        if (player_result === "win") {
            //alert("ha entrado en que ha ganado");
            current_streak_data++;

            if (longest_streak_data >= current_streak_data) {
                longest_streak_data = longest_streak_data;
            } else {
                longest_streak_data = current_streak_data;
            }
        } else if (player_result === "lose") { // player lose
            //alert("ha entrado en que ha perdido");

            if (longest_streak_data >= current_streak_data) {
                longest_streak_data = longest_streak_data;
                current_streak_data = 0;

            } else {
                longest_streak_data = current_streak_data;
                current_streak_data = 0;
            }
        } else { // if we dont have result we dont do anything
        }
        //alert("despues de la actualizacion los valores estan asi : ")
        //alert("LSD : "+ longest_streak_data);
        //alert("CSD : "+ current_streak_data);
        //alert("R : "+ round_data);

        // we update the html game information
        update_streak_values_html();
    }
        // create a new game in html
        newGame();
}

const set_start_streak_values_html = (nickname) => {

    // we set them the start values
    round_data = 1;
    current_streak_data = 0;
    longest_streak_data = 0;

    const round = document.getElementById("round");
    round.innerHTML = `<span >Round : </span>`;
    const round_value = document.getElementById("round_value");
    round_value.innerHTML = `<span >[ ${round_data} ]</span>`;

    const current_streak = document.getElementById("current_streak");
    current_streak.innerHTML = `<span >Current Stresk :</span>`;
    const current_streak_value = document.getElementById("current_streak_value");
    current_streak_value.innerHTML = `<span >[ ${current_streak_data} ]</span>`;

    const longest_streak = document.getElementById("longest_streak");
    longest_streak.innerHTML = `<span >Longest Streak</span>`;
    const longest_streak_value = document.getElementById("longest_streak_value");
    longest_streak_value.innerHTML = `<span >[ ${longest_streak_data} ]</span>`;

}

const update_streak_values_html = (nickname) => {

    const round = document.getElementById("round");
    round.innerHTML = `<span >Round : </span>`;
    const round_value = document.getElementById("round_value");
    round_value.innerHTML = `<span >[ ${round_data} ]</span>`;

    const current_streak = document.getElementById("current_streak");
    current_streak.innerHTML = `<span >Current Stresk :</span>`;
    const current_streak_value = document.getElementById("current_streak_value");
    current_streak_value.innerHTML = `<span >[ ${current_streak_data} ]</span>`;

    const longest_streak = document.getElementById("longest_streak");
    longest_streak.innerHTML = `<span >Longest Streak</span>`;
    const longest_streak_value = document.getElementById("longest_streak_value");
    longest_streak_value.innerHTML = `<span >[ ${longest_streak_data} ]</span>`;

}

const save_the_record = () => {

    // this method will make saving the current streak data from this player
    save_the_record_db(nickname_data,longest_streak_data);

    // get the from db and update them in server
    update_the_top_streaks_server();

}

const save_the_record_db = async(nickname,record) => {

    const api_url = "http://localhost:8080/set_new_record";

    let params = [];
    params.push(nickname,record);

    await fetch(api_url,{
        method: 'POST',
        body :
        JSON.stringify({
            params : params
        })
    });
}

const update_the_top_streaks_server = async() => {

    const api_url = "http://localhost:8080/update_top_scores";

    const response = await fetch(api_url);


}

// get the from db and update them in server
update_the_top_streaks_server();

const get_the_top_streaks = async() => {

    // gets the record from the data base
    // and update the html
    const api_url = "http://localhost:8080/get_top_scores";

    const response = await fetch(api_url);
    let data = await response.json();

    let streaks_array = data['streaks_array']

    const player_one = streaks_array[0];
    const record_one = streaks_array[1];
    const position0 = document.getElementById("position_one");
    position0.innerHTML = `<span> ${player_one} ${record_one} </span>`;

    const player_two = streaks_array[2];
    const record_two = streaks_array[3];
    const position1 = document.getElementById("position_two");
    position1.innerHTML = `<span> ${player_two} ${record_two} </span>`;

    const player_three = streaks_array[4];
    const record_three = streaks_array[5];
    const position2 = document.getElementById("position_three");
    position2.innerHTML = `<span> ${player_three} ${record_three} </span>`;

    const player_four = streaks_array[6];
    const record_four = streaks_array[7];
    const position3 = document.getElementById("position_four");
    position3.innerHTML = `<span> ${player_four} ${record_four} </span>`;

    const player_five = streaks_array[8];
    const record_five = streaks_array[9];
    const position4 = document.getElementById("position_five");
    position4.innerHTML = `<span> ${player_five} ${record_five} </span>`;

    const player_six = streaks_array[10];
    const record_six = streaks_array[11];
    const position5 = document.getElementById("position_six");
    position5.innerHTML = `<span> ${player_six} ${record_six} </span>`;

    const player_seven = streaks_array[12];
    const record_seven = streaks_array[13];
    const position6 = document.getElementById("position_seven");
    position6.innerHTML = `<span> ${player_seven} ${record_seven} </span>`;

    const player_eigth = streaks_array[14];
    const record_eigth = streaks_array[15];
    const position7 = document.getElementById("position_eigth");
    position7.innerHTML = `<span> ${player_eigth} ${record_eigth} </span>`;

    const player_nine = streaks_array[16];
    const record_nine = streaks_array[17];
    const position8 = document.getElementById("position_nine");
    position8.innerHTML = `<span> ${player_nine} ${record_nine} </span>`;

    const player_ten = streaks_array[18];
    const record_ten = streaks_array[19];
    const position9 = document.getElementById("position_ten");
    position9.innerHTML = `<span> ${player_ten} ${record_ten} </span>`;

}

