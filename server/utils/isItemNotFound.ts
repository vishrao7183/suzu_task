import {
  Http_Codes,
  Prisma_Record_Does_Not_Exist_Code,
} from "../constant/constant";

export default function (err: any, message: string) {
  const isItemNotFound = (): boolean =>
    err.code === Prisma_Record_Does_Not_Exist_Code;
  if (isItemNotFound()) {
    err.statusCode = Http_Codes.notFound;
    err.statusMessage = message;
  }
  return err;
}
