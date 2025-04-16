const CalculateDueDate = require("../../src/dueDateCalculator");

describe("due-date-calculator", () => {
	it("default test case", () => {
		let submitDate = new Date(2025, 4, 15, 14, 12);
		let turnaroundTime = 16;

		const expectedOutput = new Date(2025, 4, 17, 14, 12);

		const result = CalculateDueDate({ submitDate, turnaroundTime });

		expect(result).toEqual(expectedOutput);
	});
});
