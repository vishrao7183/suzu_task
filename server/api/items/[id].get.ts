import Joi from "joi";
import { H3Event } from "h3";

import prisma from "../../dbConnection";
import { IItem } from "../../types/item";
import { IResponse } from "../../types/response";
import validateJoiSchema from "~/server/utils/validateJoiSchema";
import { Http_Codes, Server_Error_Message } from "~/server/constant/constant";
import { IItemParams } from "~/server/types/request";

export default defineEventHandler(
  async (event: H3Event): Promise<IResponse> => {
    try {
      const itemParams: IItemParams = getRouterParams(event);
      await validateRequestParams(itemParams);

      const item: IItem | null = await prisma.item.findFirst({
        where: { id: Number(itemParams.id) },
      });
      validateItem(item);

      setResponseStatus(event, Http_Codes.succuss);

      const responseToSend: IResponse = { data: item || null };

      return responseToSend;
    } catch (err: any) {
      throw createError({
        statusCode: err.statusCode || Http_Codes.serverError,
        statusMessage: err.statusMessage || Server_Error_Message,
      });
    }
  }
);

function validateItem(item: IItem | null) {
  const isItemNotFound = (): boolean => !item;
  if (isItemNotFound()) {
    throw {
      statusCode: Http_Codes.notFound,
      statusMessage: "Item not found",
    };
  }
}

async function validateRequestParams(itemParams: IItemParams) {
  try {
    const itemParamsSchema = Joi.object({
      id: Joi.number().required(),
    });

    await validateJoiSchema(itemParamsSchema, itemParams);
  } catch (err) {
    throw err;
  }
}
