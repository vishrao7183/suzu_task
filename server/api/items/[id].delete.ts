import { H3Event } from "h3";
import Joi from "joi";

import prisma from "../../dbConnection";
import { IResponse } from "../../types/response";
import { IItemParams } from "../../types/request";
import validateJoiSchema from "~/server/utils/validateJoiSchema";
import isItemNotFound from "~/server/utils/isItemNotFound";
import { Http_Codes, Server_Error_Message } from "~/server/constant/constant";

export default defineEventHandler(
  async (event: H3Event): Promise<IResponse> => {
    try {
      const itemParams: IItemParams = getRouterParams(event);
      await validateRequestParams(itemParams);

      await prisma.item.delete({
        where: { id: Number(itemParams.id) },
      });

      setResponseStatus(event, Http_Codes.succuss);

      const responseToSend: IResponse = {
        message: "Item Deleted",
      };

      return responseToSend;
    } catch (err: any) {
      const message = "Item to delete does not found";
      err = isItemNotFound(err, message);
      throw createError({
        statusCode: err.statusCode || Http_Codes.serverError,
        statusMessage: err.statusMessage || Server_Error_Message,
      });
    }
  }
);
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
