export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface SkillQuestions {
  skill: string;
  questions: Question[];
}

export const assessmentData: SkillQuestions[] = [
  {
    skill: 'EXCEL',
    questions: [
      {
        id: 1,
        question: 'Which Excel function returns the largest value in a range?',
        options: ['SUM()', 'MAX()', 'LARGE()', 'COUNT()'],
        correctIndex: 1,
      },
      {
        id: 2,
        question: 'What does VLOOKUP stand for?',
        options: ['Vertical Lookup', 'Variable Lookup', 'Value Lookup', 'Vector Lookup'],
        correctIndex: 0,
      },
      {
        id: 3,
        question: 'Which shortcut key is used to create a new chart in Excel?',
        options: ['F5', 'F11', 'F4', 'F8'],
        correctIndex: 1,
      },
      {
        id: 4,
        question: 'What is the correct syntax for an IF function?',
        options: [
          'IF(condition, true_value, false_value)',
          'IF(true_value, condition, false_value)',
          'IF(false_value, true_value, condition)',
          'IF(condition; true_value; false_value)',
        ],
        correctIndex: 0,
      },
      {
        id: 5,
        question: 'Which Excel feature allows you to summarize data from multiple rows?',
        options: ['VLOOKUP', 'Conditional Formatting', 'Pivot Table', 'Data Validation'],
        correctIndex: 2,
      },
    ],
  },
  {
    skill: 'SQL',
    questions: [
      {
        id: 1,
        question: 'Which SQL clause is used to filter records?',
        options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
        correctIndex: 2,
      },
      {
        id: 2,
        question: 'What does the JOIN clause do in SQL?',
        options: [
          'Deletes records from two tables',
          'Combines rows from two or more tables based on a related column',
          'Creates a new table',
          'Sorts the result set',
        ],
        correctIndex: 1,
      },
      {
        id: 3,
        question: 'Which aggregate function counts the number of rows?',
        options: ['SUM()', 'AVG()', 'COUNT()', 'MAX()'],
        correctIndex: 2,
      },
      {
        id: 4,
        question: 'What is the difference between DELETE and TRUNCATE?',
        options: [
          'No difference',
          'DELETE removes specific rows; TRUNCATE removes all rows and resets identity',
          'TRUNCATE removes specific rows; DELETE removes all rows',
          'DELETE is faster than TRUNCATE',
        ],
        correctIndex: 1,
      },
      {
        id: 5,
        question: 'Which SQL keyword is used to retrieve unique values?',
        options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'ONLY'],
        correctIndex: 1,
      },
    ],
  },
  {
    skill: 'Power BI',
    questions: [
      {
        id: 1,
        question: 'What language is used to write custom calculations in Power BI?',
        options: ['SQL', 'Python', 'DAX', 'R'],
        correctIndex: 2,
      },
      {
        id: 2,
        question: 'What is a "Slicer" in Power BI?',
        options: [
          'A data transformation tool',
          'A visual filter that allows users to filter data on a report page',
          'A type of chart',
          'A data source connector',
        ],
        correctIndex: 1,
      },
      {
        id: 3,
        question: 'Which Power BI service allows sharing reports with others?',
        options: ['Power BI Desktop', 'Power BI Mobile', 'Power BI Service (cloud)', 'Power BI Gateway'],
        correctIndex: 2,
      },
      {
        id: 4,
        question: 'What does DAX stand for?',
        options: [
          'Data Analysis Expressions',
          'Dynamic Analysis Extension',
          'Data Aggregation XML',
          'Dashboard Analytics Exchange',
        ],
        correctIndex: 0,
      },
      {
        id: 5,
        question: 'Which view in Power BI Desktop is used to manage table relationships?',
        options: ['Report View', 'Data View', 'Model View', 'Query View'],
        correctIndex: 2,
      },
    ],
  },
  {
    skill: 'Python',
    questions: [
      {
        id: 1,
        question: 'Which Python library is commonly used for data manipulation?',
        options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
        correctIndex: 1,
      },
      {
        id: 2,
        question: 'What is the output of: print(type([]))?',
        options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"],
        correctIndex: 0,
      },
      {
        id: 3,
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'func', 'def', 'define'],
        correctIndex: 2,
      },
      {
        id: 4,
        question: 'What does the "len()" function do in Python?',
        options: [
          'Returns the largest element',
          'Returns the number of items in an object',
          'Converts to integer',
          'Checks if a value exists',
        ],
        correctIndex: 1,
      },
      {
        id: 5,
        question: 'Which of the following is a mutable data type in Python?',
        options: ['Tuple', 'String', 'List', 'Integer'],
        correctIndex: 2,
      },
    ],
  },
];
