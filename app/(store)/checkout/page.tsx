import { Suspense } from "react";
import { PageLoader } from "@/components/common/loaders/PageLoader";
import { CheckoutPageClient } from "./CheckoutPageClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading Checkout..." variant="text" />}>
      <CheckoutPageClient />
    </Suspense>
  );
}
