import Joi from "joi";
import { H3Event } from "h3";

import { IItem } from "../../types/item";
import prisma from "../../dbConnection";
import { IResponse } from "../../types/response";
import validateJoiSchema from "~/server/utils/validateJoiSchema";
import { Http_Codes, Server_Error_Message } from "~/server/constant/constant";
import { IItemParams } from "~/server/types/request";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const reqBody: IItem = await readBody(event);
    const itemParams: IItemParams = getRouterParams(event);
    await validateRequest({ ...itemParams, ...reqBody });

    reqBody.updated_at = new Date();
    const updated: IItem = await prisma.item.update({
      where: { id: Number(itemParams.id) },
      data: { ...reqBody, price: Number(reqBody.price) },
    });

    setResponseStatus(event, Http_Codes.succuss);

    let responseToSend: IResponse = {
      message: "Item updated",
      data: updated,
    };

    return responseToSend;
  } catch (err: any) {
    const message = "Item to update does not found";
    err = isItemNotFound(err, message);
    throw createError({
      statusCode: err.statusCode || Http_Codes.serverError,
      statusMessage: err.statusMessage || Server_Error_Message,
    });
  }
});

async function validateRequest(reqData: IItem) {
  try {
    const reqSchema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required().min(1),
    });

    await validateJoiSchema(reqSchema, reqData);
  } catch (err) {
    throw err;
  }
}
