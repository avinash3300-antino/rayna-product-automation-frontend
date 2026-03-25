"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourceDirectory } from "./source-directory";
import { ProductMappings } from "./product-mappings";
import { HealthMonitor } from "./health-monitor";

export function BookingSourceMapper() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Booking Source Mapper
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage booking sources, map products to suppliers, and monitor
          connection health.
        </p>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Source Directory</TabsTrigger>
          <TabsTrigger value="mappings">Product Mappings</TabsTrigger>
          <TabsTrigger value="health">Health Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <SourceDirectory />
        </TabsContent>

        <TabsContent value="mappings">
          <ProductMappings />
        </TabsContent>

        <TabsContent value="health">
          <HealthMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
