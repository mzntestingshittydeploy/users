const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    doApiRequest: async function (path, method, data, jsonf){
        let response;
        let URL = `http://localhost:${process.env.PORT}/api/${path}`;
        console.log('doApiRequest:');
        console.log(URL);
        if (jsonf){
            response = await fetch(URL, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN
                },
                body: JSON.stringify(data),
            });
        } else {
            response = await fetch(URL, { 
                method: method, 
                headers: {'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN}
            });
        }
        return response;
    },
};