import { RabbitMqModuleOptions } from 'nestjs-rabbitmq';
export interface AsyncServiceOptions {
    name: string;
    methods: Array<string>;
}
export interface AsyncCallModuleOptions {
    exchange: string;
    services: Array<AsyncServiceOptions>;
    mq?: RabbitMqModuleOptions;
    call: string;
}
export interface AsyncCallModuleWithEnvOptions extends AsyncCallModuleOptions {
    env: string;
}
