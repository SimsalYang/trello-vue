import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

/**
 * 验证是否与传入值相同
 * @param property 传入的参与验证的值
 * @param validationOptions 配置选项
 * return
 */
export function IsSameValue(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (
    // 装饰的目标
    target: Object,
    // 装饰的属性名称
    propertyName: string
  ) {
    registerDecorator({
      // 装饰器名称
      name: 'isSameValue',
      target: target.constructor,
      propertyName,
      // 验证传入的参数
      constraints: [property],
      options: validationOptions,
      // 验证器，具体要实现的验证方法
      validator: {
        validate(
          value: any,
          validationArguments?: ValidationArguments
        ): Promise<boolean> | boolean {
          // 第一个参数指定的属性对应的值
          // 因为 validationArguments 是一个可选值
          // 可能为 undefined
          // 所以在用的时候需要对其进行判断
          const relatedValue =
            validationArguments &&
            (validationArguments.object as any)[property];
          // value: 当前装饰器属性对应的值
          return relatedValue === value;
        },
      },
    });
  };
}
