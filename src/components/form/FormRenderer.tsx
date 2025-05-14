"use client";

import React, { useState } from "react";
import InputForm from "./InputForm";
import DropModeButtons from "./DropButtons";
import { Button } from "@/components/ui/button";

const FormRenderer = () => {
  const [formType, setFormType] = useState<"manual" | "drop">("drop");

  return (
    <div className="space-y-4 z-30 justify-center items-center">
      <div>
        <Button
          variant="outline"
          className="z-20 cursor-pointer"
          onClick={() =>
            setFormType((prev) => (prev === "manual" ? "drop" : "manual"))
          }
        >
          Switch to {formType === "manual" ? "Drop Mode" : "Manual Input"}
        </Button>
      </div>

      <div className="mt-4">
        {formType === "manual" ? <InputForm /> : <DropModeButtons />}
      </div>
    </div>
  );
};

export default FormRenderer;
