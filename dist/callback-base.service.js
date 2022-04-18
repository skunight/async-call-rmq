"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallBackBaseService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_rabbitmq_1 = require("nestjs-rabbitmq");
class CallBackBaseService {
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
    sendCallBack(data, exchange, callBack) {
        const queue = `async.call.cb.${exchange}`;
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify({ method: callBack, data })));
    }
}
__decorate([
    (0, common_1.Inject)(nestjs_rabbitmq_1.RabbitMqService),
    __metadata("design:type", nestjs_rabbitmq_1.RabbitMqService)
], CallBackBaseService.prototype, "mqService", void 0);
exports.CallBackBaseService = CallBackBaseService;
//# sourceMappingURL=callback-base.service.js.map