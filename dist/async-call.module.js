"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AsyncCallModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncCallModule = void 0;
const common_1 = require("@nestjs/common");
const client_proxy_factory_1 = require("./client-proxy-factory");
const nestjs_rabbitmq_1 = require("nestjs-rabbitmq");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const callback_base_service_1 = require("./callback-base.service");
let AsyncCallModule = AsyncCallModule_1 = class AsyncCallModule {
    static register(options) {
        const clients = (options.services || []).map((item) => ({
            provide: `ASYNC_CALL_${item.name.toUpperCase()}`,
            useFactory: (mqService, eventEmitter) => {
                return client_proxy_factory_1.ClientProxyFactory.create(options.exchange, item, mqService, eventEmitter);
            },
            inject: [nestjs_rabbitmq_1.RabbitMqService, event_emitter_1.EventEmitter2],
        }));
        const consumerClient = {
            provide: `ASYNC_CONSUMER_${options.call.toUpperCase()}`,
            useFactory: (mqService, eventEmitter) => {
                client_proxy_factory_1.ClientProxyFactory.createConsumer(options.call, options.exchange, mqService, eventEmitter);
            },
            inject: [nestjs_rabbitmq_1.RabbitMqService, event_emitter_1.EventEmitter2],
        };
        return {
            imports: [
                event_emitter_1.EventEmitterModule.forRoot(),
                nestjs_rabbitmq_1.RabbitMqModule.forRoot(options.mq),
            ],
            module: AsyncCallModule_1,
            providers: [consumerClient, callback_base_service_1.CallBackBaseService, ...clients],
            exports: [callback_base_service_1.CallBackBaseService, ...clients],
        };
    }
    static registerAsync(options) {
        const clients = (options.services || []).map((item) => ({
            provide: `ASYNC_CALL_${item.name.toUpperCase()}`,
            useFactory: (mqService, eventEmitter) => {
                return client_proxy_factory_1.ClientProxyFactory.create(options.exchange, item, mqService, eventEmitter);
            },
            inject: [nestjs_rabbitmq_1.RabbitMqService, event_emitter_1.EventEmitter2],
        }));
        const consumerClient = {
            provide: `ASYNC_CONSUMER_${options.call.toUpperCase()}`,
            useFactory: (mqService, eventEmitter) => {
                client_proxy_factory_1.ClientProxyFactory.createConsumer(options.call, options.exchange, mqService, eventEmitter);
            },
            inject: [nestjs_rabbitmq_1.RabbitMqService, event_emitter_1.EventEmitter2],
        };
        return {
            imports: [
                event_emitter_1.EventEmitterModule.forRoot(),
                nestjs_rabbitmq_1.RabbitMqModule.forRootSync({
                    useFactory: (configService) => ({
                        user: configService.get('RABBITMQ_USER'),
                        passwd: configService.get('RABBITMQ_PASSWD'),
                        host: configService.get('RABBITMQ_HOST'),
                        port: +configService.get('RABBITMQ_PORT'),
                    }),
                    inject: [config_1.ConfigService],
                }),
            ],
            module: AsyncCallModule_1,
            providers: [consumerClient, callback_base_service_1.CallBackBaseService, ...clients],
            exports: [callback_base_service_1.CallBackBaseService, ...clients],
        };
    }
};
AsyncCallModule = AsyncCallModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AsyncCallModule);
exports.AsyncCallModule = AsyncCallModule;
//# sourceMappingURL=async-call.module.js.map