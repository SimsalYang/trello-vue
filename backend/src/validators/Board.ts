import { IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';
import { Board as BoardModel } from '../models/Board';
import Boom from '@hapi/boom';
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

export async function getAndValidateBoard(
  id: number,
  userId: number
): Promise<BoardModel> {
  // 获取当前面板是否存在
  let board = await BoardModel.findByPk(id);

  // 面板不存在
  if (!board) {
    throw Boom.notFound('指定看板不存在');
  }
  // 查看面板是否是当前用户的
  if (board.userId !== userId) {
    throw Boom.forbidden('禁止访问该面板');
  }

  return board;
}
