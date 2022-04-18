import { DynamicModule, Global, Module } from '@nestjs/common'
import { ClientProxyFactory } from './client-proxy-factory'
import {
  AsyncCallModuleWithEnvOptions,
  AsyncCallModuleOptions,
} from './interfaces/async-module.interface'
import { RabbitMqModule, RabbitMqService } from 'nestjs-rabbitmq'
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { CallBackBaseService } from './callback-base.service'

@Global()
@Module({})
export class AsyncCallModule {
  static register(options: AsyncCallModuleOptions): DynamicModule {
    const clients = (options.services || []).map((item) => ({
      provide: `ASYNC_CALL_${item.name.toUpperCase()}`,
      useFactory: (mqService: RabbitMqService, eventEmitter: EventEmitter2) => {
        return ClientProxyFactory.create(
          options.exchange,
          item,
          mqService,
          eventEmitter,
        )
      },
      inject: [RabbitMqService, EventEmitter2],
    }))
    const consumerClient = {
      provide: `ASYNC_CONSUMER_${options.call.toUpperCase()}`,
      useFactory: (mqService: RabbitMqService, eventEmitter: EventEmitter2) => {
        ClientProxyFactory.createConsumer(
          options.call,
          options.exchange,
          mqService,
          eventEmitter,
        )
      },
      inject: [RabbitMqService, EventEmitter2],
    }
    return {
      imports: [
        EventEmitterModule.forRoot(),
        RabbitMqModule.forRoot(options.mq),
      ],
      module: AsyncCallModule,
      providers: [consumerClient, CallBackBaseService, ...clients],
      exports: [CallBackBaseService, ...clients],
    }
  }

  static registerAsync(options: AsyncCallModuleWithEnvOptions): DynamicModule {
    const clients = (options.services || []).map((item) => ({
      provide: `ASYNC_CALL_${item.name.toUpperCase()}`,
      useFactory: (mqService: RabbitMqService, eventEmitter: EventEmitter2) => {
        return ClientProxyFactory.create(
          options.exchange,
          item,
          mqService,
          eventEmitter,
        )
      },
      inject: [RabbitMqService, EventEmitter2],
    }))
    const consumerClient = {
      provide: `ASYNC_CONSUMER_${options.call.toUpperCase()}`,
      useFactory: (mqService: RabbitMqService, eventEmitter: EventEmitter2) => {
        ClientProxyFactory.createConsumer(
          options.call,
          options.exchange,
          mqService,
          eventEmitter,
        )
      },
      inject: [RabbitMqService, EventEmitter2],
    }
    return {
      imports: [
        ConfigModule.forRoot({
          isGlobal: false,
          envFilePath: options.env,
        }),
        EventEmitterModule.forRoot(),
        RabbitMqModule.forRootSync({
          useFactory: (configService: ConfigService) => ({
            user: configService.get<string>('RABBITMQ_USER'),
            passwd: configService.get<string>('RABBITMQ_PASSWD'),
            host: configService.get<string>('RABBITMQ_HOST'),
            port: +configService.get<number>('RABBITMQ_PORT'),
          }),
          inject: [ConfigService],
        }),
      ],
      module: AsyncCallModule,
      providers: [consumerClient, CallBackBaseService, ...clients],
      exports: [CallBackBaseService, ...clients],
    }
  }
}
