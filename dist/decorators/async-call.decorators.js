"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallBack = exports.InjectClient = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const InjectClient = (name) => {
    return (0, common_1.Inject)(`ASYNC_CALL_${name.toUpperCase()}`);
};
exports.InjectClient = InjectClient;
function CallBack(service, name) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            console.log('111');
            console.log('name: ', name);
            const obs = originalMethod.apply(this, args);
            console.log('obs: ', obs);
            obs
                .pipe((0, rxjs_1.tap)((data) => {
                console.log('data: ', data);
                this.sendCallBack(data, service, name);
            }))
                .subscribe();
            return obs;
        };
    };
}
exports.CallBack = CallBack;
//# sourceMappingURL=async-call.decorators.js.map