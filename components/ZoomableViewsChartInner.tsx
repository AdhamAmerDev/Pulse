"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  CategoryScale,
  Filler,
} from "chart.js";
import type { Chart as ChartInstance } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  CategoryScale,
  Filler,
  zoomPlugin,
);

type Point = { bucket: string; count: number };

const LEVELS = ["month", "day", "hour", "minute"];
const LEVEL_LABELS: Record<string, string> = {
  month: "Months",
  day: "Days",
  hour: "Hours",
  minute: "Minutes",
};

const WINDOW_MS: Record<string, number> = {
  month: 365 * 24 * 60 * 60 * 1000,
  day: 90 * 24 * 60 * 60 * 1000,
  hour: 3 * 24 * 60 * 60 * 1000,
  minute: 3 * 60 * 60 * 1000,
};

function bucketToDate(bucket: string): Date {
  const [date, time = "00:00"] = bucket.split("T");
  const dateParts = date.split("-");
  const timeParts = time.split(":");
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1] || 1);
  const day = Number(dateParts[2] || 1);
  const hour = Number(timeParts[0] || 0);
  const minute = Number(timeParts[1] || 0);

  return new Date(year, month - 1, day, Number(hour), Number(minute));
}

export default function ZoomableViewsChartInner({
  siteId,
}: {
  siteId: string;
}) {
  const [data, setData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [levelIndex, setLevelIndex] = useState(1);
  const [initialCenter] = useState(() => Date.now());
  const initialHalf = WINDOW_MS["day"] / 2;

  const [windowStart, setWindowStart] = useState(initialCenter - initialHalf);
  const [windowEnd, setWindowEnd] = useState(initialCenter + initialHalf);

  const centerRef = useRef(initialCenter);
  const levelIndexRef = useRef(levelIndex);
  const wheelAccumulator = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const granularity = LEVELS[levelIndex];

  useEffect(() => {
    levelIndexRef.current = levelIndex;
  }, [levelIndex]);

  const fetchWindow = useCallback(
    async (newCenter: number, newLevelIndex: number) => {
      const thisRequestId = ++requestIdRef.current;
      const level = LEVELS[newLevelIndex];
      const half = WINDOW_MS[level] / 2;
      const start = newCenter - half;
      const end = newCenter + half;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setWindowStart(start);
      setWindowEnd(end);

      setLoading(true);
      try {
        const res = await fetch(
          `/api/sites/${siteId}/timeseries?start=${new Date(start).toISOString()}&end=${new Date(end).toISOString()}&granularity=${level}&tz=${encodeURIComponent(tz)}`,
          { signal: abortController.signal },
        );
        if (!res.ok)
          throw new Error(`Timeseries request failed: ${res.status}`);
        const json = await res.json();

        if (thisRequestId !== requestIdRef.current) return;

        setData(json.data);
        centerRef.current = newCenter;
      } catch (error) {
        if ((error as Error).name !== "AbortError") throw error;
      } finally {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      }
    },
    [siteId],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      wheelAccumulator.current += direction;

      if (Math.abs(wheelAccumulator.current) >= 2) {
        const step = wheelAccumulator.current > 0 ? 1 : -1;
        wheelAccumulator.current = 0;

        const next = Math.min(
          LEVELS.length - 1,
          Math.max(0, levelIndexRef.current + step),
        );
        if (next !== levelIndexRef.current) {
          setLevelIndex(next);
          fetchWindow(centerRef.current, next);
        }
      }
    }

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [fetchWindow]);

  useEffect(() => {
    fetchWindow(centerRef.current, levelIndexRef.current);
  }, [fetchWindow]);

  function handlePanComplete({ chart }: { chart: ChartInstance }) {
    const { min, max } = chart.scales.x;
    const newCenter = (min + max) / 2;
    fetchWindow(newCenter, levelIndexRef.current);
  }

  const currentRange =
    data.length > 0
      ? `${bucketToDate(data[0].bucket).toLocaleString()} — ${bucketToDate(data[data.length - 1].bucket).toLocaleString()}`
      : "";

  const chartData = {
    labels: data.map((d) => bucketToDate(d.bucket)),
    datasets: [
      {
        label: "Views",
        data: data.map((d) => d.count),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    scales: {
      x: {
        type: "time" as const,
        min: windowStart,
        max: windowEnd,
        time: {
          unit: granularity as "minute" | "hour" | "day" | "month",
          tooltipFormat: "PPpp",
          displayFormats: {
            minute: "h:mm a",
            hour: "h a",
            day: "MMM d",
            month: "MMM yyyy",
          },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 10,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
      },
      zoom: {
        zoom: { wheel: { enabled: false } },
        pan: {
          enabled: true,
          mode: "x" as const,
          onPanComplete: handlePanComplete,
        },
      },
    },
  };

  return (
    <div>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
        Viewing by <strong>{LEVEL_LABELS[granularity]}</strong> — {currentRange}
      </p>
      <div
        ref={containerRef}
        style={{ position: "relative", height: "300px", width: "100%" }}
      >
        <Line data={chartData} options={options} />
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
}
