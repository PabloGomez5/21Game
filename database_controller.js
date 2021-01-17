var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./twentyOneGame.db');


// Insert into Table -- WORKS
const set_new_record = (nickname,longest_streak) => {
    console.log("estagfisdf");
    db.serialize(function() {
        console.log("this is what it gets :"+nickname + longest_streak);
        db.run("INSERT into streaks(nickname,l_streak) VALUES ('"+nickname+"',"+longest_streak+")");
        //db.run("INSERT into streaks(nickname,longest_streak) VALUES ('Laura',27);");
    });

}



//  HERE I AM GONNA CREATE AN ARRAY OPEN IT TO ALL METHODS
let common_top_streaks_array= [];

const get_top_streaks_array = () => {

    // we check the array got the values
    console.log("this is the array i am returning : ");
    console.log(common_top_streaks_array);

    // here i return the array
    return common_top_streaks_array;

}

// Select from table --  WORKS
const update_top_scores = async() => {

    common_top_streaks_array= [];

    await db.serialize(function () {
        db.all("SELECT * FROM streaks ORDER BY l_streak DESC;", [], function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                //console.log(" this is rows : " + rows);
                let i = 0;
                for (i; i < rows.length; i++) {
                    //console.log(" this is a row of rows : " + rows[i].nickname + rows[i].l_streak);
                    //let n = rows[i].nickname;
                    //let r = rows[i].l_streak;
                    //let record = [n, r]; // create a mini array

                    let player = rows[i].nickname;
                    //console.log(" to charge this player : " + player);
                    let record = rows[i].l_streak;
                    console.log("to charge this record : " + record);

                    // here we will save in the common value a player and his record.
                    common_top_streaks_array.push(player);
                    common_top_streaks_array.push(record);

                }
                console.log(" the i now : "+i);

                // in the case there is no 10 yet then we push "" to have ten
                if (i < 10) {

                    for (i; i < 10; i++) {

                        let player = "";
                        let record = "";
                        //let record = [n, r]; // create a mini array
                        //console.log(" to charge this player : " + player);
                        //console.log("to charge this record : " + record);

                        // here we will save in the common value a player and his record.
                        common_top_streaks_array.push(player);
                        common_top_streaks_array.push(record);
                    }
                }
                console.log(" the i now : "+i);
                console.log("after all this charge, how is the array ?");
                console.log(common_top_streaks_array);
            }
        });
    });
}


module.exports={get_top_streaks_array,set_new_record,update_top_scores};