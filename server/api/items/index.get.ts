import Joi from "joi";
import { H3Event } from "h3";

import { IItemsQuery, IPagination } from "../../types/request";
import prisma from "../../dbConnection";
import { IItem } from "../../types/item";
import { IResponse } from "../../types/response";
import validateJoiSchema from "~/server/utils/validateJoiSchema";
import { Http_Codes, Server_Error_Message } from "~/server/constant/constant";

export default defineEventHandler(
  async (event: H3Event): Promise<IResponse> => {
    try {
      const query: IItemsQuery = getQuery(event);

      await validateRequestQuery(query);

      const options: IPagination = {};
      if (query.pageNo && query.limit) {
        options.skip = (Number(query.pageNo) - 1) * Number(query?.limit);
        options.take = Number(query?.limit);
      }

      const items: IItem[] = await prisma.item.findMany({
        ...options,
      });

      setResponseStatus(event, Http_Codes.succuss);

      const responseToSend: IResponse = { data: items, count: items.length };
      return responseToSend;
    } catch (err: any) {
      return createError({
        statusCode: err.statusCode || Http_Codes.serverError,
        statusMessage: err.statusMessage || Server_Error_Message,
      });
    }
  }
);

async function validateRequestQuery(query: IItemsQuery) {
  try {
    const itemQuerySchema = Joi.object({
      pageNo: Joi.number().optional(),
      limit: Joi.number().optional(),
    });

    await validateJoiSchema(itemQuerySchema, query);
  } catch (err) {
    throw err;
  }
}
