import {
  IsNumber,
  MaxLength,
  IsNumberString,
  ValidateIf,
} from 'class-validator';
import Boom from '@hapi/boom';

export class PostAddCommentBody {
  @IsNumber(
    {},
    {
      message: 'boardListCardId 必须为数字',
    }
  )
  boardListCardId: number;

  @MaxLength(2000, {
    message: '评论内容不能大于 2000 个字符',
  })
  content: string;
}

export class GetCommentsQuery {
  @IsNumberString({
    message: 'boardListCardId必须为数字',
  })
  boardListCardId: number;

  @ValidateIf((o) => o.page !== undefined)
  @IsNumberString({
    message: '分页必须是数字',
  })
  page?: number;
}
