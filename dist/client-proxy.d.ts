import { EventEmitter2 } from '@nestjs/event-emitter';
import { RabbitMqService } from 'nestjs-rabbitmq';
import { ChannelWrapper } from 'amqp-connection-manager';
export declare class ClientProxy {
    private readonly mqService;
    private readonly consumerService;
    private readonly eventEmitter;
    private readonly methods;
    private readonly exchange;
    private readonly name;
    private _channel;
    get channel(): ChannelWrapper;
    constructor(name: string, methods: string[], exchange: string, mqService: RabbitMqService, eventEmitter: EventEmitter2);
    startCallBackConsumer(name: string): void;
    getService<T>(): T;
}
