import { Inject } from '@nestjs/common'
import { ChannelWrapper } from 'amqp-connection-manager'
import { RabbitMqService } from 'nestjs-rabbitmq'

export class CallBackBaseService {
  @Inject(RabbitMqService) mqService: RabbitMqService
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

  sendCallBack(data: any, exchange: string, callBack: string) {
    const queue = `async.call.cb.${exchange}`
    this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ method: callBack, data })),
    )
  }
}
