import { Magnetometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';

const MANGETOMETER_INTERVAL = 500;

export default function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const headingHistoryRef = useRef<number[]>([]);

  // Handle normalized heading from the last 5 entries
  const handleSetHeading = useCallback((newHeading: number) => {
    headingHistoryRef.current = [...headingHistoryRef.current.slice(-4), newHeading];
    const averageHeading =
      headingHistoryRef.current.reduce((a, b) => a + b, 0) / headingHistoryRef.current.length;
    setHeading(averageHeading);
  }, []);

  useEffect(() => {
    Magnetometer.setUpdateInterval(MANGETOMETER_INTERVAL);
    const subscription = Magnetometer.addListener((data) => {
      if (!data) {
        return;
      }
      const { x, y } = data;

      let angleRad = Math.atan2(-x, y);
      if (angleRad < 0) {
        angleRad += 2 * Math.PI;
      }

      let angleDeg = angleRad * (180 / Math.PI);
      angleDeg = (angleDeg + 360) % 360;

      handleSetHeading(angleDeg);
    });

    return () => {
      subscription?.remove();
    };
  }, [handleSetHeading]);

  return heading;
}
