import { EventEmitter2 } from '@nestjs/event-emitter'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import { RabbitMqService } from 'nestjs-rabbitmq'
import { ClientProxy } from './client-proxy'
import { AsyncServiceOptions } from './interfaces/async-module.interface'

export class ClientProxyFactory {
  public static create(
    exchange: string,
    option: AsyncServiceOptions,
    mqService: RabbitMqService,
    eventEmitter: EventEmitter2,
  ): ClientProxy {
    const client = new ClientProxy(
      option.name,
      option.methods,
      exchange,
      mqService,
      eventEmitter,
    )
    return client
  }

  public static createConsumer(
    call: string,
    exchange: string,
    mqService: RabbitMqService,
    eventEmitter: EventEmitter2,
  ) {
    const client = mqService.getClient()
    client.createChannel({
      setup: async (channel: ConfirmChannel) => {
        channel.on('error', (err) => {
          console.log('err: ', err)
        })
        await channel.assertExchange(exchange, 'topic', { durable: true })
        const queue = `async.call.${call}`
        await channel.prefetch(1)
        await channel.assertQueue(queue, {
          durable: true,
        })
        await channel.bindQueue(queue, exchange, call)
        channel.consume(queue, (msg: ConsumeMessage) => {
          try {
            const { method, data } = JSON.parse(msg.content.toString())
            eventEmitter.emit(method, data)
          } catch (error) {
            console.log('error: ', error)
          } finally {
            channel.ack(msg)
          }
        })
      },
    })
  }
}
