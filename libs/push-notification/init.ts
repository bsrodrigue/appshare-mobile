import { OneSignal, LogLevel } from "react-native-onesignal";
import EnvService from "../env";
import { Logger } from "../log";

async function init() {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(EnvService.ONESIGNAL_APP_ID);
  await OneSignal.Notifications.requestPermission(true);
}

export default class PushNotificationService {
  static async init() {
    Logger.setModuleName("PushNotificationService");
    Logger.debug("Initializing push notification service");
    await init();
  }
}
