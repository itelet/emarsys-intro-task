const config = require("../config/config.json");

const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;

export function calculateDueDate({
  submitDate,
  turnaroundTime,
}: {
  submitDate: Date;
  turnaroundTime: number;
}) {
  // Validate inputs
  validateSubmitDate(submitDate);
  validateTurnaroundTime(turnaroundTime);

  // Define working hours
  const workDayStartHour = config.workDayStartHour;
  const workDayEndHour = config.workDayEndHour;
  const workHoursPerDay = workDayEndHour - workDayStartHour;

  const submitDay = submitDate.getDay();
  const submitHour = submitDate.getHours();
  const submitMinutes = submitDate.getMinutes();

  // Check if the submit date is a valid working day
  isValidWorkingDay(submitDay, submitHour, workDayStartHour, workDayEndHour);

  let dueDate = new Date(submitDate.getTime());

  const remainingHoursFirstDay = getFirstDayRemainderHours(
    workDayEndHour,
    submitHour,
    submitMinutes
  );

  // If it can be completed today, we should just add the time then return early
  if (isDueDateValidToday(turnaroundTime, remainingHoursFirstDay)) {
    dueDate.setTime(dueDate.getTime() + turnaroundTime * MILLISECONDS_IN_HOUR);
    return dueDate;
  }

  let remainingTurnaroundTime = turnaroundTime - remainingHoursFirstDay;

  dueDate.setHours(workDayStartHour, 0, 0, 0);
  dueDate.setDate(dueDate.getDate() + 1);

  // If its a weekend, skip it
  skipWeekend(dueDate);

  // Calculate full working days needed
  const fullWorkDays = getFullWorkDays(
    remainingTurnaroundTime,
    workHoursPerDay
  );
  remainingTurnaroundTime -= fullWorkDays * workHoursPerDay;

  addWorkDaysToDueDate(fullWorkDays, dueDate);

  // Add remaining hours on the last day
  addRemainingTurnaroundTimeToDueDate(remainingTurnaroundTime, dueDate);

  return dueDate;
}

function addRemainingTurnaroundTimeToDueDate(
  remainingTurnaroundTime: number,
  dueDate: Date
) {
  if (remainingTurnaroundTime > 0) {
    dueDate.setTime(
      dueDate.getTime() + remainingTurnaroundTime * MILLISECONDS_IN_HOUR
    );
  }
}

/* NOTE - this is a reference based modification */
function addWorkDaysToDueDate(fullWorkDays: number, dueDate: Date) {
  for (let i = 0; i < fullWorkDays; i++) {
    dueDate.setDate(dueDate.getDate() + 1);

    // Skip weekends
    skipWeekend(dueDate);
  }
}

/* NOTE - this is a reference based modification */
function skipWeekend(dueDate: Date) {
  while (dueDate.getDay() === 0 || dueDate.getDay() === 6) {
    dueDate.setDate(dueDate.getDate() + 1);
  }
}

function getFullWorkDays(
  remainingTurnaroundTime: number,
  workHoursPerDay: number
) {
  return Math.floor(remainingTurnaroundTime / workHoursPerDay);
}

function isDueDateValidToday(
  turnaroundTime: number,
  remainingHoursFirstDay: number
) {
  if (turnaroundTime <= remainingHoursFirstDay) {
    return true;
  }

  return false;
}

function getFirstDayRemainderHours(
  workDayEndHour: number,
  submitHour: number,
  submitMinutes: number
) {
  let remainingHoursFirstDay = workDayEndHour - submitHour;

  if (submitMinutes > 0) {
    remainingHoursFirstDay -= submitMinutes / 60;
  }

  return remainingHoursFirstDay;
}

function isValidWorkingDay(
  submitDay: number,
  submitHour: number,
  workDayStartHour: number,
  workDayEndHour: number
) {
  if (submitDay === 0 || submitDay === 6) {
    throw new Error("Submit date must be during a work day (Monday to Friday)");
  }

  if (submitHour < workDayStartHour || submitHour >= workDayEndHour) {
    throw new Error("Submit date must be during working hours (9AM to 5PM)");
  }
}

function validateSubmitDate(submitDate: Date) {
  if (!(submitDate instanceof Date) || isNaN(submitDate.getTime())) {
    throw new Error("Submit date must be a valid Date object");
  }
}

function validateTurnaroundTime(turnaroundTime: number) {
  if (typeof turnaroundTime !== "number" || turnaroundTime <= 0) {
    throw new Error("Turnaround time must be a positive number");
  }
}

module.exports = calculateDueDate;
