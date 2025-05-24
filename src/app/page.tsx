import React from "react";
import ClientMapWrapper from "@/components/map/MapContainer";
import { cn } from "@/lib/utils";
import InputForm from "@/components/form/InputForm";
import FormRenderer from "@/components/form/FormRenderer";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-10">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] z-0 opacity-50"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute inset-0 flex justify-center items-center bg-white dark:bg-black pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <section className="z-10 flex flex-col justify-center items-center gap-2">
        <h1 className="font-bold text-4xl">TFTF Edge Visualizer</h1>
        <p className="mb-4 font-light text-sm">
          by Helbiro, Del Mundo, Narisma
        </p>
        <p className="max-w-lg text-sm text-center">
          TFTF Edge is a novel data structure that models{" "}
          <strong>flexible public transport routes</strong> by capturing{" "}
          <strong>dynamic transfers, stops, and fare computations</strong> in a
          unified graph-based system.
        </p>
      </section>
      <section className="flex flex-col justify-center items-center gap-14 w-full">
        <div className="flex flex-col justify-center items-center my-3 w-full max-w-screen-xl h-[500px]">
          <ClientMapWrapper />
          <div className="flex flex-col justify-center items-center gap-2"></div>
        </div>
        <FormRenderer />
      </section>
    </div>
  );
};

export default page;

// ./algo 8.487358 124.629950 "Patag Camp Evangelista" 8.484763 124.655977 "USTP" 100 10

// http://127.0.0.1:8000/api/routes?fromLat=8.50881&fromLong=124.64827&fromName=Bonbon&toLat=8.51133&toLong=124.62429&toName=Westbound Bulua Terminal&transMeter=100.50&hour=10
