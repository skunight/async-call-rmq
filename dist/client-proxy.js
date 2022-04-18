"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProxy = void 0;
class ClientProxy {
    constructor(name, methods, exchange, mqService, eventEmitter) {
        this.name = name;
        this.methods = methods;
        this.exchange = exchange;
        this.mqService = mqService;
        this.eventEmitter = eventEmitter;
        this.startCallBackConsumer(name);
    }
    get channel() {
        if (!this._channel) {
            this._channel = this.mqService.getClient().createChannel();
            this._channel.addListener('close', () => {
                console.log('--------close--------');
                this._channel = null;
            });
            this._channel.addListener('error', (err) => {
                console.log('err: ', err);
                this._channel = null;
            });
        }
        return this._channel;
    }
    startCallBackConsumer(name) {
        const client = this.mqService.getClient();
        client.createChannel({
            setup: async (channel) => {
                channel.on('error', (err) => {
                    console.log('err: ', err);
                });
                const queue = `async.call.cb.${name}`;
                await channel.prefetch(1);
                await channel.assertQueue(queue, {
                    durable: true,
                });
                channel.consume(queue, (msg) => {
                    try {
                        const { method, data } = JSON.parse(msg.content.toString());
                        this.eventEmitter.emit(method, data);
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
    getService() {
        const service = {};
        this.methods.forEach((method) => {
            service[method] = (data) => {
                console.log('data: ', data);
                console.log('this.exchange: ', this.exchange);
                this.channel.publish(this.exchange, this.name, Buffer.from(JSON.stringify({ method, data })));
            };
        });
        return service;
    }
}
exports.ClientProxy = ClientProxy;
//# sourceMappingURL=client-proxy.js.map