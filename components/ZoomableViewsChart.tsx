"use client";

import dynamic from "next/dynamic";

const ZoomableViewsChartInner = dynamic(
  () => import("./ZoomableViewsChartInner"),
  {
    ssr: false,
    loading: () => <p>Loading chart...</p>,
  },
);

export default ZoomableViewsChartInner;
