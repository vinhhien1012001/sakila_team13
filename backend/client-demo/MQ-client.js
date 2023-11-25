import amqp from 'amqplib/callback_api.js';

amqp.connect('amqp://localhost', (error, connection) => {
    if(error) throw error;
    connection.createChannel((err, channel) => {
        if(err) throw err;

        const queue = 'task_queue';
        const msg = process.argv.slice(2).join(' ') || 'empty';

        channel.assertQueue(queue, {
            durable: false
        })

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
            persistent: true
        });
        console.log(`[x] Sending ${msg}`);
    });
    setTimeout(() => {
        connection.close();
    }, 1000);
});
