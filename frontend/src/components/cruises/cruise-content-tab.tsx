"use client";

import {
  FileText,
  ListChecks,
  CheckCircle2,
  XCircle,
  Backpack,
  AlertTriangle,
  TicketCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cruise } from "@/types/cruises";

interface CruiseContentTabProps {
  cruise: Cruise;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

export function CruiseContentTab({ cruise }: CruiseContentTabProps) {
  return (
    <div className="space-y-6">
      {/* Short Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Short Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {cruise.descriptionShort || <EmptyField />}
          </p>
        </CardContent>
      </Card>

      {/* Long Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Long Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.descriptionLong ? (
            <div
              className="text-sm prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: cruise.descriptionLong }}
            />
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Highlights ({cruise.highlights?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.highlights && cruise.highlights.length > 0 ? (
            <ul className="space-y-2">
              {cruise.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-[#C9A84C] mt-1 shrink-0">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Included / Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Included ({cruise.included?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cruise.included && cruise.included.length > 0 ? (
              <ul className="space-y-2">
                {cruise.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyField />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Excluded ({cruise.excluded?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cruise.excluded && cruise.excluded.length > 0 ? (
              <ul className="space-y-2">
                {cruise.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-3.5 w-3.5 mt-0.5 text-red-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyField />
            )}
          </CardContent>
        </Card>
      </div>

      {/* What to Bring */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Backpack className="h-4 w-4" />
            What to Bring
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.whatToBring ? (
            <p className="text-sm whitespace-pre-wrap">{cruise.whatToBring}</p>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Important Notes ({cruise.importantNotes?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.importantNotes && cruise.importantNotes.length > 0 ? (
            <ul className="space-y-2">
              {cruise.importantNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-amber-500 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Redemption Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TicketCheck className="h-4 w-4" />
            Redemption Instructions ({cruise.redemptionInstructions?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.redemptionInstructions && cruise.redemptionInstructions.length > 0 ? (
            <ol className="space-y-2 list-decimal list-inside">
              {cruise.redemptionInstructions.map((instruction, idx) => (
                <li key={idx} className="text-sm">
                  {instruction}
                </li>
              ))}
            </ol>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
