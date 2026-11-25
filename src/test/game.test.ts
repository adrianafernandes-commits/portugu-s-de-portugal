import { describe, it, expect } from "vitest";
import { canScan, shouldPromptLead, isValidEmail } from "@/lib/game";
import { lcm } from "@/lib/fractions";

describe("regras do FractionQuest", () => {
  it("permite só 2 verificações grátis", () => {
    expect(canScan({ scans: 1, master: false })).toBe(true);
    expect(canScan({ scans: 2, master: false })).toBe(false);
    expect(canScan({ scans: 50, master: true })).toBe(true);
  });
  it("pede email após a 2.ª verificação ou 3 fusões", () => {
    expect(shouldPromptLead({ scans: 2, merges: 0, email: null })).toBe(true);
    expect(shouldPromptLead({ scans: 0, merges: 3, email: null })).toBe(true);
    expect(shouldPromptLead({ scans: 1, merges: 2, email: null })).toBe(false);
    expect(shouldPromptLead({ scans: 2, merges: 3, email: "a@b.pt" })).toBe(false);
  });
  it("valida email e mmc", () => {
    expect(isValidEmail("marta@mail.pt")).toBe(true);
    expect(isValidEmail("marta@")).toBe(false);
    expect(lcm(2, 3)).toBe(6);
  });
});
