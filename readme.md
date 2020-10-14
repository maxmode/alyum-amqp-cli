#Setup

```
npm install
```

Then specify access to your AMQP in .env file

#Usage

Consumer - CLI script will connect to exchange and will listen to messages with routing key. 
Messages will be added to console output in raw format.
```

node listen.js exchange route_key

```

Publisher - a way to send message from CLI. To certain exchange and routing key. 
```
node send.js exchange route_key message
```