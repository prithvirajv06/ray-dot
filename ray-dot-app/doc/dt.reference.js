// Define a decision table with conditions and actions
const decisionTable = [
  {
    conditions: {
      age: (val) => val < 18,
      income: (val) => val < 30000,
    },
    actions: ['Reject', 'Suggest Student Plan'],
  },
  {
    conditions: {
      age: (val) => val >= 18 && val <= 60,
      income: (val) => val >= 30000,
    },
    actions: ['Approve', 'Offer Premium Plan'],
  },
  {
    conditions: {
      age: (val) => val > 60,
      income: (val) => val < 50000,
    },
    actions: ['Refer to Senior Specialist'],
  },
];

// Evaluator function to process input against the decision table
function evaluateDecision(inputData, table) {
  for (let row of table) {
    const match = Object.entries(row.conditions).every(([key, checkFn]) =>
      checkFn(inputData[key])
    );
    if (match) {
      return row.actions;
    }
  }
  return ['No matching rule'];
}

// Example input
const input = {
  age: 62,
  income: 40000,
};

// Evaluate decision
const result = evaluateDecision(input, decisionTable);
console.log('Decision:', result);
