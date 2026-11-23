// =====================================================================================
// STEP 05 - Array destructuring and the rest operator
// Run:  node 05-array-destructuring-rest.js
//
// WHAT YOU LEARN
//   - taking values out of an array BY POSITION
//   - skipping items and collecting "the rest"
//   - swapping two variables
//   - rest parameters (a function that accepts any number of arguments)
//   - why `const [count, setCount] = useState(0)` looks the way it does
// =====================================================================================

const numbers = [10, 20, 30, 40];

// ---- 1) Pull values out by position ----------------------------------------------------
// Objects are matched by NAME; arrays are matched by POSITION, so you can choose any variable name.
const [first, second] = numbers;
console.log(first, second); // 10 20

// ---- 2) Skip items with an empty slot ---------------------------------------------------
// The two commas skip index 0 and 1; `third` receives index 2.
const [, , third] = numbers;
console.log(third); // 30

// ---- 3) Rest: collect the remaining items -----------------------------------------------
// "...others" must be last. It becomes a NEW array holding everything that was not named.
const [head, ...others] = numbers;
console.log(head, others); // 10 [ 20, 30, 40 ]

// ---- 4) Swap two variables without a temporary variable ---------------------------------
let a = 1;
let b = 2;
[a, b] = [b, a]; // build [2, 1] on the right, then destructure it back into a and b
console.log(a, b); // 2 1

// ---- 5) Rest PARAMETERS ---------------------------------------------------------------
// The same "..." in a parameter list gathers all arguments into an array called nums.
const sum = (...nums) => nums.reduce((total, n) => total + n, 0);
console.log(sum(1, 2, 3, 4)); // 10

// ---- 6) React preview -----------------------------------------------------------------------
// useState returns an array: [currentValue, functionToChangeIt].
// Array destructuring lets us give those two items any names we like.
function useStateLike(initial) {
  return [initial, (v) => console.log("would set to", v)];
}
const [count, setCount] = useStateLike(0);
setCount(count + 1); // would set to 1
