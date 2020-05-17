import {
  IsNumberString,
  Min,
  IsNotEmpty,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { BoardList as BoardListModel } from '../models/BoardList';
import Boom from '@hapi/boom';

export class PostAddListBody {
  @Min(1, {
    message: '面板 id 不能为空且必须为数字',
  })
  boardId: number;

  @IsNotEmpty({
    message: '列表名称不能为空',
  })
  name: string;
}

export class GetListsQuery {
  @IsNumberString({
    message: '面板 id 不能为空且必须为数字',
  })
  boardId: number;
}

export class PutListBody {
  @ValidateIf((o) => o.boardId !== undefined)
  @Min(1, {
    message: '面板 id 不能为空且必须为数字',
  })
  boardId: number;

  @ValidateIf((o) => o.name !== undefined)
  @IsNotEmpty({
    message: '列表名称不能为空',
  })
  name: string;

  @ValidateIf((o) => o.order !== undefined)
  @IsNumber(
    {},
    {
      message: '序号必须是数字',
    }
  )
  order: number;
}

export async function getAndValidateBoardList(
  id: number,
  userId: number
): Promise<BoardListModel> {
  // 获取当前面板是否存在
  let board = await BoardListModel.findByPk(id);

  // 面板不存在
  if (!board) {
    throw Boom.notFound('指定列表不存在');
  }
  // 查看面板是否是当前用户的
  if (board.userId !== userId) {
    throw Boom.forbidden('禁止访问该列表');
  }
  return board;
}
