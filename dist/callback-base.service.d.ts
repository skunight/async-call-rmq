import { ChannelWrapper } from 'amqp-connection-manager';
import { RabbitMqService } from 'nestjs-rabbitmq';
export declare class CallBackBaseService {
    mqService: RabbitMqService;
    private _channel;
    get channel(): ChannelWrapper;
    sendCallBack(data: any, exchange: string, callBack: string): void;
}
