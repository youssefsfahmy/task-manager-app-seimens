import { RawDraftContentState } from "draft-js";

export type IconProps = {
  color?: string;
  size?: string | number;
} & React.SVGAttributes<SVGElement>;

export type TaskType = {
  id?: string;
  title: string;
  description: RawDraftContentState;
  state: string;
  due: Date;
  order: number;
};

export type StatusType = { id: string; name: string; userId?: string | null };
