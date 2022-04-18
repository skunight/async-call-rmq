"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProxyFactory = void 0;
const client_proxy_1 = require("./client-proxy");
class ClientProxyFactory {
    static create(exchange, option, mqService, eventEmitter) {
        const client = new client_proxy_1.ClientProxy(option.name, option.methods, exchange, mqService, eventEmitter);
        return client;
    }
    static createConsumer(call, exchange, mqService, eventEmitter) {
        const client = mqService.getClient();
        client.createChannel({
            setup: async (channel) => {
                channel.on('error', (err) => {
                    console.log('err: ', err);
                });
                await channel.assertExchange(exchange, 'topic', { durable: true });
                const queue = `async.call.${call}`;
                await channel.prefetch(1);
                await channel.assertQueue(queue, {
                    durable: true,
                });
                await channel.bindQueue(queue, exchange, call);
                channel.consume(queue, (msg) => {
                    try {
                        const { method, data } = JSON.parse(msg.content.toString());
                        eventEmitter.emit(method, data);
                    }
                    catch (error) {
                        console.log('error: ', error);
                    }
                    finally {
                        channel.ack(msg);
                    }
                });
            },
        });
    }
}
exports.ClientProxyFactory = ClientProxyFactory;
//# sourceMappingURL=client-proxy-factory.js.map