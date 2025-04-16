const CalculateDueDate = require("../../src/dueDateCalculator");

describe("due-date-calculator", () => {
  it("default test case", () => {
    const input = { date: "2025-04-15T14:12:00Z", time: 16 };
    const expectedOutput = "2025-04-17T14:12:00Z";

    const result = CalculateDueDate({ date: input.date, time: input.time });

    expect(result).toEqual(expectedOutput);
  });
});
