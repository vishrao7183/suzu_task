export interface IItemRequestBody {
  name: string;
  description: string;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IItem extends IItemRequestBody {
  id: number;
}
