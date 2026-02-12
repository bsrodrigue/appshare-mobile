import Toast from "react-native-toast-message";

export class Toaster {
  public static success(title: string, message: string) {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
    });
  }

  public static error(title: string, message: string) {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
    });
  }

  public static info(title: string, message: string) {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
    });
  }
}
