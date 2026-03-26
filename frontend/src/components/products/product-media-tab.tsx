"use client";

import { ImageIcon, Video, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";

interface ProductMediaTabProps {
  product: Product;
  editing: boolean;
}

export function ProductMediaTab({ product, editing }: ProductMediaTabProps) {
  const { media } = product;

  return (
    <div className="space-y-6">
      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images ({media.images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {media.images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2" />
              <p className="text-sm">No images uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-lg bg-muted overflow-hidden group"
                >
                  <img
                    src={url}
                    alt={`${product.name} image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Hero
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {editing && (
            <Button variant="outline" size="sm" className="mt-4">
              Add Images
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos ({media.videos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {media.videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Video className="h-10 w-10 mb-2" />
              <p className="text-sm">No videos linked</p>
            </div>
          ) : (
            <div className="space-y-2">
              {media.videos.map((url, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-md border text-sm"
                >
                  <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1">{url}</span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
          {editing && (
            <Button variant="outline" size="sm" className="mt-4">
              Add Video URL
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
