var fs = require('fs');
var Q = require('q');
var es = require('elasticsearch');

var client = new es.Client({
    host: 'http://127.0.0.1:9200',
    apiVersion: '1.4'
});

client.indices.putTemplate({
    name: 'vanilla',
    body: {
        template: 'vanilla',
        mappings: require('./vanilla_template.json')
    }
}).then(function() {
    return client.indices.putTemplate({
        name: 'optimized',
        body: {
            template: 'optimized',
            mappings: require('./optimized_template.json')
        }
    });
})
.then(send)
.catch(console.error);

var SchemaMap = {
    'jack': '111111',
    'john': '222222',
    'mike': '333333',
    'nils': '444444',
    'jeff': '555555',
    'ryan': '666666',
    'shun': '777777'
};

// Super Evil
function send() {
    return Q.allSettled([sendToVanilla(), sendToOptimized()]).catch(console.log).then(send);
}

var vanilla = {
    index: 'vanilla',
    type: null,
    body: {
        "eventType": null,
        "serverTimestamp": "2014-06-26T22:19:08.000000-00:00",
        "data": {
           'whatever': 'xxxx'
        },
        "build": "1.1.1",
        "productKey": "08d2bdd9-631d-4622-bfd7-6654df871d52",
        "schemaHash": null,
        "ipAddress": "106.187.101.105",
        "sessionId": "fff324c6-30a2-11e3-ad80-485d60066bda",
        "clientTimestamp": "2014-06-26T22:19:08.000000-00:00",
        "userId": null,
        "device": "Utility",
        "userName": null
    }
};

function sendToVanilla() {
    var type = etype();
    var userId = uuid();
    console.log('vanilla', type);
    vanilla.type = type;
    vanilla.body.eventType = type;
    vanilla.body.schemaHash = type.split('|')[1];
    vanilla.body.userId = userId;
    vanilla.body.userName = "Player" + userId;
    return client.index(vanilla);
}

var optimized = {
    index: 'optimized',
    type: null,
    body: {
        "eventType": null,
        "serverTimestamp": "2014-06-26T22:19:08.000000-00:00",
        "data": {
           'whatever': 'xxxx'
        },
        "build": "1.1.1",
        "productKey": "08d2bdd9-631d-4622-bfd7-6654df871d52",
        "schemaHash": null,
        "ipAddress": "106.187.101.105",
        "sessionId": "fff324c6-30a2-11e3-ad80-485d60066bda",
        "clientTimestamp": "2014-06-26T22:19:08.000000-00:00",
        "userId": null,
        "device": "Utility",
        "userName": null
    }
};

function sendToOptimized() {
    var type = etype();
    var userId = uuid();
    console.log('optimized', type);
    optimized.type = type;
    optimized.body.eventType = type;
    optimized.body.schemaHash = type.split('|')[1];
    optimized.body.userId = userId;
    optimized.body.userName = "Player" + userId;
    return client.index(optimized);
}

function uuid() {
    return Math.floor(Math.random() * 1000 * 1000 * 1000) + '';
}

function etype() {
    var keys = Object.keys(SchemaMap);
    var index = Math.floor(Math.random() * keys.length);
    return keys[index] + '|' + SchemaMap[keys[index]];
}