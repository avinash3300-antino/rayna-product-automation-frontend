"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PACKAGE_TYPE_DEFINITIONS } from "@/lib/mock-packages";
import type { PackageTypeId } from "@/types/packages";
import { PackageTypeCard } from "./package-type-card";

interface PackageTypeSelectorProps {
  selectedTypeId: PackageTypeId | null;
  onSelectType: (typeId: PackageTypeId) => void;
}

export function PackageTypeSelector({
  selectedTypeId,
  onSelectType,
}: PackageTypeSelectorProps) {
  return (
    <div className="w-80 shrink-0">
      <h3 className="text-sm font-semibold mb-3">Package Type</h3>
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-2 pr-2">
          {PACKAGE_TYPE_DEFINITIONS.map((typeDef) => (
            <PackageTypeCard
              key={typeDef.id}
              typeDef={typeDef}
              isSelected={selectedTypeId === typeDef.id}
              onSelect={() => onSelectType(typeDef.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
