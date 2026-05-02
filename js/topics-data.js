window.TOPICS = [
  {
    id:'bigo', name:'Big-O Notation', color:'#534AB7', initial:'O',
    subtitle:'Measure how algorithms scale',
    description:'Big-O notation describes the upper bound of an algorithm\'s running time or space requirements as the input grows. It lets us compare algorithms independently of hardware.',
    keyPoints:[
      'Describes worst-case growth rate as input size n increases.',
      'Ignores constants and lower-order terms.',
      'Helps choose the right algorithm for large inputs.'
    ],
    formulas:[
      {label:'Constant time', formula:'O(1)'},
      {label:'Linear time', formula:'O(n)'},
      {label:'Quadratic time', formula:'O(n²)'},
      {label:'Logarithmic time', formula:'O(log n)'}
    ],
    code:`<span class="cm">// Binary search: O(log n)</span>
<span class="kw">function</span> <span class="fn">binarySearch</span>(arr, target) {
  <span class="kw">let</span> lo = <span class="nm">0</span>, hi = arr.length - <span class="nm">1</span>;
  <span class="kw">while</span> (lo <= hi) {
    <span class="kw">const</span> mid = (lo + hi) >> <span class="nm">1</span>;
    <span class="kw">if</span> (arr[mid] === target) <span class="kw">return</span> mid;
    <span class="kw">if</span> (arr[mid] < target) lo = mid + <span class="nm">1</span>;
    <span class="kw">else</span> hi = mid - <span class="nm">1</span>;
  }
  <span class="kw">return</span> -<span class="nm">1</span>;
}`,
    complexity:[
      ['Constant', 'O(1)', 'good'],
      ['Logarithmic', 'O(log n)', 'good'],
      ['Linear', 'O(n)', 'ok'],
      ['Quadratic', 'O(n²)', 'bad']
    ]
  },
  {
    id:'dc', name:'Divide & Conquer', color:'#2BA39A', initial:'D',
    subtitle:'Break, solve, combine',
    description:'Divide and conquer breaks a problem into smaller subproblems of the same type, solves them recursively, and combines the answers.',
    keyPoints:[
      'Recursively split the problem in half (or smaller).',
      'Solve base cases trivially.',
      'Combine subresults to get the final answer.'
    ],
    formulas:[
      {label:'Master theorem', formula:'T(n) = aT(n/b) + f(n)'},
      {label:'Merge sort', formula:'T(n) = 2T(n/2) + O(n)'}
    ],
    code:`<span class="cm">// Merge sort: O(n log n)</span>
<span class="kw">function</span> <span class="fn">mergeSort</span>(arr) {
  <span class="kw">if</span> (arr.length <= <span class="nm">1</span>) <span class="kw">return</span> arr;
  <span class="kw">const</span> mid = arr.length >> <span class="nm">1</span>;
  <span class="kw">const</span> left = <span class="fn">mergeSort</span>(arr.slice(<span class="nm">0</span>, mid));
  <span class="kw">const</span> right = <span class="fn">mergeSort</span>(arr.slice(mid));
  <span class="kw">return</span> <span class="fn">merge</span>(left, right);
}`,
    complexity:[
      ['Best', 'O(n log n)', 'good'],
      ['Average', 'O(n log n)', 'good'],
      ['Worst', 'O(n log n)', 'good'],
      ['Space', 'O(n)', 'ok']
    ]
  },
  {
    id:'greedy', name:'Greedy', color:'#D9A441', initial:'G',
    subtitle:'Locally optimal choices',
    description:'Greedy algorithms pick the best option at each step, hoping the local choices lead to a global optimum. They are fast but only work for problems with the greedy-choice property.',
    keyPoints:[
      'Make the locally optimal choice at each step.',
      'Never reconsider previous choices.',
      'Prove correctness with exchange argument or matroid theory.'
    ],
    formulas:[
      {label:'Activity selection', formula:'pick a_i with min finish[i] ≥ last_end'}
    ],
    code:`<span class="cm">// Activity selection: O(n log n)</span>
<span class="kw">function</span> <span class="fn">selectActivities</span>(acts) {
  acts.sort((a, b) => a.end - b.end);
  <span class="kw">const</span> result = [acts[<span class="nm">0</span>]];
  <span class="kw">let</span> lastEnd = acts[<span class="nm">0</span>].end;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="nm">1</span>; i < acts.length; i++) {
    <span class="kw">if</span> (acts[i].start >= lastEnd) {
      result.push(acts[i]);
      lastEnd = acts[i].end;
    }
  }
  <span class="kw">return</span> result;
}`,
    complexity:[
      ['Sort', 'O(n log n)', 'good'],
      ['Selection', 'O(n)', 'good'],
      ['Total', 'O(n log n)', 'good']
    ]
  },
  {
    id:'dp', name:'Dynamic Programming', color:'#7E5BD0', initial:'P',
    subtitle:'Overlapping subproblems',
    description:'Dynamic programming solves problems by storing solutions to overlapping subproblems and reusing them. Use memoization (top-down) or tabulation (bottom-up).',
    keyPoints:[
      'Identify overlapping subproblems.',
      'Define a recurrence relation.',
      'Cache results to avoid recomputation.'
    ],
    formulas:[
      {label:'Fibonacci', formula:'F(n) = F(n-1) + F(n-2)'},
      {label:'0/1 Knapsack', formula:'K(i,w) = max(K(i-1,w), v_i + K(i-1,w-w_i))'}
    ],
    code:`<span class="cm">// Fibonacci with memoization: O(n)</span>
<span class="kw">function</span> <span class="fn">fib</span>(n, memo = {}) {
  <span class="kw">if</span> (n <= <span class="nm">1</span>) <span class="kw">return</span> n;
  <span class="kw">if</span> (memo[n] !== <span class="kw">undefined</span>) <span class="kw">return</span> memo[n];
  memo[n] = <span class="fn">fib</span>(n - <span class="nm">1</span>, memo) + <span class="fn">fib</span>(n - <span class="nm">2</span>, memo);
  <span class="kw">return</span> memo[n];
}`,
    complexity:[
      ['Time (memo)', 'O(n)', 'good'],
      ['Space', 'O(n)', 'ok'],
      ['Naive recursion', 'O(2ⁿ)', 'bad']
    ]
  },
  {
    id:'graph', name:'Graph Algorithms', color:'#3BA776', initial:'V',
    subtitle:'Traverse vertices and edges',
    description:'Graph algorithms operate on networks of nodes and edges. BFS explores level by level; DFS dives deep; Dijkstra finds shortest paths in weighted graphs.',
    keyPoints:[
      'BFS uses a queue, DFS uses a stack (or recursion).',
      'Dijkstra requires non-negative edge weights.',
      'Adjacency list is preferred for sparse graphs.'
    ],
    formulas:[
      {label:'BFS / DFS', formula:'O(V + E)'},
      {label:'Dijkstra (heap)', formula:'O((V + E) log V)'}
    ],
    code:`<span class="cm">// BFS: O(V + E)</span>
<span class="kw">function</span> <span class="fn">bfs</span>(graph, start) {
  <span class="kw">const</span> visited = <span class="kw">new</span> <span class="fn">Set</span>([start]);
  <span class="kw">const</span> queue = [start];
  <span class="kw">while</span> (queue.length) {
    <span class="kw">const</span> node = queue.shift();
    <span class="kw">for</span> (<span class="kw">const</span> n <span class="kw">of</span> graph[node]) {
      <span class="kw">if</span> (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }
  <span class="kw">return</span> visited;
}`,
    complexity:[
      ['BFS', 'O(V+E)', 'good'],
      ['DFS', 'O(V+E)', 'good'],
      ['Dijkstra', 'O((V+E) log V)', 'ok'],
      ['Bellman-Ford', 'O(VE)', 'bad']
    ]
  },
  {
    id:'bt', name:'Backtracking', color:'#D9534F', initial:'B',
    subtitle:'Try, fail, back up',
    description:'Backtracking incrementally builds candidates and abandons each partial candidate as soon as it cannot lead to a valid solution.',
    keyPoints:[
      'DFS over the solution space.',
      'Prune branches that violate constraints.',
      'Used for permutations, N-Queens, sudoku, etc.'
    ],
    formulas:[
      {label:'N-Queens constraint', formula:'col≠col\', |row-row\'|≠|col-col\'|'}
    ],
    code:`<span class="cm">// N-Queens solver</span>
<span class="kw">function</span> <span class="fn">solveNQueens</span>(n) {
  <span class="kw">const</span> res = [], cols = [];
  <span class="kw">function</span> <span class="fn">place</span>(row) {
    <span class="kw">if</span> (row === n) { res.push([...cols]); <span class="kw">return</span>; }
    <span class="kw">for</span> (<span class="kw">let</span> c = <span class="nm">0</span>; c < n; c++) {
      <span class="kw">if</span> (cols.every((cc, r) => cc !== c && Math.abs(cc - c) !== row - r)) {
        cols.push(c);
        <span class="fn">place</span>(row + <span class="nm">1</span>);
        cols.pop();
      }
    }
  }
  <span class="fn">place</span>(<span class="nm">0</span>);
  <span class="kw">return</span> res;
}`,
    complexity:[
      ['Worst', 'O(n!)', 'bad'],
      ['With pruning', 'much less in practice', 'ok'],
      ['Space', 'O(n)', 'good']
    ]
  }
];
