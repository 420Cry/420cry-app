import { IAlert } from "@/src/types";

export const showAlert = (
  type: "success" | "danger" | "info" | "warning",
  message: string,
  setAlert: (alert: IAlert) => void,
): void => {
  setAlert({ show: type !== "info", type, message });
};
