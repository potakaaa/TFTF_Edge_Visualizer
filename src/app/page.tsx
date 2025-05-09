import React from "react";
import ClientMapWrapper from "@/components/map/MapContainer";
import { cn } from "@/lib/utils";
import InputForm from "@/components/form/InputForm";

const page = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-4 p-10">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] z-0 opacity-50"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      <section className="z-10 flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">TFTF Edge Visualizer</h1>
        <p className="text-sm max-w-lg text-center">
          TFTF Edge is a novel data structure that models{" "}
          <strong>flexible public transport routes</strong> by capturing{" "}
          <strong>
            dynamic transfers, time schedules, and fare computations
          </strong>{" "}
          in a unified graph-based system.
        </p>
      </section>
      <div className="w-full h-[500px] max-w-screen-lg my-3">
        <ClientMapWrapper />
      </div>
      <InputForm />
    </div>
  );
};

export default page;

// ./algo 8.487358 124.629950 "Patag Camp Evangelista" 8.484763 124.655977 "USTP" 100 10
