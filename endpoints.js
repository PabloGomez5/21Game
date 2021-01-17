const logic_functions = require("./logic_functions");
const database_controller = require("./database_controller")

const get_top_scores = async(request, response) => {
    let streaks_array = database_controller.get_top_streaks_array();
    console.log("this is what i get in endpoints : ");
    console.log(streaks_array);
    //const scores = { player_one : "pablo" , record_one : 5}
    response.send(
        "200",
        { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },

        JSON.stringify({
            streaks_array : streaks_array
        })

    );
};

const update_scores_from_db = (request, response) => {
    database_controller.update_top_scores();
    response.send(
        "200",
        { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        JSON.stringify({
        })
    );
};

const next_card = (request, response) => {
    let next_card = logic_functions.get_next_card();
    response.send(
        "200",
        { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        JSON.stringify({
            next_card: next_card
        })
    );
};

const set_new_record = (request, response) => {

    let body = request.body;
    console.log("recibe este body : "+ body);

    let data = JSON.parse(body);
    console.log("after json : "+ data);


    let params = data['params'];
    console.log(params)

    let player = params[0];
    let record = params[1];

    console.log("recibe esto : "+ player + record);


    database_controller.set_new_record(player,record);

    response.send(
        "200",
        { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        JSON.stringify({
            // no response needed
        })
    );
};

module.exports = {get_top_scores,update_scores_from_db, next_card,set_new_record};