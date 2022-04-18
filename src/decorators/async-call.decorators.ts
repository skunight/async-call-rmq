import { Inject } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
export const InjectClient = (name: string) => {
  return Inject(`ASYNC_CALL_${name.toUpperCase()}`)
}

export function CallBack(service: string, name: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: any[]) {
      console.log('111')
      console.log('name: ', name)
      // const client = this[`ASYNC_CALL_${name.toUpperCase()}`]
      const obs: Observable<any> = originalMethod.apply(this, args)
      console.log('obs: ', obs)
      obs
        .pipe(
          tap((data: any) => {
            console.log('data: ', data)
            this.sendCallBack(data, service, name)
          }),
        )
        .subscribe()
      return obs
    }
  }
}
