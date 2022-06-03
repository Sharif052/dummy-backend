export interface IUser {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly cTime: number;
  readonly cBy: string;
  readonly uTime: number;
  readonly uBy: string;
}
