import Pusher, { Options } from "pusher-js/react-native";
import { Logger } from "../log";
import { SecureStorage } from "../secure-storage";
import { SecureStorageKey } from "../secure-storage/keys";
import EnvService from "../env";

const logger = new Logger("Pusher");
let pusher: Pusher | null = null;

const _init = async () => {
  try {
    const token = await SecureStorage.getItem(SecureStorageKey.BEARER_TOKEN);

    const pusherConfig: Options = {
      cluster: "", // Laisser vide pour Reverb
      wsHost: "elite.kulturman.com",
      wsPort: 443,
      wssPort: 443,
      forceTLS: true, // Utiliser WSS
      enabledTransports: ["ws", "wss"],
      authEndpoint: "https://elite.kulturman.com/api/broadcasting/auth",
      channelAuthorization: {
        transport: "ajax",
        endpoint: "https://elite.kulturman.com/api/broadcasting/auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };

    // Create a new Pusher instance
    pusher = new Pusher(EnvService.PUSHER_KEY, pusherConfig);

    logger.debug(`Created new pusher instance`, pusher);

    // Connect (pusher-js auto-connects on subscribe, but explicit connect is fine)
    pusher.connect();
  } catch (e) {
    logger.error(`Pusher init error: ${e}`);
  }
};

export async function GetPusher(): Promise<Pusher> {
  if (pusher === null) {
    await _init();
  }

  if (pusher === null) {
    throw new Error("Pusher is not initialized");
  }

  logger.debug(`Pusher state: ${pusher.connection.state}`);
  return pusher;
}
