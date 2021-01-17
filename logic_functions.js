const get_next_card = () => {
    //we got the cards and their type

    const card_values = [ "1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];
    const suits = [ "copas", "bastos", "espadas", "oros"];

    let card_value = card_values[Math.floor(Math.random() * card_values.length)];
    let card_suit = suits[Math.floor(Math.random() * suits.length)];

    return [card_value, card_suit];
};

module.exports = {get_next_card};
