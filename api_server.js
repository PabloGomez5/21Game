const createServer = require("./create_server");
const endpoints = require("./endpoints.js");

const requestListener = (request, response) => {

    console.log(" all we get, request : " + request.method);

    switch (request.method){
        case "GET": {
            switch (request.path) {
                case "/get_top_scores": {
                    return endpoints.get_top_scores(request, response);
                }
                case "/update_top_scores": {
                    return endpoints.update_scores_from_db(request, response);
                }
                case "/next_card": {
                    return endpoints.next_card(request, response);
                }
                default: {
                    return response.send(
                        404,
                        { "Content-Type": "application/json" },
                        JSON.stringify({
                            message: "Invalid path",
                        })
                    );
                }
            }
        }
        case "POST": {
            switch (request.path) {
                case "/set_new_record": {
                    return endpoints.set_new_record(request, response);
                }
                default: {
                    return response.send(
                        404,
                        { "Content-Type": "application/json" },
                        JSON.stringify({
                            message: "Invalid path",
                        })
                    );
                }
            }
        }
        default: {
            return response.send(
                404,
                { "Content-Type": "text/plain" },
                JSON.stringify({
                    message: "The server only supports HTTP mehtod Get and POST",
                })
            );
        }
    }

};

const server = createServer((request, response) => {
    try {
        return requestListener(request, response);
    } catch (error) {
        console.error(error);
        response.send(500, { "Content-Type": "text/plain" }, "Uncaught error");
    }
});

server.listen(8080);