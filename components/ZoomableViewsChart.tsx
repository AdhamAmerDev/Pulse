"use client";

import dynamic from "next/dynamic";

const ZoomableViewsChartInner = dynamic(
  () => import("./ZoomableViewsChartInner"),
  {
    ssr: false,
  },
);

export default ZoomableViewsChartInner;
