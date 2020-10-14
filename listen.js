require('dotenv').config();
const aliyunAmqpCli = require('aliyun-amqp-node-cli');
const amqplib = aliyunAmqpCli({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    resourceOwnerId: process.env.ALIYUN_RESOURCE_OWNER_ID,
})(require('amqplib'));

let routingKeyResults = process.argv[3];
let exchange =  process.argv[2];

//  Connect to amqp server
console.log(`Connecting to amqp://${process.env.AMQP_HOST}/${process.env.AMQP_VHOST}`);
const open = amqplib.connect(`amqp://${process.env.AMQP_HOST}/${process.env.AMQP_VHOST}`, {
    timeout: 30 * 1000,
});

// Consumer
open
    .then(function(conn) {
        return conn.createChannel();
    })
    .then(function(ch) {
        return ch.assertQueue('').then(function(q) {
            console.log(' [*] Queue generated ' + q.queue);
            ch.bindQueue(q.queue, exchange, routingKeyResults)
            console.log(' [*] Bind to routing key ' + routingKeyResults + ' and exchange ' + exchange);
            return ch.consume(q.queue, function(msg) {
                if (msg !== null) {
                    console.log(msg.content.toString());
                    ch.ack(msg);
                }
            });
        });
    })
    .catch(console.warn);