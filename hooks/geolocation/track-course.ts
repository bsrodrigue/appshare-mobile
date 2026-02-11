import { useCallback, useEffect, useState, useRef } from "react";
import { useRealtime } from "../realtime";
import { Logger } from "@/libs/log";
import { Coords } from "@/modules/shared";

type DeliverymanLocationUpdate = {
  course_id: number;
  location: {
    bearing: number | null;
    lat: number;
    lng: number;
    speed: number | null;
  };
  timestamp: string;
};

interface TrackCourseProps {
  courseId: number;
}

export default function useTrackCourse({ courseId }: TrackCourseProps) {
  const logger = useRef(new Logger("useTrackCourse")).current;
  const [deliverymanCoords, setDeliverymanCoords] = useState<Coords | null>(
    null,
  );
  const { subscribe, unsubscribe, unbind } = useRealtime();

  const channelName = `private-course.${courseId}`;
  const eventName = "location-updated";

  const handleLocationUpdate = useCallback(
    (data: DeliverymanLocationUpdate) => {
      logger.debug("Deliveryman location updated", data);

      setDeliverymanCoords({
        latitude: data.location.lat,
        longitude: data.location.lng,
      });
    },
    [logger],
  );

  useEffect(() => {
    if (!courseId) return;

    const setupRealtime = async () => {
      try {
        const channel = await subscribe(channelName);
        channel.bind(eventName, handleLocationUpdate);
        logger.debug(`Subscribed to ${channelName}`);
      } catch (error) {
        logger.error(`Failed to setup realtime for ${channelName}`, error);
      }
    };

    setupRealtime();
  }, [courseId, handleLocationUpdate, channelName, logger, subscribe]);

  useEffect(() => {
    return () => {
      unbind(channelName, eventName, () => {});
      unsubscribe(channelName);
    };
  }, [channelName, unsubscribe, unbind]);

  return {
    deliverymanCoords,
  };
}
