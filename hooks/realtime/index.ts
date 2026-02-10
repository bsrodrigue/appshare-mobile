import { Logger } from "@/libs/log";
import { GetPusher } from "@/libs/realtime/pusher";
import { Channel } from "pusher-js/react-native";
import { useRef } from "react";

const logger = new Logger("useRealtime");

export function useRealtime() {
  // Use useRef instead of useState to persist channels across rerenders
  const channelsRef = useRef<Record<string, Channel>>({});

  logger.debug(`Channels: `, channelsRef.current);

  const subscribe = async (channelName: string) => {
    logger.debug(`Subscribing to channel ${channelName}`);

    // Check if already subscribed
    if (channelsRef.current[channelName]) {
      logger.debug(
        `Already subscribed to channel ${channelName}, returning existing channel`,
      );
      return channelsRef.current[channelName];
    }

    const pusher = await GetPusher();
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      logger.debug(`Subscribed to channel ${channelName}`);
    });

    channel.bind("pusher:subscription_error", (error: any) => {
      logger.error(`Subscription error for channel ${channelName}: ${error}`);
    });

    // Store in ref instead of state
    channelsRef.current[channelName] = channel;

    return channel;
  };

  const unsubscribe = async (
    channelName: string,
    callback?: (data: any) => void,
  ) => {
    logger.debug(`Unsubscribing from channel ${channelName}`);

    const channel = channelsRef.current[channelName];

    if (!channel) {
      logger.error(`Channel ${channelName} not found`);
      throw new Error(`Channel ${channelName} not found`);
    }

    channel.unsubscribe();

    // Remove from ref
    delete channelsRef.current[channelName];
  };

  const bind = (
    channelName: string,
    eventName: string,
    callback: (data: any) => void,
  ) => {
    logger.debug(`Binding to channel ${channelName}`);

    const channel = channelsRef.current[channelName];

    if (!channel) {
      logger.error(`Channel ${channelName} not found`);
      throw new Error(`Channel ${channelName} not found`);
    }

    channel.bind(eventName, callback);
  };

  const unbind = (
    channelName: string,
    eventName: string,
    callback: (data: any) => void,
  ) => {
    logger.debug(`Unbinding from channel ${channelName}`);

    const channel = channelsRef.current[channelName];

    if (!channel) {
      logger.error(`Channel ${channelName} not found`);
      throw new Error(`Channel ${channelName} not found`);
    }

    channel.unbind(eventName, callback);
  };

  return {
    subscribe,
    unsubscribe,
    bind,
    unbind,
  };
}
