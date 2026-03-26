"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/products";

interface ProductContentTabProps {
  product: Product;
  editing: boolean;
}

export function ProductContentTab({ product, editing }: ProductContentTabProps) {
  const { content } = product;

  return (
    <div className="space-y-6">
      {/* Short Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Short Description</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={content.shortDesc}
            />
          ) : (
            <p className="text-sm">
              {content.shortDesc || <EmptyField />}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Long Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Long Description</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <textarea
              className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={content.longDesc}
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">
              {content.longDesc || <EmptyField />}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Meta Title</Label>
            {editing ? (
              <Input defaultValue={content.metaTitle} />
            ) : (
              <p className="text-sm font-medium">
                {content.metaTitle || <EmptyField />}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Meta Description</Label>
            {editing ? (
              <textarea
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={content.metaDescription}
              />
            ) : (
              <p className="text-sm">
                {content.metaDescription || <EmptyField />}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            FAQ ({content.faq.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content.faq.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No FAQ items</p>
          ) : (
            <div className="space-y-4">
              {content.faq.map((item, idx) => (
                <div key={idx}>
                  {idx > 0 && <Separator className="mb-4" />}
                  {editing ? (
                    <div className="space-y-2">
                      <Input defaultValue={item.question} placeholder="Question" />
                      <textarea
                        className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue={item.answer}
                        placeholder="Answer"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">Q: {item.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        A: {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schema Markup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schema Markup (JSON-LD)</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <textarea
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              defaultValue={content.schemaMarkup}
            />
          ) : content.schemaMarkup ? (
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto font-mono">
              {content.schemaMarkup}
            </pre>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}
