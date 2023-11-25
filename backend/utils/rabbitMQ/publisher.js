import amqp from 'amqplib/callback_api.js';

const Worker = () => {
    amqp.connect('amqp://localhost', (error, connection) => {
        if(error) throw error;
        connection.createChannel((err, channel) => {
            if(err) throw err;
            const queue = 'task_queue';

            channel.assertQueue(queue, {
                durable: false
            });

            // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            console.log(`Waiting for message....`);

            channel.consume(queue, (msg) => {
                const secs = msg.content.toString().split('.').length - 1;
                console.log(" [x] Received: %s", msg.content.toString());
                setTimeout(function() {
                    console.log(" [x] Done");
                }, secs * 1000);
            }, {
                noAck: true
            });
        });
    });
}

export default Worker;
