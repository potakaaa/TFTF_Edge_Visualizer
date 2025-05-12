"use client";

import { useRouteStore } from "@/store/path";
import { Button } from "@/components/ui/button";

export default function DropModeButtons() {
  const dropMode = useRouteStore((state) => state.dropMode);
  const setDropMode = useRouteStore((state) => state.setDropMode);

  return (
    <div className="flex gap-2">
      <Button
        variant={dropMode === "start" ? "default" : "outline"}
        onClick={() => setDropMode("start")}
      >
        Set Start
      </Button>
      <Button
        variant={dropMode === "end" ? "default" : "outline"}
        onClick={() => setDropMode("end")}
      >
        Set End
      </Button>
    </div>
  );
}
