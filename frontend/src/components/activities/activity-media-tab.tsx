"use client";

import { ImageIcon, Video, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types/activities";

interface ActivityMediaTabProps {
  activity: Activity;
}

export function ActivityMediaTab({ activity }: ActivityMediaTabProps) {
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
              <p className="text-xs text-muted-foreground mt-2 break-all">
                {activity.coverImageUrl}
              </p>
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
            Gallery ({activity.galleryJson?.length ?? 0} images)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.galleryJson && activity.galleryJson.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activity.galleryJson.map((item, idx) => {
                const imgUrl = typeof item === "string" ? item : item?.url;
                const altText = typeof item === "string" ? `${activity.name} gallery ${idx + 1}` : (item?.alt_text ?? `${activity.name} gallery ${idx + 1}`);
                if (!imgUrl) return null;
                return (
                <div
                  key={idx}
                  className="relative aspect-video rounded-lg bg-muted overflow-hidden group"
                >
                  <img
                    src={imgUrl}
                    alt={altText}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {idx + 1}
                  </span>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p className="text-sm">No gallery images</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.videoUrl ? (
            <div className="flex items-center gap-2 p-3 rounded-md border text-sm">
              <Video className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate flex-1">{activity.videoUrl}</span>
              <a
                href={activity.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Video className="h-10 w-10 mb-2" />
              <p className="text-sm">No video linked</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
