const http = require('http');
const url = require('url');

const fs = require('fs');

let server = http.createServer(async (richiesta, risposta) => {
    let indirizzo = richiesta.headers.host + richiesta.url;
    let infoUrl = url.parse(indirizzo, true);

    let header = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    console.log(infoUrl.pathname);
    switch(infoUrl.pathname) {
        case '/getZips':
            fs.readFile('zips.json', (err, file) => {
                if (err) throw err;
                risposta.writeHead(200, header);
                risposta.end(file);
            });
        break;

        case '/addZip':
            let add = "";
            let resp = [];

            richiesta.on('data', (data) => {
                add += data;
            });
            richiesta.on('end', () => {
                fs.readFile('zips.json', (err, file) => {
                    let id = getLastId(file);

                    add = JSON.parse(add);
                    add._id = id;
                    
                    for(let i = 0; i < add.loc.length; i++)
                        add.loc[i] = parseFloat(add.loc[i]);
                    console.log(add);

                    resp = JSON.parse(file);
                    resp.push(add);
                    
                    fs.writeFile('zips.json', JSON.stringify(resp, null, 2), (err) => {
                        if (err) throw err;
                        risposta.writeHead(200, header);
                        risposta.end(JSON.stringify(add));
                    });
                });
            });
        break;
    }
});

server.listen(1337);
console.log('il server è avviato sulla porta 1337');

function getLastId(file) {
    let zips = JSON.parse(file);
    return parseInt(zips[zips.length - 1]._id) + 1;
}