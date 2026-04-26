"use client";

import { useState, useEffect, useCallback } from "react";
import { ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/types/activities";

interface ActivityMediaTabProps {
  activity: Activity;
}

export function ActivityMediaTab({ activity }: ActivityMediaTabProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize gallery images to {url, alt} pairs
  const galleryImages = (activity.galleryJson ?? [])
    .map((item, idx) => {
      const url = typeof item === "string" ? item : item?.url;
      const alt =
        typeof item === "string"
          ? `${activity.name} gallery ${idx + 1}`
          : item?.alt_text ?? `${activity.name} gallery ${idx + 1}`;
      return url ? { url, alt } : null;
    })
    .filter(Boolean) as { url: string; alt: string }[];

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (lightboxIndex === null) return;
      if (direction === "prev") {
        setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : galleryImages.length - 1);
      } else {
        setLightboxIndex(lightboxIndex < galleryImages.length - 1 ? lightboxIndex + 1 : 0);
      }
    },
    [lightboxIndex, galleryImages.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      else if (e.key === "ArrowRight") navigateLightbox("next");
      else if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, navigateLightbox]);

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Cover Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.coverImageUrl ? (
            <div className="max-w-2xl">
              <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                <img
                  src={activity.coverImageUrl}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p className="text-sm">No cover image</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Gallery ({galleryImages.length} images)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-lg bg-muted overflow-hidden group cursor-pointer"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p className="text-sm">No gallery images</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/95 [&>button]:hidden">
          <VisuallyHidden><DialogTitle>Image lightbox</DialogTitle></VisuallyHidden>
          {lightboxIndex !== null && galleryImages[lightboxIndex] && (
            <div className="relative flex items-center justify-center w-full h-[90vh]">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 text-white hover:bg-white/20 h-9 w-9"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Previous button */}
              {galleryImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 z-10 text-white hover:bg-white/20 h-10 w-10"
                  onClick={() => navigateLightbox("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {/* Image */}
              <img
                src={galleryImages[lightboxIndex].url}
                alt={galleryImages[lightboxIndex].alt}
                className="max-w-full max-h-[85vh] object-contain"
              />

              {/* Next button */}
              {galleryImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 z-10 text-white hover:bg-white/20 h-10 w-10"
                  onClick={() => navigateLightbox("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {galleryImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
