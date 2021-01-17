const net = require("net");

const getHeadersObj = (allHeaders) => {
    let headers = {};

    //separo la cadena en varias por el salto de linea, no sabemos el numero exacto en el ejemplo de get salen 3
    let data_allHeaders = allHeaders.split("\r\n")

    for (let i = 1; i < data_allHeaders.length; i++) {
        let line = data_allHeaders[i];
        let lineContent = line.split(": ")

        headers[lineContent[0].toUpperCase()] = lineContent[1];
    }

    // devolvemos el objeto con el contenido de headersBody almacenado en k-v
    return headers;
}

// se implementa la funcion createServer
const createServer = (requestHandler) => {
    // se crea el servidor mediante net y se le pasa un socket
    const server = net.createServer(socket => {
        // se verifica que la conexcion se ha producido exitosamente
        console.log('Conexión exitosa con el servidor!')
        // se crea una varianle que almacenara el buffer en string
        let bufferString = "";
        // se implementa el metodo on para el socket al cual se le pasará el evento y la funcion que se ejecutara cuando el evento ocurra
        socket.on('data', function (data) {
            // se pasa la data de la peticion a string
            bufferString = Buffer.from(data).toString("utf-8");

            //se separan los header de la info del array
            const [infoArray, ...ignore] = bufferString.split("\r\n");
            // separa resources de request y se almacenan en variables distintas
            const resources = infoArray.split(" ");
            const request = {
                method: resources[0],
                path: resources[1],
                protocol: resources[2],
                headers: {},
                body: ''
            };
            // se obtiene el header de la request
            request.getHeader = (header) => {
                // si no hay header o esta undefined devuelve null, sin o retorna el header
                if (request.headers[header.toUpperCase()] === undefined)
                    return null;
                else
                    return request.headers[header.toUpperCase()];
            }
            // retorna el primer indice del bufferString
            let limitHeaders = bufferString.indexOf('\n\r');

            request.headers = getHeadersObj(bufferString.substring(0, limitHeaders - 1));
            request.body = bufferString.substring(limitHeaders + 3, bufferString.length);

            let contLen = request.getHeader("CONTENT-LENGTH");
            if(contLen != null && request.body.length < contLen){
                return;
            }

            //console.log("-----> headerObj: ", headersObj)

            // se implementa la funcion requestHandler del createServer
            requestHandler(request, {
                // se define el metodo send del response
                send: (response_code, response_header, response_body) => {
                    // agrega la fecha del header responde
                    response_header['Date'] = (new Date()).toUTCString();
                    // agreag la longitud del header response
                    response_header['content-length'] = response_body.length;
                    //escribe la respuesta en el socket
                    socket.write(`HTTP/1.1 ${response_code} Message\r\n`);
                    // devuelve los objetos key value response del header y los escribe en el socket
                    Object.entries(response_header).forEach(([key, value]) => {
                        socket.write(`${key}: ${value}\r\n`);
                    });
                    // devuelve el response y los escribe en el socket
                    socket.write("\r\n");
                    socket.write(response_body ? response_body + "\r\n\r\n\r\n" : "\r\n");+
                        // se finaliza la conexion con el socket
                        socket.end();
                }
            });
        });
    });

    return {
        //la funcion createServer debe devolver tanto el listen en un puerto concreto como el close para cerrar la conexion
        listen: (portNumber) => {
            console.log("Servidor abierto en http://localhost:" + portNumber);
            server.listen(portNumber);
        },
        close: () => {
            server.close();
        }
    };
};

module.exports = createServer;