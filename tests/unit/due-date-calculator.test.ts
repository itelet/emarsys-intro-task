const calculateDueDate = require("../../src/dueDateCalculator");

describe("due-date-calculator", () => {
  it("default test case", () => {
    let submitDate = new Date(2025, 3, 15, 14, 12);
    let turnaroundTime = 16;

    const expectedOutput = new Date(2025, 3, 17, 14, 12);

    const result = calculateDueDate({ submitDate, turnaroundTime });
    expect(result).toEqual(expectedOutput);
  });

  describe("failing test cases", () => {
    it("should throw an error if submitDate is not a Date object", () => {
      const invalidDate = "2025-04-15T14:11:00Z";
      const turnaroundTime = 16;

      console.log("invalidDate: ", invalidDate);

      expect(() => {
        calculateDueDate({ submitDate: invalidDate, turnaroundTime });
      }).toThrow("Submit date must be a valid Date object");
    });

    it("should throw an error if submitDate is invalid", () => {
      const invalidDate = new Date("invalid-date");
      const turnaroundTime = 16;

      expect(() => {
        calculateDueDate({ submitDate: invalidDate, turnaroundTime });
      }).toThrow("Submit date must be a valid Date object");
    });

    it("should throw an error if turnaroundTime is not a number", () => {
      const invalidDate = new Date(2025, 3, 15, 14, 12);
      const turnaroundTime = "invalid-time";

      expect(() => {
        calculateDueDate({ submitDate: invalidDate, turnaroundTime });
      }).toThrow("Turnaround time must be a positive number");
    });

    it("should throw an error if turnaroundTime is negative", () => {
      const invalidDate = new Date(2025, 3, 15, 14, 12);
      const turnaroundTime = -16;

      expect(() => {
        calculateDueDate({ submitDate: invalidDate, turnaroundTime });
      }).toThrow("Turnaround time must be a positive number");
    });

    it("should throw an error if submitDate is on a weekend", () => {
      const invalidDate = new Date(2025, 3, 19, 14, 12);
      const turnaroundTime = 8;

      expect(() => {
        calculateDueDate({ submitDate: invalidDate, turnaroundTime });
      }).toThrow("Submit date must be during a work day (Monday to Friday)");
    });

    it("should throw an error if submitDate is outside working hours", () => {
      const invalidDate = new Date(2025, 3, 15, 18, 12);
      const turnaroundTime = 8;

      expect(() => {
        calculateDueDate({ submitDate: invalidDate, turnaroundTime });
      }).toThrow("Submit date must be during working hours (9AM to 5PM)");
    });
  });

  describe("successful test cases", () => {
    it("entry + 4 hours", () => {
      let submitDate = new Date(2025, 3, 15, 10, 12);
      let turnaroundTime = 4;

      const expectedOutput = new Date(2025, 3, 15, 14, 12);

      const result = calculateDueDate({ submitDate, turnaroundTime });
      expect(result).toEqual(expectedOutput);
    });

    it("entry + 8 hours", () => {
      let submitDate = new Date(2025, 3, 15, 10, 12);
      let turnaroundTime = 8;

      const expectedOutput = new Date(2025, 3, 16, 10, 12);

      const result = calculateDueDate({ submitDate, turnaroundTime });
      expect(result).toEqual(expectedOutput);
    });

    it("entry + 9 hours", () => {
      let submitDate = new Date(2025, 3, 15, 9, 0);
      let turnaroundTime = 9;

      const expectedOutput = new Date(2025, 3, 16, 10, 0);

      const result = calculateDueDate({ submitDate, turnaroundTime });
      expect(result).toEqual(expectedOutput);
    });

    it("entry + 16 hours", () => {
      let submitDate = new Date(2025, 3, 15, 9, 0);
      let turnaroundTime = 16;

      const expectedOutput = new Date(2025, 3, 17, 9, 0);

      const result = calculateDueDate({ submitDate, turnaroundTime });
      expect(result).toEqual(expectedOutput);
    });

    it("entry + 1 working week in hours (40)", () => {
      let submitDate = new Date(2025, 3, 15, 9, 0);
      let turnaroundTime = 40;

      const expectedOutput = new Date(2025, 3, 22, 9, 0);

      const result = calculateDueDate({ submitDate, turnaroundTime });
      expect(result).toEqual(expectedOutput);
    });
  });

  describe("edge cases", () => {
    it("should handle weekend", () => {
      let submitDate = new Date(2025, 3, 18, 15, 0);
      let turnaroundTime = 3;

      const expectedOutput = new Date(2025, 3, 21, 10, 0);

      const result = calculateDueDate({ submitDate, turnaroundTime });
      expect(result).toEqual(expectedOutput);
    });
  });
});
