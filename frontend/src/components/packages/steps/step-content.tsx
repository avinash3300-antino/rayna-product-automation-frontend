"use client";

import { Sparkles, Loader2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PackageGeneratedContent } from "@/types/packages";

interface StepContentProps {
  generatedContent: PackageGeneratedContent | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onContentChange: (content: PackageGeneratedContent) => void;
}

export function StepContent({
  generatedContent,
  isGenerating,
  onGenerate,
  onContentChange,
}: StepContentProps) {
  return (
    <div className="space-y-4">
      {/* Generate Button */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">AI Content Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="bg-navy hover:bg-navy-light"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : "Generate Package Content"}
            </Button>
            <p className="text-xs text-muted-foreground">
              AI will generate a package name, description, day-by-day itinerary, and tag suggestions based on selected components.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content Preview */}
      {generatedContent?.isGenerated && (
        <>
          {/* Name & Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Package Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Generated Name</Label>
                <Input
                  value={generatedContent.name}
                  onChange={(e) =>
                    onContentChange({ ...generatedContent, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  value={generatedContent.description}
                  onChange={(e) =>
                    onContentChange({
                      ...generatedContent,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          {generatedContent.itinerary.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Day-by-Day Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {generatedContent.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="rounded-md border p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Day {day.day}
                      </Badge>
                      <span className="text-sm font-semibold">{day.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {day.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {day.activities.map((activity, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tag Suggestions */}
          {generatedContent.suggestedTags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Suggested Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.suggestedTags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag.dimension}: {tag.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!generatedContent?.isGenerated && !isGenerating && (
        <div className="rounded-md border border-dashed p-12 text-center">
          <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Click &quot;Generate Package Content&quot; to create AI-powered descriptions and itinerary.
          </p>
        </div>
      )}
    </div>
  );
}
