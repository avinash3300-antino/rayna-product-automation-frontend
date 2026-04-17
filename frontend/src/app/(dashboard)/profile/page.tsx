import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { MyProfile } from "@/components/profile/my-profile";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MyProfile />
    </Suspense>
  );
}
