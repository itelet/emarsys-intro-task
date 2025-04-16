const CalculateDueDate = require("../../src/dueDateCalculator");

describe("due-date-calculator", () => {
  it("default test case", () => {
    let submitDate = new Date(2025, 4, 15, 14, 12);
    let turnaroundTime = 16;

    const expectedOutput = new Date(2025, 4, 17, 14, 12);

    const result = CalculateDueDate({ submitDate, turnaroundTime });
    expect(result).toEqual(expectedOutput);
  });

  describe("failing test cases", () => {
    it("should throw an error if submitDate is not a Date object", () => {});

    it("should throw an error if submitDate is invalid", () => {});

    it("should throw an error if turnaroundTime is not a number", () => {});

    it("should throw an error if turnaroundTime is negative", () => {});

    it("should throw an error if submitDate is on a weekend", () => {});

    it("should throw an error if submitDate is outside working hours", () => {});
  });

  describe("successful test cases", () => {
    it("entry + 4 hours", () => {});

    it("entry + 8 hours", () => {});

    it("entry + 9 hours", () => {});

    it("entry + 16 hours", () => {});
  });

  describe("edge cases", () => {
    it("should handle weekend", () => {});
  });
});
