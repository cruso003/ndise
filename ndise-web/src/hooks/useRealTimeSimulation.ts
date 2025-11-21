import { useState, useEffect, useCallback } from 'react';

export interface RealTimeConfig {
  interval: number; // milliseconds
  maxItems: number;
  autoStart?: boolean;
}

/**
 * Hook for simulating real-time data updates
 * Creates the illusion of live data by periodically generating new items
 * @param generator Function that generates a new item
 * @param config Configuration for interval and max items
 * @returns Array of items, controls, and metadata
 */
export function useRealTimeSimulation<T extends { id: string | number }>(
  generator: () => T,
  config: RealTimeConfig
) {
  const { interval, maxItems, autoStart = true } = config;

  const [items, setItems] = useState<T[]>([]);
  const [isActive, setIsActive] = useState(autoStart);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [totalGenerated, setTotalGenerated] = useState(0);

  const addItem = useCallback(() => {
    const newItem = generator();
    setItems(prev => {
      // Add new item at the beginning
      const updated = [newItem, ...prev];
      // Keep only maxItems
      return updated.slice(0, maxItems);
    });
    setLastUpdate(new Date());
    setTotalGenerated(prev => prev + 1);
  }, [generator, maxItems]);

  useEffect(() => {
    if (!isActive) return;

    // Generate initial items
    if (items.length === 0) {
      const initialItems: T[] = [];
      const initialCount = Math.min(5, maxItems);
      for (let i = 0; i < initialCount; i++) {
        initialItems.push(generator());
      }
      setItems(initialItems);
      setTotalGenerated(initialCount);
    }

    // Set up interval for new items
    const intervalId = setInterval(() => {
      addItem();
    }, interval);

    return () => clearInterval(intervalId);
  }, [isActive, interval, addItem, items.length, maxItems, generator]);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);
  const toggle = useCallback(() => setIsActive(prev => !prev), []);
  const clear = useCallback(() => {
    setItems([]);
    setTotalGenerated(0);
  }, []);

  return {
    items,
    isActive,
    lastUpdate,
    totalGenerated,
    controls: {
      start,
      stop,
      toggle,
      clear,
      addItem,
    },
  };
}

/**
 * Hook for simulating periodic metric updates
 * Updates a metric value at regular intervals
 */
export function useRealTimeMetric(
  initialValue: number,
  updateFn: (current: number) => number,
  interval: number = 5000,
  autoStart: boolean = true
) {
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(autoStart);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      setValue(updateFn);
      setLastUpdate(new Date());
    }, interval);

    return () => clearInterval(intervalId);
  }, [isActive, interval, updateFn]);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);
  const toggle = useCallback(() => setIsActive(prev => !prev), []);
  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return {
    value,
    isActive,
    lastUpdate,
    controls: {
      start,
      stop,
      toggle,
      reset,
    },
  };
}

/**
 * Hook for connection status simulation
 * Simulates online/offline status with occasional changes
 */
export function useConnectionStatus(
  changeInterval: number = 60000, // Check every minute
  disconnectProbability: number = 0.05 // 5% chance of disconnect
) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastStatusChange, setLastStatusChange] = useState<Date>(new Date());
  const [uptimePercentage, setUptimePercentage] = useState(99.97);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly change status based on probability
      if (Math.random() < disconnectProbability) {
        setIsOnline(prev => {
          if (prev !== false) {
            setLastStatusChange(new Date());
            // Decrease uptime slightly
            setUptimePercentage(p => Math.max(95, p - 0.01));
          }
          return false;
        });

        // Reconnect after 2-5 seconds
        setTimeout(() => {
          setIsOnline(true);
          setLastStatusChange(new Date());
        }, 2000 + Math.random() * 3000);
      }
    }, changeInterval);

    return () => clearInterval(intervalId);
  }, [changeInterval, disconnectProbability]);

  return {
    isOnline,
    lastStatusChange,
    uptimePercentage,
  };
}
