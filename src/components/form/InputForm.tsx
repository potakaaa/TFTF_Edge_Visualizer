"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouteStore } from "@/store/path";
import { getRouteData } from "@/services/route_service";

const formSchema = z.object({
  originLat: z.string(),
  originLng: z.string(),
  destinationLat: z.string(),
  destinationLng: z.string(),
});

const InputForm = () => {
  const usePathStore = useRouteStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originLat: "8.4791",
      originLng: "124.6458",
      destinationLat: "8.4850",
      destinationLng: "124.6510",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      usePathStore.setRouteData({
        fare: 0,
        geojson: { type: "FeatureCollection", features: [] },
        route_names: [],
      });

      const queryParams = new URLSearchParams({
        fromLat: values.originLat,
        fromLong: values.originLng,
        toLat: values.destinationLat,
        toLong: values.destinationLng,
      });
      const data = await getRouteData(
        {
          lat: parseFloat(values.originLat),
          lng: parseFloat(values.originLng),
        },
        {
          lat: parseFloat(values.destinationLat),
          lng: parseFloat(values.destinationLng),
        }
      );
      console.log("Route data:", data);
      usePathStore.setRouteData(data);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-full items-center z-30"
      >
        <div className="flex w-full gap-2 justify-center">
          <FormField
            control={form.control}
            name="originLat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin Lat</FormLabel>
                <FormControl>
                  <Input placeholder="8.4791" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originLng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin Long</FormLabel>
                <FormControl>
                  <Input placeholder="124.6458" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full gap-2 justify-center">
          <FormField
            control={form.control}
            name="destinationLat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Lat</FormLabel>
                <FormControl>
                  <Input placeholder="8.4850" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinationLng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Long</FormLabel>
                <FormControl>
                  <Input placeholder="124.6510" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full max-w-md">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default InputForm;
