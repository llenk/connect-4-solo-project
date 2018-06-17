const spawn = require("child_process").spawn;


const arg = [
  ['', '', 'x', 'o', 'x', 'o'],
  ['', 'x', 'x', 'o', 'x', 'o'],
  ['', 'x', 'o', 'o', 'x', 'x'],
  ['o', 'x', 'o', 'x', 'o', 'x'],
  ['', 'o', 'x', 'o', 'x', 'o'],
  ['x', 'o', 'x', 'o', 'x', 'o'],
  ['o', 'x', 'o', 'x', 'o', 'x'],
];

let base = 1;
let arg1 = 0; 
let arg2 = 0;
let arg3 = ['', '', '', '', '', '', ''];
let arg4 = 0;
for (let i = 0; i < arg.length; i++) {
  for (let j = arg[i].length - 1; j >= 0; j--) {
    if (arg[i][j] == 'x') {
      arg1 += base;
      arg4++;
    } 
    else if (arg[i][j] == 'o') {
      arg2 += base;
      arg4++;
    }
    else if (arg3[i] === '') {
      arg3[i] = Math.round(Math.log(base)/Math.log(2));
    }
    base *= 2;
  }
  base *= 2;
}

console.log(arg1, arg2, arg3);

// const pythonProcess = spawn('python', ["solver.py", arg1, arg2, arg3, arg4]);


// pythonProcess.stdout.on('data', function (data) {
//   console.log('data: ', data.toString());

// });