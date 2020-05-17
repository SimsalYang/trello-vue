import {
  Controller,
  Flow,
  Post,
  Ctx,
  Body,
  Get,
  Query,
  Params,
  Put,
  Delete,
} from 'koa-ts-controllers';

import Boom from '@hapi/boom';
import { Context } from 'koa';
import authorization from '../middlewares/authorization';
import {
  PostAddListBody,
  GetListsQuery,
  PutListBody,
  getAndValidateBoardList,
} from '../validators/BoardList';
import { getAndValidateBoard } from '../validators/Board';
import { BoardList as BoardListModel } from '../models/BoardList';

@Controller('/list')
@Flow([authorization])
export class BoardListController {
  /**
   * 创建列表
   */
  @Post('')
  public async addList(@Ctx() ctx: Context, @Body() body: PostAddListBody) {
    let { boardId, name } = body;
    // console.log(boardId, name);
    // 判断面板是否存在
    await getAndValidateBoard(boardId, ctx.userInfo.id);

    // 找到数据库中最大 order 值
    let maxOrderBoardList = await BoardListModel.findOne({
      where: {
        boardId,
      },
      order: [['order', 'desc']],
    });

    let boardList = new BoardListModel();
    // console.log(ctx.userInfo.id);
    boardList.userId = ctx.userInfo.id;
    boardList.boardId = boardId;
    boardList.name = name;
    // 通过判断最大 order 值，设置当前的 order值，为后续拖拽排序留出足够空间，方便计算
    boardList.order = maxOrderBoardList
      ? maxOrderBoardList.order + 65535
      : 65535;
    // console.log(boardList);
    await boardList.save();

    ctx.status = 201;
    return boardList;
  }

  /**
   * 获取列表集合
   * 获取当前用户指定面板下的列表
   */
  @Get('')
  public async getLists(@Ctx() ctx: Context, @Query() query: GetListsQuery) {
    let { boardId } = query;
    // 判断面板是否存在
    await getAndValidateBoard(boardId, ctx.userInfo.id);
    let boardList = await BoardListModel.findAll({
      where: { boardId },
      order: [['order', 'asc']],
    });

    // 默认 status = 200
    return boardList;
  }

  /**
   * 获取指定的列表详情
   */
  @Get('/:id(\\d+)')
  public async getList(@Ctx() ctx: Context, @Params('id') id: number) {
    console.log('id...', id);
    console.log('userid...', ctx.userInfo.id);
    let boardlist = await getAndValidateBoardList(id, ctx.userInfo.id);
    return boardlist;
  }

  /**
   * 更新指定列表
   */
  @Put('/:id(\\d+)')
  public async updateList(
    @Ctx() ctx: Context,
    @Params('id') id: number,
    @Body() body: PutListBody
  ) {
    let { boardId, name, order } = body;
    let boardlist = await getAndValidateBoardList(id, ctx.userInfo.id);
    boardlist.boardId = boardId || boardlist.boardId;
    boardlist.name = name || boardlist.name;
    boardlist.order = order || boardlist.order;
    await boardlist.save();
    ctx.status = 204;
    return;
  }

  /**
   * 删除列表
   */
  @Delete('/:id(\\d+)')
  public async deleteList(@Ctx() ctx: Context, @Params('id') id: number) {
    let boardlist = await getAndValidateBoardList(id, ctx.userInfo.id);
    await boardlist.destroy();
    ctx.status = 204;
    return;
  }
}
