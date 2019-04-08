export default [
  {
    name: "7 times table",
    question_type: "_*n=_",
    values: [3, 21, 4, 28, 5, 35, 6, 42, 7, 49, 8, 56],
    answer: 7,
    operation: 'multiply',
    instruction: "Choose two cards that make the sentence correct",
    question_text: ["times 7 is"]
    
  },
  { 
    name: "13 times table",
    question_type: "n*_=_",
    values: [2, 26, 3, 39, 4, 52, 5, 65, 6, 78, 7, 91],
    answer: 13,
    operation: 'multiply',
    instruction: "Choose two cards that make the sentence correct",
    question_text: ["13 times", "is"]
  },
  {
    name: "Number bonds to 10",
    question_type: "_*_=n",
    values: [0, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5, 5],
    answer: 10,
    operation: 'add',
    instruction: "Choose two cards that make the sentence correct",
    question_text: ["add", "is 10"]
  },
]
