import { EventEmitter2 } from '@nestjs/event-emitter';
import { RabbitMqService } from 'nestjs-rabbitmq';
import { ClientProxy } from './client-proxy';
import { AsyncServiceOptions } from './interfaces/async-module.interface';
export declare class ClientProxyFactory {
    static create(exchange: string, option: AsyncServiceOptions, mqService: RabbitMqService, eventEmitter: EventEmitter2): ClientProxy;
    static createConsumer(call: string, exchange: string, mqService: RabbitMqService, eventEmitter: EventEmitter2): void;
}
