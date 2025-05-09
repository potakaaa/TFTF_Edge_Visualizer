"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouteStore } from "@/store/path";

const formSchema = z.object({
  originName: z.string(),
  originLat: z.string(),
  originLng: z.string(),
  destinationLat: z.string(),
  destinationLng: z.string(),
  destinationName: z.string(),
  transferMeters: z.string(),
  hour: z.string(),
});

const InputForm = () => {
  const usePathStore = useRouteStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originName: "Patag Camp Evangelista",
      originLat: "8.487358",
      originLng: "124.629950",
      destinationLat: "8.484763",
      destinationLng: "124.655977",
      destinationName: "USTP",
      transferMeters: "100.0",
      hour: "10",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("clicked");

    try {
      // Clear existing route data
      usePathStore.setRouteData({
        From: { Lattitude: 0, Longitude: 0, "Origin Name": "" },
        To: { Lattitude: 0, Longitude: 0, "Destination Name": "" },
        "Transfer Range": 0,
        Routes: [],
        Coordinates: [],
        GeoJSON: { type: "FeatureCollection", features: [] },
      });

      const queryParams = new URLSearchParams({
        fromLat: values.originLat,
        fromLong: values.originLng,
        fromName: values.originName,
        toLat: values.destinationLat,
        toLong: values.destinationLng,
        toName: values.destinationName,
        transMeter: values.transferMeters,
        hour: values.hour,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/routes?${queryParams}`
      );
      const data = await response.json();
      console.log(data);
      usePathStore.setRouteData(data);
      console.log("Coordinates from state: ", usePathStore.coordinates);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 z-10 flex flex-col w-full justify-center items-center"
      >
        <div className="flex w-full gap-2 items-end justify-center">
          <FormField
            control={form.control}
            name="originName"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel className="text-left self-start">Origin</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                {/* <FormDescription>The name of the origin</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originLat"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <Input placeholder="Lattitude" {...field} />
                </FormControl>
                {/* <FormDescription>The lattitude of the origin</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originLng"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <Input placeholder="Longitude" {...field} />
                </FormControl>
                {/* <FormDescription>The longitude of the origin</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transferMeters"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center ml-5">
                <FormLabel className="text-left self-start">
                  Transfer Meters
                </FormLabel>
                <FormControl>
                  <Input placeholder="Meters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full gap-2 items-end justify-center">
          <FormField
            control={form.control}
            name="destinationName"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel className="text-left self-start">
                  Destination
                </FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinationLat"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <Input placeholder="Lattitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinationLng"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <Input placeholder="Longitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center ml-5">
                <FormLabel className="text-left self-start">
                  Commute Hour
                </FormLabel>
                <FormControl>
                  <Input placeholder="Hour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full max-w-md hover:cursor-pointer">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default InputForm;
