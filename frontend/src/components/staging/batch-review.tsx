"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  AlertTriangle,
  Eye,
  Shuffle,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StagingBatch, BatchProductRecord } from "@/types/staging";

interface BatchReviewProps {
  batch: StagingBatch;
  onBack: () => void;
  onApprove: (batchId: string, notes: string) => void;
  onReject: (batchId: string, notes: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CHANGE_TYPE_CONFIG = {
  created: { label: "New", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  updated: { label: "Updated", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  failed: { label: "Failed", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function BatchReview({
  batch,
  onBack,
  onApprove,
  onReject,
}: BatchReviewProps) {
  const [notes, setNotes] = useState("");
  const [previewProduct, setPreviewProduct] = useState<BatchProductRecord | null>(null);

  // Random 5 products for spot-check
  const spotCheckProducts = useMemo(() => {
    const nonFailed = batch.products.filter((p) => p.changeType !== "failed");
    const shuffled = [...nonFailed].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [batch.products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Batch Review — {batch.id}
          </h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {batch.destination}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(batch.createdAt)}
            </span>
            <span className="font-mono text-gold text-xs">
              Job: {batch.jobId.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>

      {/* Diff Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {batch.records.created}
              </p>
              <p className="text-sm text-muted-foreground">New Products</p>
            </div>
          </div>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <RefreshCw className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {batch.records.updated}
              </p>
              <p className="text-sm text-muted-foreground">Updated Products</p>
            </div>
          </div>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {batch.records.failed}
              </p>
              <p className="text-sm text-muted-foreground">Failed Records</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Products</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {batch.products.length} records in this batch
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Change</TableHead>
                <TableHead className="text-muted-foreground">Completeness</TableHead>
                <TableHead className="text-muted-foreground">Quality</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.products.slice(0, 20).map((product) => {
                const changeConfig = CHANGE_TYPE_CONFIG[product.changeType];
                return (
                  <TableRow
                    key={product.id}
                    className="border-border/50 hover:bg-navy-light/50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {product.productName}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {product.productId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize text-muted-foreground">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={changeConfig.color}>
                        {changeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-border/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gold"
                            style={{ width: `${product.completeness}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.completeness}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          product.qualityScore >= 80
                            ? "text-emerald-400"
                            : product.qualityScore >= 60
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.qualityScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewProduct(product)}
                        className="text-muted-foreground hover:text-gold"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {batch.products.length > 20 && (
          <div className="p-3 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Showing 20 of {batch.products.length} records
            </p>
          </div>
        )}
      </Card>

      {/* Preview Panel */}
      {previewProduct && (
        <Card className="border-gold/30 bg-navy-light/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Product Preview — {previewProduct.productName}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewProduct(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Product ID:</span>
              <span className="ml-2 font-mono text-foreground">
                {previewProduct.productId}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <span className="ml-2 capitalize text-foreground">
                {previewProduct.category}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Destination:</span>
              <span className="ml-2 text-foreground">
                {previewProduct.destination}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Quality Score:</span>
              <span className="ml-2 text-foreground">
                {previewProduct.qualityScore}/100
              </span>
            </div>
          </div>
          {previewProduct.changes.length > 0 && (
            <>
              <Separator className="my-4 bg-border/50" />
              <h4 className="text-sm font-medium text-foreground mb-3">
                Changes
              </h4>
              <div className="space-y-2">
                {previewProduct.changes.map((change, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm rounded-md bg-navy/50 p-3"
                  >
                    <span className="font-mono text-gold text-xs mt-0.5 shrink-0">
                      {change.field}
                    </span>
                    <div className="flex-1 min-w-0">
                      {change.oldValue && (
                        <p className="text-red-400/80 line-through truncate">
                          {change.oldValue}
                        </p>
                      )}
                      {change.newValue && (
                        <p className="text-emerald-400 truncate">
                          {change.newValue}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {/* Spot-Check Panel */}
      <Card className="border-border/50 bg-navy-light/30 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shuffle className="h-4 w-4 text-gold" />
          <h3 className="font-semibold text-foreground">
            Sample Spot-Check
          </h3>
          <span className="text-sm text-muted-foreground">
            (Random 5 products)
          </span>
        </div>
        <div className="space-y-3">
          {spotCheckProducts.map((product) => {
            const changeConfig = CHANGE_TYPE_CONFIG[product.changeType];
            return (
              <div
                key={product.id}
                className="rounded-lg border border-border/50 bg-navy/30 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {product.productName}
                    </span>
                    <Badge variant="outline" className={changeConfig.color}>
                      {changeConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="capitalize">{product.category}</span>
                    <span>Completeness: {product.completeness}%</span>
                    <span>Quality: {product.qualityScore}/100</span>
                  </div>
                </div>
                {product.changes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {product.changes.map((change, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-gold/80">
                          {change.field}
                        </span>
                        {change.oldValue && (
                          <span className="text-red-400/60 line-through">
                            {change.oldValue.slice(0, 40)}
                            {change.oldValue.length > 40 ? "..." : ""}
                          </span>
                        )}
                        <span className="text-muted-foreground">&rarr;</span>
                        {change.newValue && (
                          <span className="text-emerald-400/80">
                            {change.newValue.slice(0, 40)}
                            {change.newValue.length > 40 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Approval Form */}
      <Card className="border-border/50 bg-navy-light/30 p-5">
        <h3 className="font-semibold text-foreground mb-4">Approval Decision</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="review-notes" className="text-sm text-muted-foreground">
              Review Notes
            </Label>
            <Textarea
              id="review-notes"
              placeholder="Add your review notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 bg-navy/50 border-border/50 focus:border-gold/50 min-h-[100px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onApprove(batch.id, notes)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve &rarr; Push to Production
            </Button>
            <Button
              onClick={() => onReject(batch.id, notes)}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Batch
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
