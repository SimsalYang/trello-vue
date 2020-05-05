import { IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';
export class PostAddBoardBody {
  // 面板名称
  @IsNotEmpty({
    message: '面板名称不能为空',
  })
  @MaxLength(255, {
    message: '面板名称不能大于 255 个字符',
  })
  name: string;
}

export class PutUpdateBoardBody {
  // 不强制要求验证面板名称，如果有，则验证
  @ValidateIf((o) => o.name !== undefined)
  @MaxLength(255, {
    message: '面板名称不能大于 255 个字符',
  })
  name?: string;
}
