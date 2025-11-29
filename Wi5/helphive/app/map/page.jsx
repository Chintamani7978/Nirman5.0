"use client";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("./map-components"), { ssr: false });

export default function Page() {
  return <div className="h-screen"><Map /></div>;
}
