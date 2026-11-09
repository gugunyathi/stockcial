import { describe, expect, it } from "vitest";
import { careMood } from "@/lib/stockcial";

describe("Stockcial demo mood", () => {
  it("starts curious before any care", () => {
    expect(careMood(0).label).toBe("curious");
  });

  it("brightens after a single care action", () => {
    expect(careMood(1).label).toBe("feeling loved");
  });

  it("reaches over the moon after four care actions", () => {
    expect(careMood(4).label).toBe("over the moon");
  });
});