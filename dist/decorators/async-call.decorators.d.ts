export declare const InjectClient: (name: string) => (target: object, key: string | symbol, index?: number) => void;
export declare function CallBack(service: string, name: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
