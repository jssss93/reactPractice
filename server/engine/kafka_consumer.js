var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({kafkaHost: '127.17.0.1:9092'}),
    consumer = new Consumer(client,
        [{ topic: 'logs-topic', offset: 'latest'}],
        {
            autoCommit: true
        }
    );
consumer.on('message', function (message) {
    console.log(message);
});
consumer.on('error', function (err) {
    console.log('Error:',err);
})
consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
}) 
