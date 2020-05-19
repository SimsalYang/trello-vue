import {
  IsNumberString,
  Min,
  IsNotEmpty,
  ValidateIf,
  MaxLength,
} from 'class-validator';
import Boom from '@hapi/boom';
import { Card as CardModel } from '../models/Card';
import { CardAttachment as CardAttachmentModel } from '../models/CardAttachment';

export class PostAddCardBody {
  @Min(1, {
    message: 'boardListId 不能为空且必须大于1',
  })
  boardListId: number;

  @IsNotEmpty({
    message: '名称不能为空',
  })
  @MaxLength(255, {
    message: '名称不能大于255个字符',
  })
  name: string;

  @ValidateIf((o) => o.description !== undefined)
  @MaxLength(2000, {
    message: '卡片描述不能大于2000个字符',
  })
  description?: string;
}

export class GetCardQuery {
  @IsNumberString({
    message: 'boardListId 不能为空且必须是数字',
  })
  boardListId: number;
}

export class PutUpdateCardBody {
  @ValidateIf((o) => o.boardListId !== undefined)
  @Min(1, {
    message: 'boardListId 不能为空且必须大于1',
  })
  boardListId?: number;

  @ValidateIf((o) => o.name !== undefined)
  @MaxLength(255, {
    message: '名称不能大于255个字符',
  })
  name?: string;

  @ValidateIf((o) => o.description !== undefined)
  @MaxLength(2000, {
    message: '卡片描述不能大于2000个字符',
  })
  description?: string;

  @ValidateIf((o) => o.order !== undefined)
  @IsNumberString({
    message: 'order必须为数字',
  })
  order?: number;
}

export class PutSetCoverBody {
  @Min(1, {
    message: '附件 id 必须微为数字',
  })
  attachmentId: number;
}

export async function getAndValidateCard(
  id: number,
  userId: number
): Promise<CardModel> {
  // 获取当前面板是否存在
  let board = await CardModel.findByPk(id);

  // 面板不存在
  if (!board) {
    throw Boom.notFound('指定卡片列表不存在');
  }
  // 查看面板是否是当前用户的
  if (board.userId !== userId) {
    throw Boom.forbidden('禁止访问该列表');
  }
  return board;
}

export async function getAndValidateCardAttachment(
  id: number,
  userId: number
): Promise<CardAttachmentModel> {
  // 获取当前面板是否存在
  let board = await CardAttachmentModel.findByPk(id);

  // 面板不存在
  if (!board) {
    throw Boom.notFound('指定附件不存在');
  }
  // 查看面板是否是当前用户的
  if (board.userId !== userId) {
    throw Boom.forbidden('禁止访问该附件');
  }
  return board;
}
