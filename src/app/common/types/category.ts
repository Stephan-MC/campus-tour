import { CategoryType } from '../enums/category';

type CategoryKey =
  | 'canteen'
  | 'classroom'
  | 'classroom-block'
  | 'health-center'
  | 'lab'
  | 'office'
  | 'toilet';

export type Category = {
  [k in CategoryType]: {
    name: string;
    icon: string;
    color: string;
  };
};
