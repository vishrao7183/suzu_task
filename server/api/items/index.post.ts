import { H3Event } from "h3";
import Joi from "joi";

import { IItem, IItemRequestBody } from "../../types/item";
import prisma from "../../dbConnection";
import { IResponse } from "../../types/response";
import validateJoiSchema from "~/server/utils/validateJoiSchema";
import { Http_Codes, Server_Error_Message } from "~/server/constant/constant";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const reqBody: IItemRequestBody = await readBody(event);
    await validateRequest(reqBody);
    const newItem: IItem = await prisma.item.create({
      data: {
        name: reqBody.name,
        description: reqBody.description,
        price: Number(reqBody.price),
      },
    });

    setResponseStatus(event, Http_Codes.created);

    let responseToSend: IResponse = {
      data: newItem,
      message: "New Item Added.",
    };

    return responseToSend;
  } catch (err: any) {
    console.log("errr",err)
    throw createError({
      statusCode: err.statusCode || Http_Codes.serverError,
      statusMessage: err.statusMessage || Server_Error_Message,
    });
  }
});

async function validateRequest(reqBody: IItemRequestBody) {
  try {
    const itemSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
    });

    await validateJoiSchema(itemSchema, reqBody);
  } catch (err) {
    throw err;
  }
}
