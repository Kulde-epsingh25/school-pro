"use client";

import React, { useState } from "react";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useSchoolStore, School } from "@/store/schoolStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AVAILABLE_TENANTS: School[] = [
  { id: "tenant-sunrise", name: "Sunrise International Academy", logo: "/Images/feature1.png" },
  { id: "tenant-oakridge", name: "Oakridge Global Collegiate", logo: "/Images/feature2.png" },
  { id: "tenant-stmarks", name: "St. Mark's High School", logo: "/Images/feature3.png" },
];

export function TenantSwitcher({ className }: { className?: string }) {
  const activeSchool = useSchoolStore((state) => state.school) || AVAILABLE_TENANTS[0];
  const setSchool = useSchoolStore((state) => state.setSchool);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<School>(activeSchool);

  const handleSwitchTenant = () => {
    setSchool(selectedTenant);
    setOpenModal(false);
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/70 bg-surface-muted/50 hover:bg-surface-muted hover:border-border text-left transition-colors cursor-pointer",
          className
        )}
        aria-label="Switch Active School Institution"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0 max-w-[170px]">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
            Active Campus
          </span>
          <span className="text-xs font-semibold text-foreground truncate">
            {activeSchool.name}
          </span>
        </div>
        <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
      </button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Switch School Institution</DialogTitle>
            <DialogDescription>
              Select the school or campus tenant you wish to manage. All records, roles, and audits will be partitioned by this institution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-2">
            {AVAILABLE_TENANTS.map((tenant) => {
              const isSelected = selectedTenant.id === tenant.id;
              return (
                <div
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground shadow-xs"
                      : "border-border/70 hover:bg-muted/40 hover:border-border text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary font-bold text-xs">
                      {tenant.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{tenant.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Tenant ID: {tenant.id}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSwitchTenant}>
              Switch Institution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
