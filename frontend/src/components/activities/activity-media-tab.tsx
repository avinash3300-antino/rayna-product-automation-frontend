"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types/activities";

interface ActivityMediaTabProps {
  activity: Activity;
}

const IMAGE_FORMATS = [
  { key: "L", label: "L", desc: "Landscape", w: 500, h: 113 },
  { key: "S", label: "S", desc: "Square", w: 250, h: 250 },
  { key: "P", label: "P", desc: "Portrait", w: 240, h: 320 },
  { key: "2_1", label: "2:1", desc: "Wide", w: 220, h: 110 },
  { key: "3_2", label: "3:2", desc: "Standard", w: 270, h: 180 },
];

const SCALE_OPTIONS = [
  { key: "1x", label: "1x", multiplier: 1 },
  { key: "2x", label: "2x", multiplier: 2 },
  { key: "4x", label: "4x", multiplier: 4 },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Insert Cloudinary transformation params into a URL.
 * Uses c_fill + g_auto (smart gravity) to fill exact dimensions.
 */
function transformCloudinaryUrl(
  url: string,
  width: number,
  height: number
): string {
  const match = url.match(
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/
  );
  if (!match) return url;
  return `${match[1]}c_fill,g_auto,w_${width},h_${height},f_webp,q_90/${match[2]}`;
}

export function ActivityMediaTab({ activity }: ActivityMediaTabProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadImageIndex, setDownloadImageIndex] = useState<number | null>(
    null
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>(
    IMAGE_FORMATS.map((f) => f.key)
  );
  const [selectedScale, setSelectedScale] = useState("1x");
  const [downloading, setDownloading] = useState(false);
  const { data: session } = useSession();

  const scaleMultiplier =
    SCALE_OPTIONS.find((s) => s.key === selectedScale)?.multiplier ?? 1;

  // Use first gallery image as cover (copyright-safe), fallback to coverImageUrl
  const firstGalleryItem = activity.galleryJson?.[0];
  const displayCoverUrl = firstGalleryItem
    ? typeof firstGalleryItem === "string"
      ? firstGalleryItem
      : firstGalleryItem.url
    : activity.coverImageUrl;

  // Normalize gallery images to {url, alt} pairs
  const galleryImages = useMemo(
    () =>
      (activity.galleryJson ?? [])
        .map((item, idx) => {
          const url = typeof item === "string" ? item : item?.url;
          const alt =
            typeof item === "string"
              ? `${activity.name} gallery ${idx + 1}`
              : (item?.alt_text ?? `${activity.name} gallery ${idx + 1}`);
          return url ? { url, alt } : null;
        })
        .filter(Boolean) as { url: string; alt: string }[],
    [activity.galleryJson, activity.name]
  );

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (lightboxIndex === null) return;
      if (direction === "prev") {
        setLightboxIndex(
          lightboxIndex > 0 ? lightboxIndex - 1 : galleryImages.length - 1
        );
      } else {
        setLightboxIndex(
          lightboxIndex < galleryImages.length - 1 ? lightboxIndex + 1 : 0
        );
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

  const openDownloadDialog = (imageIndex: number | null) => {
    setDownloadImageIndex(imageIndex);
    setSelectedFormats(IMAGE_FORMATS.map((f) => f.key));
    setSelectedScale("1x");
    setDownloadDialogOpen(true);
  };

  const toggleFormat = (key: string) => {
    setSelectedFormats((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleDownload = async () => {
    if (selectedFormats.length === 0) {
      toast.error("Select at least one format");
      return;
    }
    setDownloading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/activities/${activity.id}/download-images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken || ""}`,
          },
          body: JSON.stringify({
            formats: selectedFormats,
            scale: selectedScale,
            image_index: downloadImageIndex,
          }),
        }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("content-disposition")
          ?.match(/filename="(.+)"/)?.[1] ||
        `${activity.slug}_gallery.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Images downloaded successfully");
      setDownloadDialogOpen(false);
    } catch {
      toast.error("Failed to download images");
    } finally {
      setDownloading(false);
    }
  };

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
          {displayCoverUrl ? (
            <div className="max-w-2xl">
              <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                <img
                  src={displayCoverUrl}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Gallery ({galleryImages.length} images)
          </CardTitle>
          {galleryImages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => openDownloadDialog(null)}
            >
              <Download className="h-3.5 w-3.5" />
              Download All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className="aspect-video rounded-lg bg-muted overflow-hidden cursor-pointer"
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
                  {/* Download button per image */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDownloadDialog(idx);
                    }}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Download this image"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
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
          <VisuallyHidden>
            <DialogTitle>Image lightbox</DialogTitle>
          </VisuallyHidden>
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

      {/* Download Dialog with Previews */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {downloadImageIndex !== null
                ? `Download Image ${downloadImageIndex + 1}`
                : "Download All Images"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Scale Selection — at top so previews update */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Scale</Label>
              <div className="flex gap-2">
                {SCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedScale(opt.key)}
                    className={cn(
                      "flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors",
                      selectedScale === opt.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Multiplies base dimensions. 2x doubles, 4x quadruples the size.
              </p>
            </div>

            {/* Format Previews */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Formats — click to select/deselect
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {IMAGE_FORMATS.map((fmt) => {
                  const isSelected = selectedFormats.includes(fmt.key);
                  const scaledW = fmt.w * scaleMultiplier;
                  const scaledH = fmt.h * scaleMultiplier;
                  // Scale down for display: cap preview thumbnails
                  const maxThumbW = 140;
                  const displayScale = Math.min(1, maxThumbW / scaledW);
                  const displayW = Math.round(scaledW * displayScale);
                  const displayH = Math.round(scaledH * displayScale);

                  // Images to preview: single image or all gallery images
                  const previewImages =
                    downloadImageIndex !== null
                      ? galleryImages[downloadImageIndex]
                        ? [galleryImages[downloadImageIndex]]
                        : []
                      : galleryImages;

                  return (
                    <button
                      key={fmt.key}
                      type="button"
                      onClick={() => toggleFormat(fmt.key)}
                      className={cn(
                        "relative flex items-start gap-4 p-3 rounded-lg border-2 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30 opacity-60"
                      )}
                    >
                      {/* Selection indicator */}
                      <div
                        className={cn(
                          "shrink-0 mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>

                      {/* Info + previews */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded">
                            {fmt.label}
                          </span>
                          <span className="text-sm font-medium">
                            {fmt.desc}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono ml-auto">
                            {scaledW} x {scaledH}px
                          </span>
                        </div>

                        {/* All image previews in a horizontal scroll */}
                        {previewImages.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {previewImages.map((img, i) => {
                              const url = transformCloudinaryUrl(
                                img.url,
                                scaledW,
                                scaledH
                              );
                              return (
                                <img
                                  key={i}
                                  src={url}
                                  alt={`${fmt.desc} ${i + 1}`}
                                  className="rounded shadow-sm shrink-0 bg-muted"
                                  style={{
                                    width: displayW,
                                    height: displayH,
                                  }}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDownloadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={downloading || selectedFormats.length === 0}
              className="gap-1.5"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading
                ? "Downloading..."
                : `Download ${selectedFormats.length} format${selectedFormats.length !== 1 ? "s" : ""} as ZIP`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
