// Asset & Procurement Intelligence Engine
import { InventoryItem, PurchaseOrder, POStatus } from "@/types/advanced-features";

/**
 * Calculates current book value and accumulated depreciation for an asset.
 */
export function calculateAssetDepreciation(
  purchaseCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  purchaseDate: string,
  method: "STRAIGHT_LINE" | "DECLINING_BALANCE" = "STRAIGHT_LINE"
) {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  const ageInYears = Math.max(0, (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  const depreciableBase = Math.max(0, purchaseCost - salvageValue);

  if (method === "STRAIGHT_LINE") {
    const annualDepreciation = usefulLifeYears > 0 ? depreciableBase / usefulLifeYears : 0;
    const accumulated = Math.min(depreciableBase, annualDepreciation * ageInYears);
    const currentValue = Math.max(salvageValue, purchaseCost - accumulated);

    return {
      annualDepreciationRate: annualDepreciation,
      accumulatedDepreciation: Number(accumulated.toFixed(2)),
      currentBookValue: Number(currentValue.toFixed(2)),
      isFullyDepreciated: ageInYears >= usefulLifeYears,
    };
  } else {
    // Double Declining Balance (DDB)
    const rate = usefulLifeYears > 0 ? (2 / usefulLifeYears) : 0;
    let current = purchaseCost;
    const years = Math.floor(ageInYears);

    for (let i = 0; i < years; i++) {
      const dep = current * rate;
      current = Math.max(salvageValue, current - dep);
    }

    const partialYear = ageInYears - years;
    if (partialYear > 0) {
      const dep = current * rate * partialYear;
      current = Math.max(salvageValue, current - dep);
    }

    const accumulated = Math.max(0, purchaseCost - current);
    return {
      annualDepreciationRate: current * rate,
      accumulatedDepreciation: Number(accumulated.toFixed(2)),
      currentBookValue: Number(current.toFixed(2)),
      isFullyDepreciated: current <= salvageValue,
    };
  }
}

/**
 * Evaluates required approval tier for a Purchase Order
 */
export function determinePOApprovalLevel(totalAmount: number): "BURSAR_ONLY" | "PRINCIPAL_REQUIRED" | "BOARD_REQUIRED" {
  if (totalAmount > 10000) {
    return "BOARD_REQUIRED";
  }
  if (totalAmount > 1500) {
    return "PRINCIPAL_REQUIRED";
  }
  return "BURSAR_ONLY";
}

/**
 * Checks if a user's role satisfies the required approval level
 */
export function canUserApprovePO(userRole: string, requiredLevel: "BURSAR_ONLY" | "PRINCIPAL_REQUIRED" | "BOARD_REQUIRED"): boolean {
  if (userRole === "saas_super_admin" || userRole === "board_member") return true;
  if (userRole === "super_admin" || userRole === "principal") {
    return requiredLevel !== "BOARD_REQUIRED";
  }
  if (userRole === "bursar" || userRole === "finance_officer") {
    return requiredLevel === "BURSAR_ONLY";
  }
  return false;
}
