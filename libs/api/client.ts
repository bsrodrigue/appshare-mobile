import { HTTPClient } from "@/libs/http/client";
import { Logger } from "../log";

export class APIService {
  private static defaultClient: HTTPClient;

  private static isInitialized: boolean = false;

  public static initializeDefaultClient(baseURL: string): void {
    if (APIService.isInitialized) {
      Logger.debug(
        "APIService has already been initialized. Skipping re-initialization."
      );
      return;
    }

    APIService.defaultClient = new HTTPClient(baseURL, {});

    APIService.isInitialized = true;
    Logger.debug(`APIService initialized with baseURL: ${baseURL}`);
  }

  public static getClient(): HTTPClient {
    if (!APIService.isInitialized || !APIService.defaultClient) {
      throw new Error(
        "APIService not initialized. Call APIService.initializeDefaultClient() first."
      );
    }
    return APIService.defaultClient;
  }
}
