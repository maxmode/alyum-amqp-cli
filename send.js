require('dotenv').config();
const aliyunAmqpCli = require('aliyun-amqp-node-cli');
const amqplib = aliyunAmqpCli({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    resourceOwnerId: process.env.ALIYUN_RESOURCE_OWNER_ID,
})(require('amqplib'));

const params = {
    exchange: process.argv[2],
    routingKey: process.argv[3],
    message: process.argv[4],
};

//  Connect to amqp server
console.log(`Connecting to amqp://${process.env.AMQP_HOST}/${process.env.AMQP_VHOST}`);
const open = amqplib.connect(`amqp://${process.env.AMQP_HOST}/${process.env.AMQP_VHOST}`, {
    timeout: 30 * 1000,
});

// Publisher
open
    .then(conn => {
        return conn.createChannel();
    })
    .then(ch => {
        console.log("Sending message: " + params.message);
        return ch.publish(params.exchange, params.routingKey, Buffer.from(params.message));
    })
    .then(() => {
        console.log('Sent at ' + Math.round(Date.now()/1000));
        setTimeout(() => {process.exit()}, 5000)
    })
    .catch(console.warn);
