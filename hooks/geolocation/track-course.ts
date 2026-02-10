import { useCallback, useEffect, useState } from "react";
import { useRealtime } from "../realtime";
import { Logger } from "@/libs/log";
import { Coords } from "@/types/geolocation";

const logger = new Logger("useTrackCourse");

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
    [],
  );

  useEffect(() => {
    if (!courseId) return;

    const setupRealtime = async () => {
      try {
        const channel = await subscribe(channelName);
        channel.bind(eventName, handleLocationUpdate);
        logger.debug(`OrderMapRoute: Subscribed to ${channelName}`);
      } catch (error) {
        logger.error("OrderMapRoute: Failed to setup realtime", error);
      }
    };

    setupRealtime();
  }, [courseId, handleLocationUpdate, channelName]);

  useEffect(() => {
    return () => {
      unbind(channelName, eventName, () => {});
      unsubscribe(channelName);
    };
  }, [channelName]);

  return {
    deliverymanCoords,
  };
}
