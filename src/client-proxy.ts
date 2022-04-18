import { EventEmitter2 } from '@nestjs/event-emitter'
import { RabbitMqService } from 'nestjs-rabbitmq'
import { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'

export class ClientProxy {
  private readonly mqService: RabbitMqService
  private readonly consumerService: RabbitMqService
  private readonly eventEmitter: EventEmitter2
  private readonly methods: string[]
  private readonly exchange: string
  private readonly name: string
  private _channel: ChannelWrapper
  public get channel(): ChannelWrapper {
    if (!this._channel) {
      this._channel = this.mqService.getClient().createChannel()
      this._channel.addListener('close', () => {
        console.log('--------close--------')
        this._channel = null
      })
      this._channel.addListener('error', (err) => {
        console.log('err: ', err)
        this._channel = null
      })
    }
    return this._channel
  }

  constructor(
    name: string,
    methods: string[],
    exchange: string,
    mqService: RabbitMqService,
    eventEmitter: EventEmitter2,
  ) {
    this.name = name
    this.methods = methods
    this.exchange = exchange
    this.mqService = mqService
    this.eventEmitter = eventEmitter
    this.startCallBackConsumer(name)
  }

  startCallBackConsumer(name: string): void {
    const client = this.mqService.getClient()
    client.createChannel({
      setup: async (channel: ConfirmChannel) => {
        channel.on('error', (err) => {
          console.log('err: ', err)
        })
        const queue = `async.call.cb.${name}`
        await channel.prefetch(1)
        await channel.assertQueue(queue, {
          durable: true,
        })
        channel.consume(queue, (msg: ConsumeMessage) => {
          try {
            const { method, data } = JSON.parse(msg.content.toString())
            this.eventEmitter.emit(method, data)
          } catch (error) {
            console.log('error: ', error)
          } finally {
            channel.ack(msg)
          }
        })
      },
    })
  }

  getService<T>(): T {
    const service = {} as T
    this.methods.forEach((method: string) => {
      service[method] = (data: any) => {
        console.log('data: ', data)
        console.log('this.exchange: ', this.exchange)
        this.channel.publish(
          this.exchange,
          this.name,
          Buffer.from(JSON.stringify({ method, data })),
        )
      }
    })
    return service
  }
}
