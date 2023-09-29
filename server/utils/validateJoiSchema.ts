import { Http_Codes } from "../constant/constant";

export default async (schema: any, data: any): Promise<void> => {
  try {
    const { error } = await schema.validate(data);
    if (error) {
      throw {
        statusCode: Http_Codes.validationError,
        statusMessage: error.details[0].message,
      };
    }
    return;
  } catch (error) {
    throw error;
  }
};
