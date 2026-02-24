import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  let mockDate: Date;

  beforeEach(() => {
    // Mock current date as February 24, 2026
    mockDate = new Date("2026-02-24T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("absolute date formatting", () => {
    it("should format a valid ISO date string", () => {
      const result = formatDate("2026-02-24");
      expect(result).toBe("February 24, 2026");
    });

    it("should format a date with time component", () => {
      const result = formatDate("2026-02-24T10:30:00");
      expect(result).toBe("February 24, 2026");
    });

    it("should add T00:00:00 to date strings without time", () => {
      const result = formatDate("2026-01-15");
      expect(result).toBe("January 15, 2026");
    });

    it("should handle dates from different years", () => {
      const result = formatDate("2024-12-31");
      expect(result).toBe("December 31, 2024");
    });

    it("should handle dates from different months", () => {
      const result = formatDate("2026-01-01");
      expect(result).toBe("January 1, 2026");
    });

    it("should format single digit days correctly", () => {
      const result = formatDate("2026-03-05");
      expect(result).toBe("March 5, 2026");
    });
  });

  describe("relative date formatting", () => {
    it("should return 'Today' when date is today", () => {
      const result = formatDate("2026-02-24", true);
      expect(result).toContain("(Today)");
      expect(result).toContain("February 24, 2026");
    });

    it("should show days ago for recent dates", () => {
      const result = formatDate("2026-02-20", true);
      expect(result).toContain("4d ago");
    });

    it("should show months ago for older dates in same year", () => {
      const result = formatDate("2026-01-15", true);
      expect(result).toContain("1mo ago");
    });

    it("should show years ago for very old dates", () => {
      const result = formatDate("2024-02-24", true);
      expect(result).toContain("2y ago");
    });

    it("should include full date with relative format", () => {
      const result = formatDate("2026-02-20", true);
      expect(result).toContain("February 20, 2026");
      expect(result).toContain("4d ago");
    });

    it("should handle 1 year ago correctly", () => {
      const result = formatDate("2025-02-24", true);
      expect(result).toContain("1y ago");
    });

    it("should handle 1 month ago correctly", () => {
      const result = formatDate("2026-01-24", true);
      expect(result).toContain("1mo ago");
    });

    it("should handle 1 day ago correctly", () => {
      const result = formatDate("2026-02-23", true);
      expect(result).toContain("1d ago");
    });
  });

  describe("edge cases", () => {
    it("should handle leap year dates", () => {
      const result = formatDate("2024-02-29");
      expect(result).toBe("February 29, 2024");
    });

    it("should handle first day of month", () => {
      const result = formatDate("2026-03-01");
      expect(result).toBe("March 1, 2026");
    });

    it("should handle last day of month", () => {
      const result = formatDate("2026-02-28");
      expect(result).toBe("February 28, 2026");
    });

    it("should handle dates with timezone offset", () => {
      const result = formatDate("2026-02-24T15:30:00+05:00");
      expect(result).toContain("2026");
    });

    it("should handle year boundary transitions", () => {
      const result = formatDate("2025-12-31");
      expect(result).toBe("December 31, 2025");
    });
  });

  describe("format consistency", () => {
    it("should use long month names", () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      months.forEach((month, index) => {
        const monthNum = String(index + 1).padStart(2, "0");
        const result = formatDate(`2026-${monthNum}-15`);
        expect(result).toContain(month);
        expect(result).toContain("15, 2026");
      });
    });

    it("should always include comma before year in absolute format", () => {
      const result = formatDate("2026-02-24");
      expect(result).toMatch(/\d+, \d{4}/);
    });

    it("should return consistent format for same date", () => {
      const date = "2026-02-24";
      const result1 = formatDate(date);
      const result2 = formatDate(date);
      expect(result1).toBe(result2);
    });
  });
});
