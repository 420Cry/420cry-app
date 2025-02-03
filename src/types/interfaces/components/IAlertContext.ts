import { IAlert } from "./IAlert";

export interface IAlertContext {
  alert: IAlert;
  setAlert: (alert: IAlert) => void;
}
