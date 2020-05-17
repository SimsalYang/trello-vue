import {
  Controller,
  Flow,
  Post,
  Ctx,
  Body,
  Query,
  Get,
  Params,
  Put,
  Delete,
} from 'koa-ts-controllers';
import authorization from '../middlewares/authorization';
// import KoaBody from 'koa-body';
import { Context } from 'koa';
import path from 'path';
import {
  PostAddCardBody,
  GetCardQuery,
  PutUpdateCardBody,
  getAndValidateCard,
} from '../validators/Card';
import { getAndValidateBoardList } from '../validators/BoardList';
import { Card as CardModel } from '../models/Card';
import { Comment as CommentModel } from '../models/Comment';
import { CardAttachment as CardAttachmentModel } from '../models/CardAttachment';
import { Attachment as AttachmentModel } from '../models/Attachment';
import configs from '../configs';
import Boom from '@hapi/boom';

@Controller('/card')
@Flow([authorization])
export class CardController {
  /**
   * 创建新卡片
   */
  @Post('')
  public async addCard(@Ctx() ctx: Context, @Body() body: PostAddCardBody) {
    let { boardListId, name, description } = body;
    await getAndValidateBoardList(boardListId, ctx.userInfo.id);

    let card = new CardModel();

    card.userId = ctx.userInfo.id;
    card.boardListId = boardListId;
    card.name = name;
    card.description = description || '';

    await card.save();

    ctx.status = 201;
    return card;
  }

  /**
   * 获取卡片列表
   */
  @Get('')
  public async getCards(@Ctx() ctx: Context, @Query() query: GetCardQuery) {
    let { boardListId } = query;
    await getAndValidateBoardList(boardListId, ctx.userInfo.id);
    let cards = await CardModel.findAll({
      where: {
        boardListId,
      },
      order: [['id', 'asc']],
      // 连表查询，获取评论条数
      include: [
        {
          model: CommentModel,
          attributes: ['id'],
        },
        {
          model: CardAttachmentModel,
          include: [
            {
              model: AttachmentModel,
            },
          ],
        },
      ],
    });

    // 整理数据后再返回给前端
    let cardsData = cards.map((card: CardModel) => {
      // 处理附件路径和封面
      let coverPath = '';
      let attachments = card.attachments.map((attachment) => {
        let data = attachment.toJSON() as CardAttachmentModel & {
          path: string;
        };
        data.path = configs.storage.prefix + '/' + data.detail.name;

        if (data.isCover) {
          coverPath = data.path;
        }
        return data;
      });
      return {
        id: card.id,
        userId: card.userId,
        boardListId: card.boardListId,
        name: card.name,
        description: card.description,
        order: card.order,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        attachments: attachments,
        coverPath: coverPath,
        commentCount: card.comments.length,
      };
    });

    return cardsData;
  }

  /**
   * 获取一个卡片信息
   */
  @Get('/:id(\\d+)')
  public async getCard(@Ctx() ctx: Context, @Params('id') id: number) {
    let card = await getAndValidateCard(id, ctx.userInfo.id);

    return card;
  }

  /**
   * 更新一个卡片信息
   */
  @Put('/:id(\\d+)')
  public async updateCard(
    @Ctx() ctx: Context,
    @Params('id') id: number,
    @Body() body: PutUpdateCardBody
  ) {
    let { boardListId, name, description, order } = body;
    let card = await getAndValidateCard(id, ctx.userInfo.id);

    card.boardListId = boardListId || card.boardListId;
    card.name = name || card.name;
    card.description = description || card.description;
    card.order = order || card.order;

    await card.save();
    ctx.status = 204;
    return;
  }

  /**
   * 删除一个卡片信息
   */
  @Delete('/:id(\\d+)')
  public async deleteCard(@Ctx() ctx: Context, @Params('id') id: number) {
    let card = await getAndValidateCard(id, ctx.userInfo.id);
    await card.destroy();

    ctx.status = 204;
    return;
  }

  /**
   * 附件上传
   */
  @Post('/attachment')
  public async addAttachment(@Ctx() ctx: Context, @Body() body: any) {
    let { boardListCardId } = body;
    let card = await getAndValidateCard(boardListCardId, ctx.userInfo.id);
    // 上传的文件在 ctx.request.files.attachment 中
    // console.log(ctx.request.files);
    if (!ctx.request.files || !ctx.request.files.attachment) {
      throw Boom.badData('缺少附件');
    }
    let file = ctx.request.files.attachment;
    // console.log(file);
    // console.log(ctx.request.files.attachment);
    let attachment = new AttachmentModel();
    attachment.userId = ctx.userInfo.id;
    attachment.originName = file.name;
    attachment.name = file.path.split(path.sep).pop() as string;
    attachment.type = file.type;
    attachment.size = file.size;
    await attachment.save();

    let cardAttachment = new CardAttachmentModel();
    cardAttachment.userId = ctx.userInfo.id;
    cardAttachment.boardListCardId = boardListCardId;
    cardAttachment.attachmentId = attachment.id;
    await cardAttachment.save();

    ctx.status = 201;
    return {
      id: cardAttachment.id,
      userId: cardAttachment.userId,
      boardListCardId: cardAttachment.boardListCardId,
      attachmentId: attachment.id,
      path: configs.storage.prefix + '/' + attachment.name,
      isCover: false,
      detail: attachment,
    };
  }
}
