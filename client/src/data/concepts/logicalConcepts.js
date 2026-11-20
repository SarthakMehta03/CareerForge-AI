/**
 * Logical Reasoning Concepts, Rules, Solved Examples, and Common Pitfalls
 * Comprehensive guides for all 15 Logical Reasoning Topics in CareerForge AI.
 * Formatted with IndiaBIX / Competitive Exam layout (options, answer pills, step-by-step derivations).
 */

export const LOGICAL_CONCEPTS = {
  "number-series": {
    topicId: "number-series",
    title: "Number Series",
    category: "logical",
    introduction: "Logical Number Series evaluates numerical pattern recognition across progressive gaps, alternating streams, polynomial differences, and compound arithmetic-geometric operations.",
    concepts: [
      {
        heading: "Pattern Discovery Methodology",
        body: "1. Inspect consecutive differences: If the difference is constant, it is an arithmetic progression (AP).\n2. Inspect second-order differences (difference of differences) if first-level gaps increase steadily (e.g. +4, +8, +16...).\n3. Test ratio scaling: If numbers grow steeply, look for multiplication factors or powers (n², n³, 2ⁿ).\n4. Interleaved Dual Series: If numbers alternate between increasing and decreasing, test odd-positioned and even-positioned terms as two independent sequences."
      },
      {
        heading: "Common Generating Rules",
        body: "• Multiplication + Constant Offset: T_(n+1) = (2 × T_n) + 2\n• Power Offsets: n³ - 1 (0, 7, 26, 63, 124...) or n² + 1 (2, 5, 10, 17, 26...)\n• Fibonacci Additive Series: Each term is the sum of the preceding two terms (1, 1, 2, 3, 5, 8, 13...)."
      }
    ],
    formulas: [
      {
        name: "Geometric Gap Rule",
        formula: "Difference_(k+1) = Difference_k · r",
        explanation: "Differences double, triple, or scale by a common ratio."
      },
      {
        name: "Interleaved Sequence Structure",
        formula: "Odd Terms: f(n)   |   Even Terms: g(n)",
        explanation: "Two independent series interwoven alternately."
      }
    ],
    solvedExamples: [
      {
        problem: "Find the missing number in the series: 3, 8, 18, 38, 78, ?",
        options: [
          { id: "A", text: "148" },
          { id: "B", text: "156" },
          { id: "C", text: "158" },
          { id: "D", text: "168" }
        ],
        correctOption: "C",
        solution: "Calculate the differences between consecutive terms:\n8 - 3 = 5\n18 - 8 = 10\n38 - 18 = 20\n78 - 38 = 40\nThe differences double at each step: 5, 10, 20, 40.\n⇒ Next difference = 40 × 2 = 80\n⇒ Next term = 78 + 80 = 158\n(Alternatively: each term is (previous × 2) + 2: 38 × 2 + 2 = 78; 78 × 2 + 2 = 158).\n∴ Missing number = 158."
      },
      {
        problem: "What is the next number in the interleaved sequence: 2, 12, 4, 10, 6, 8, 8, ?",
        options: [
          { id: "A", text: "6" },
          { id: "B", text: "7" },
          { id: "C", text: "8" },
          { id: "D", text: "10" }
        ],
        correctOption: "A",
        solution: "Decompose into two interleaved alternating sequences:\nOdd-positioned terms (1st, 3rd, 5th, 7th): 2, 4, 6, 8 (increases by +2)\nEven-positioned terms (2nd, 4th, 6th, 8th): 12, 10, 8, ? (decreases by -2)\nThe missing number is at the 8th position (even series).\n⇒ Required term = 8 - 2 = 6\n∴ Missing number = 6."
      }
    ],
    commonMistakes: [
      "Assuming a single monotonic rule exists for a series that is actually two interleaved alternating streams.",
      "Stopping after checking only first-order differences when terms follow second-order quadratic or exponential rules."
    ]
  },

  "letter-series": {
    topicId: "letter-series",
    title: "Letter Series",
    category: "logical",
    introduction: "Letter Series tests pattern discovery across English alphabet sequences utilizing forward-backward numerical indices, skip shifts, reverse pairings, and cyclic repeats.",
    concepts: [
      {
        heading: "Alphabetical Indexing & The EJOTY Anchor",
        body: "• Standard Alphabetical Positions: A=1, B=2, ..., Z=26.\n• The EJOTY Anchor: Memorize multiples of 5: E=5, J=10, O=15, T=20, Y=25.\n• Reverse Indexing (from Z down to A): Z=1, Y=2, ..., A=26.\n• Opposite Letter Pairs: Two letters that share the same rank from opposite ends sum to 27: A-Z (1+26=27), B-Y (2+25=27), C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N."
      },
      {
        heading: "Continuous Repeating Letter Patterns",
        body: "In continuous letter series (e.g. a_b_a_ba), count the total number of characters including blanks (e.g. 12, 15, or 16), then divide into equal symmetrical blocks (e.g. 3 blocks of 4, or 4 blocks of 3) to reveal recurring cycles or progressive changes."
      }
    ],
    formulas: [
      {
        name: "Alphabet Wrap-Around Modulo",
        formula: "Position = (Current Position + Shift - 1) mod 26 + 1",
        explanation: "Wraps back to A (1) after passing Z (26)."
      },
      {
        name: "Opposite Pair Sum Rule",
        formula: "Forward Rank + Reverse Rank = 27",
        explanation: "Used for rapid opposite-letter substitution."
      }
    ],
    solvedExamples: [
      {
        problem: "Find the next letter in the series: B, E, I, N, T, ?",
        options: [
          { id: "A", text: "A" },
          { id: "B", text: "Z" },
          { id: "C", text: "Y" },
          { id: "D", text: "B" }
        ],
        correctOption: "A",
        solution: "Convert letters to standard alphabetical positions (A = 1, B = 2, ...):\nB = 2\nE = 5 (shift = +3)\nI = 9 (shift = +4)\nN = 14 (shift = +5)\nT = 20 (shift = +6)\nThe positional shift increases by 1 at each step: +3, +4, +5, +6.\n⇒ Next shift = +7\n⇒ Numerical position = 20 + 7 = 27\nWrap around the 26-letter alphabet:\n⇒ 27 - 26 = 1 = A\n∴ Next letter = A."
      },
      {
        problem: "Which set of letters completes the repeating pattern when placed sequentially at the blanks: a _ b a _ b _ b a _ b a",
        options: [
          { id: "A", text: "a, b, a, b" },
          { id: "B", text: "b, b, a, b" },
          { id: "C", text: "b, a, b, a" },
          { id: "D", text: "a, a, b, b" }
        ],
        correctOption: "B",
        solution: "Count total positions including blanks: 12 characters.\nDivide into 4 equal blocks of 3 characters each:\nBlock 1: a _ b\nBlock 2: a _ b\nBlock 3: _ b a\nBlock 4: _ b a\nNotice that filling with repeating symmetric triplets 'a b b' satisfies all blocks:\nBlock 1: a b b (1st blank = b)\nBlock 2: a b b (2nd blank = b)\nBlock 3: a b b (3rd blank = a)\nBlock 4: a b b (4th blank = b)\n⇒ Complete sequence = a b b a b b a b b a b b\n∴ Required missing letters = b, b, a, b."
      }
    ],
    commonMistakes: [
      "Forgetting to wrap around to A (1) when addition exceeds 26.",
      "Miscounting spaces when attempting to partition continuous repeating letter strings into blocks."
    ]
  },

  "coding-and-decoding": {
    topicId: "coding-and-decoding",
    title: "Coding and Decoding",
    category: "logical",
    introduction: "Coding and Decoding evaluates rule-based cipher deciphering across alphabetical shifts, direct substitutions, numerical ranks, and fictitious language phrase comparison.",
    concepts: [
      {
        heading: "Cipher Typologies",
        body: "• Letter Shifting: Each letter is moved forward or backward by a constant or progressive integer offset.\n• Reverse Alphabet Coding: Substituting each letter with its opposite pair (A<->Z, B<->Y).\n• Numerical Coding: Words mapped to numbers based on sum of letter positions, number of letters, or vowel-consonant ratios.\n• Fictitious Language Coding: Sentences in pseudo-language with given translations, solved by set-intersection elimination across pairs of sentences."
      },
      {
        heading: "Elimination Protocol for Fictitious Languages",
        body: "1. Compare statement 1 and statement 2: Find words common to both.\n2. Find the code tokens common to both statements. The common word maps to that common code.\n3. Repeat across statement 2 and statement 3 to isolate single vocabulary tokens."
      }
    ],
    formulas: [
      {
        name: "Alphabetical Rank Sum",
        formula: "Code = Σ (Rank of Letter_i)",
        explanation: "Sum of positions of all constituent letters in the target word."
      },
      {
        name: "Cross-Comparison Elimination",
        formula: "Words(S₁) ∩ Words(S₂) <==> Codes(S₁) ∩ Codes(S₂)",
        explanation: "Isolates direct word-to-token mappings in fictitious languages."
      }
    ],
    solvedExamples: [
      {
        problem: "In a certain code language:\n'sun rises in east' is written as 'ki la po mu'\n'sun sets in west' is written as 'po ja ki ro'\n'east or west' is written as 'mu na ja'\nWhat is the code for 'east'?",
        options: [
          { id: "A", text: "ki" },
          { id: "B", text: "po" },
          { id: "C", text: "mu" },
          { id: "D", text: "la" }
        ],
        correctOption: "C",
        solution: "Compare statement 1 and statement 2:\n'sun rises in east' = 'ki la po mu'\n'sun sets in west' = 'po ja ki ro'\nCommon words: 'sun', 'in' ; Common codes: 'ki', 'po'.\n⇒ {'sun', 'in'} = {'ki', 'po'}\nNow compare statement 1 with statement 3:\n'sun rises in east' = 'ki la po mu'\n'east or west' = 'mu na ja'\nCommon word between 1 and 3: 'east'\nCommon code between 1 and 3: 'mu'\n∴ Code for 'east' = mu."
      },
      {
        problem: "If BAD is coded as 7 and CAB is coded as 6, how will DIG be coded in that language?",
        options: [
          { id: "A", text: "18" },
          { id: "B", text: "20" },
          { id: "C", text: "22" },
          { id: "D", text: "24" }
        ],
        correctOption: "B",
        solution: "Test the alphabetical rank values for each constituent letter:\nFor BAD:\nB (2) + A (1) + D (4) = 2 + 1 + 4 = 7\nFor CAB:\nC (3) + A (1) + B (2) = 3 + 1 + 2 = 6\nThe cipher rule is the sum of alphabetical ranks.\nFor DIG:\nD = 4, I = 9, G = 7\n⇒ Sum = 4 + 9 + 7 = 20\n∴ DIG is coded as 20."
      }
    ],
    commonMistakes: [
      "Assuming word order in fictitious languages matches code order (tokens are intentionally scrambled).",
      "Forgetting that reverse-order rank sums evaluate from 27 (e.g. Z=1, A=26)."
    ]
  },

  "blood-relations": {
    topicId: "blood-relations",
    title: "Blood Relations",
    category: "logical",
    introduction: "Blood Relations evaluates genealogical reasoning through family tree structures, generational tiers, maternal/paternal lineages, and symbolic relation codes.",
    concepts: [
      {
        heading: "Generational Tiers & Standard Notations",
        body: "• Tier +2: Grandparents (Grandfather, Grandmother).\n• Tier +1: Parents, Uncles, Aunts (Father, Mother, Paternal/Maternal Uncle & Aunt).\n• Tier 0: Same generation (Self, Brother, Sister, Cousin, Spouse).\n• Tier -1: Children, Nephews, Nieces (Son, Daughter, Nephew, Niece).\n• Notation standard: (+) for male, (-) for female, (=) for married couples, and (|) for parent-child descent."
      },
      {
        heading: "Dialogue Deconstruction Technique",
        body: "For questions where a person points to a photograph or person ('He is the son of the only daughter of...'):\n1. Always start decoding from the personal pronoun ('my / me').\n2. Move backward step-by-step toward the subject.\n3. Note: 'The only son of my father' means the speaker himself (if male) or the speaker's brother (if female)."
      }
    ],
    formulas: [
      {
        name: "Generational Offset",
        formula: "Generation Level = Parent (+1) / Child (-1) / Sibling (0)",
        explanation: "Tracks generational tiers systematically."
      },
      {
        name: "Gender Conservation Rule",
        formula: "Never deduce gender from names; rely strictly on pronouns or explicit relations",
        explanation: "Names like Kiran or Robin can be male or female unless specified."
      }
    ],
    solvedExamples: [
      {
        problem: "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
        options: [
          { id: "A", text: "Brother" },
          { id: "B", text: "Uncle" },
          { id: "C", text: "Father" },
          { id: "D", text: "Grandfather" }
        ],
        correctOption: "C",
        solution: "Deconstruct the statement from Suresh's perspective ('my mother'):\n'My mother' = Suresh's mother.\n'The only son of my mother' = Suresh himself (since Suresh is male).\n'Son of the only son of my mother' = Suresh's son.\n⇒ The boy in the photograph is Suresh's son.\n∴ Suresh is the Father of the boy."
      },
      {
        problem: "If 'A + B' means A is the brother of B; 'A - B' means A is the sister of B; and 'A × B' means A is the father of B. Which expression indicates that P is the paternal uncle of R?",
        options: [
          { id: "A", text: "P × Q + R" },
          { id: "B", text: "P + Q × R" },
          { id: "C", text: "P - Q × R" },
          { id: "D", text: "P × Q - R" }
        ],
        correctOption: "B",
        solution: "For P to be the paternal uncle of R, P must be the brother of R's father.\nEvaluate Option (B): P + Q × R:\n1. 'Q × R' means Q is the father of R.\n2. 'P + Q' means P is the brother of Q.\n⇒ Since P is the brother of Q, and Q is the father of R, P is the brother of R's father.\n∴ P is the paternal uncle of R."
      }
    ],
    commonMistakes: [
      "Assuming a person's gender based on conventional names rather than explicit pronouns or relation definitions.",
      "Confusing cousin (same generational tier) with nephew or niece (one tier lower)."
    ]
  },

  "direction-sense": {
    topicId: "direction-sense",
    title: "Direction Sense",
    category: "logical",
    introduction: "Direction Sense tests spatial orientation, cardinal and ordinal navigation, turning angles (clockwise/counter-clockwise), Pythagoras displacement, and shadow orientation.",
    concepts: [
      {
        heading: "The 8 Compass Directions & Turn Geometry",
        body: "• Cardinal Directions: North (Up), South (Down), East (Right), West (Left).\n• Ordinal Directions: North-East (NE), North-West (NW), South-East (SE), South-West (SW).\n• Turning Right: Always 90° Clockwise.\n• Turning Left: Always 90° Counter-Clockwise.\n• Shortest Distance (Displacement): Use the Pythagorean Theorem c = √(a² + b²)."
      },
      {
        heading: "Shadow Projection Rules",
        body: "• Morning (Sunrise): Sun is in the East. All shadows fall strictly towards the WEST.\n• Evening (Sunset): Sun is in the West. All shadows fall strictly towards the EAST.\n• At 12:00 Noon: The Sun is directly overhead; zero horizontal shadow is projected."
      }
    ],
    formulas: [
      {
        name: "Pythagorean Displacement",
        formula: "Displacement = √[(Δx)² + (Δy)²]",
        explanation: "Δx is net East-West displacement; Δy is net North-South displacement."
      },
      {
        name: "Morning Shadow Vector",
        formula: "Shadow Direction = West (due to sunrise in East)",
        explanation: "If shadow is to one's left in the morning, that person is facing North."
      }
    ],
    solvedExamples: [
      {
        problem: "A person walks 12 km North, turns right and walks 5 km. How far and in which direction is he now from his starting point?",
        options: [
          { id: "A", text: "13 km North-East" },
          { id: "B", text: "17 km North-East" },
          { id: "C", text: "13 km North-West" },
          { id: "D", text: "15 km South-East" }
        ],
        correctOption: "A",
        solution: "Model on Cartesian coordinates starting at origin (0, 0):\nWalk 12 km North: Δy = 12 km (North)\nTurn right (East) and walk 5 km: Δx = 5 km (East)\nApply the Pythagorean theorem for straight-line displacement:\n⇒ Distance = √( 5² + 12² )\n⇒ Distance = √( 25 + 144 ) = √169 = 13 km\nDirection = 5 km East and 12 km North = North-East.\n∴ 13 km North-East from the starting point."
      },
      {
        problem: "One morning after sunrise, Priya and Rohit were standing face-to-face talking. If Rohit's shadow fell exactly to the left of Priya, which direction was Priya facing?",
        options: [
          { id: "A", text: "South" },
          { id: "B", text: "East" },
          { id: "C", text: "North" },
          { id: "D", text: "West" }
        ],
        correctOption: "C",
        solution: "In the morning, the Sun rises in the East.\nConsequently, all shadows are cast toward the West.\nGiven: Rohit's shadow falls to the left of Priya.\n⇒ Priya's left side points toward the West.\nIf a person's left hand points toward West:\nTheir right hand points toward East.\n⇒ The person is facing North.\n∴ Priya was facing North."
      }
    ],
    commonMistakes: [
      "Adding distances traveled linearly instead of using Pythagoras theorem for straight-line displacement.",
      "Confusing a person's relative left/right with the viewer's page left/right (when facing South, left is towards the East)."
    ]
  },

  "syllogisms": {
    topicId: "syllogisms",
    title: "Syllogisms",
    category: "logical",
    introduction: "Syllogisms evaluates categorical deductive logic. Venn diagram representations test whether conclusions necessarily follow from given premises with mathematical certainty.",
    concepts: [
      {
        heading: "The 4 Standard Categorical Propositions",
        body: "• All A are B (A ⊆ B): Set A is an inner subset of Set B.\n• No A are B (A ∩ B = ∅): Set A and Set B are completely disjoint.\n• Some A are B (A ∩ B ≠ ∅): At least one element of A is inside B.\n• Some A are not B: At least one element of A is outside B.\n• 'Only a few A are B': Means BOTH 'Some A are B' AND 'Some A are not B'."
      },
      {
        heading: "Definite vs Possibility Conclusions & Complementary Pairs",
        body: "• Definite Conclusion: Must hold TRUE in EVERY conceivable valid Venn diagram.\n• Possibility Conclusion: Holds true if it is valid in AT LEAST ONE valid Venn diagram without violating premises.\n• Either-Or Complementary Conditions:\n  1. Both conclusions share the same subject and predicate.\n  2. Both conclusions are individually doubtful.\n  3. One conclusion is affirmative and the other is negative (Some + No, or All + Some not)."
      }
    ],
    formulas: [
      {
        name: "Universal Validity Criterion",
        formula: "Definite Conclusion is True  <==>  Valid in ALL possible Venn diagrams",
        explanation: "A single counter-example diagram invalidates a definite conclusion."
      },
      {
        name: "Subalternation Rule",
        formula: "All A are B  ==>  Some A are B (True)",
        explanation: "Universal affirmative strictly implies particular affirmative."
      }
    ],
    solvedExamples: [
      {
        problem: "Statements:\n1. All books are pens.\n2. All pens are markers.\nConclusions:\nI. All books are markers.\nII. Some markers are books.\nWhich conclusion(s) follow?",
        options: [
          { id: "A", text: "Only Conclusion I follows" },
          { id: "B", text: "Only Conclusion II follows" },
          { id: "C", text: "Neither Conclusion I nor II follows" },
          { id: "D", text: "Both Conclusions I and II follow" }
        ],
        correctOption: "D",
        solution: "Represent by categorical set inclusion:\nStatement 1: All books are pens ⇒ Books ⊆ Pens.\nStatement 2: All pens are markers ⇒ Pens ⊆ Markers.\nBy transitive subset inclusion: Books ⊆ Markers.\n1. Conclusion I ('All books are markers'): Since Books is completely inside Markers, Conclusion I definitely follows.\n2. Conclusion II ('Some markers are books'): Since the non-empty subset Books is inside Markers, Markers intersects Books. Conclusion II definitely follows.\n∴ Both Conclusions I and II follow."
      },
      {
        problem: "Statements:\n1. Some apples are mangoes.\n2. No mango is a banana.\nConclusions:\nI. No apple is a banana.\nII. Some apples are not bananas.\nWhich conclusion(s) follow?",
        options: [
          { id: "A", text: "Only Conclusion I follows" },
          { id: "B", text: "Only Conclusion II follows" },
          { id: "C", text: "Either Conclusion I or II follows" },
          { id: "D", text: "Both Conclusions I and II follow" }
        ],
        correctOption: "B",
        solution: "Analyze both conclusions:\n1. Conclusion I ('No apple is a banana'): While bananas cannot touch mangoes, bananas can freely overlap the part of apples that is not mangoes. Since a valid diagram exists with overlap, Conclusion I does not definitely follow.\n2. Conclusion II ('Some apples are not bananas'): The specific apples that are mangoes (Apples ∩ Mangoes) can NEVER be bananas because no mango can be a banana.\n⇒ That portion of apples is guaranteed never to be bananas.\n∴ Only Conclusion II follows."
      }
    ],
    commonMistakes: [
      "Assuming 'Some A are B' implies 'Some A are not B' (in formal logic, 'Some' means 'at least one', possibly all).",
      "Using real-world factual knowledge instead of accepting the stated premises as absolute truth."
    ]
  },

  "seating-arrangements": {
    topicId: "seating-arrangements",
    title: "Seating Arrangements",
    category: "logical",
    introduction: "Seating Arrangements tests spatial ordering across linear rows, parallel queues, and circular tables with individuals facing inward, outward, or bidirectional.",
    concepts: [
      {
        heading: "Linear Arrangements",
        body: "• Facing North: Left is towards viewer's left; Right is towards viewer's right.\n• Facing South: Left is towards viewer's right; Right is towards viewer's left.\n• Strategy: Always anchor the most deterministic, non-ambiguous clue first (e.g. 'P sits at the extreme left end' or 'Q is third from the right end')."
      },
      {
        heading: "Circular Table Rules",
        body: "• Facing Center (Inward): Clockwise corresponds to LEFT; Counter-Clockwise corresponds to RIGHT.\n• Facing Outward: Clockwise corresponds to RIGHT; Counter-Clockwise corresponds to LEFT.\n• Opposite Seat: In a circle of 2n people, opposite person is separated by (n - 1) people on either side (e.g. in 6 people, 2 seats between opposite pairs)."
      }
    ],
    formulas: [
      {
        name: "Inward-Facing Circular Direction",
        formula: "Clockwise = Left   |   Counter-Clockwise = Right",
        explanation: "Crucial rule when people look towards the center of a table."
      },
      {
        name: "Outward-Facing Circular Direction",
        formula: "Clockwise = Right   |   Counter-Clockwise = Left",
        explanation: "Reverses standard inward-facing directions."
      }
    ],
    solvedExamples: [
      {
        problem: "Five friends (P, Q, R, S, T) sit in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the middle of the row?",
        options: [
          { id: "A", text: "P" },
          { id: "B", text: "Q" },
          { id: "C", text: "S" },
          { id: "D", text: "T" }
        ],
        correctOption: "C",
        solution: "All face North (Left is ←, Right is →):\n1. 'P is to immediate left of T' ⇒ (P, T).\n2. 'S is between T and Q' ⇒ S is right of T, followed by Q ⇒ (P, T, S, Q).\n3. 'Q is to immediate left of R' ⇒ R is right of Q ⇒ (P, T, S, Q, R).\nThe complete left-to-right order is:\nP — T — S — Q — R\n⇒ 1st: P, 2nd: T, 3rd: S, 4th: Q, 5th: R.\n∴ S sits in the middle (3rd position)."
      },
      {
        problem: "Six persons (A, B, C, D, E, F) sit in a circle facing the center. B is between A and C. E is between D and F. D is to the immediate left of A. Who is sitting directly opposite to B?",
        options: [
          { id: "A", text: "D" },
          { id: "B", text: "E" },
          { id: "C", text: "F" },
          { id: "D", text: "C" }
        ],
        correctOption: "B",
        solution: "Facing center: Clockwise = Left, Counter-Clockwise = Right.\n1. Anchor A at 6 o'clock.\n2. 'D is to immediate left of A' ⇒ Clockwise places D at 8 o'clock.\n3. 'B is between A and C' ⇒ Counter-clockwise places B at 4 o'clock and C at 2 o'clock.\n4. 'E is between D and F' ⇒ D is at 8 o'clock, so E is at 10 o'clock and F is at 12 o'clock.\nOrder clockwise around the circle:\nA (6) → D (8) → E (10) → F (12) → C (2) → B (4).\n⇒ Opposite to B (4 o'clock) is E (10 o'clock).\n∴ E sits directly opposite to B."
      }
    ],
    commonMistakes: [
      "Reversing left and right when persons face South in linear rows or face outward in circular tables.",
      "Attempting to position ambiguous branching clues before establishing fixed reference anchors."
    ]
  },

  "logical-puzzles": {
    topicId: "logical-puzzles",
    title: "Logical Puzzles",
    category: "logical",
    introduction: "Logical Puzzles requires solving multi-attribute constraint satisfaction problems across floor buildings, scheduling days, box stacking, and tabular parameter matching.",
    concepts: [
      {
        heading: "The Tabular Matrix Method",
        body: "• Build a table where the fixed chronological or physical dimension forms the static column (e.g. Days of the week Monday–Sunday, or Floor numbers 1–7).\n• Direct Clues: Insert confirmed positive attributes directly into matching cells.\n• Negative Clues: Note prohibited combinations outside the table (e.g. 'P does not like Red').\n• Split Cases: When a clue has only two possible locations, branch into Case 1 and Case 2; one will quickly violate a constraint and be eliminated."
      },
      {
        heading: "Floor & Box Stacking Conventions",
        body: "• In floor puzzles, Floor 1 is always the ground/bottom floor, and Floor 7 or 8 is the top floor.\n• 'X lives between Y and Z' does not imply immediately adjacent unless specified.\n• 'Three persons live between A and B' means: |Floor_A - Floor_B| = 4."
      }
    ],
    formulas: [
      {
        name: "Floor Separation Rule",
        formula: "|Floor_A - Floor_B| = k + 1",
        explanation: "Where k is the number of people/floors between A and B."
      },
      {
        name: "Law of Contradiction",
        formula: "If Case_i leads to zero valid assignments, Case_i is pruned",
        explanation: "Eliminates exploratory puzzle branches systematically."
      }
    ],
    solvedExamples: [
      {
        problem: "Four friends (Karan, Leo, Mona, Neha) live on four different floors numbered 1 to 4 (1 is bottom, 4 is top). Karan lives on an odd-numbered floor. Mona lives immediately above Karan. Leo does not live on floor 4. On which floor does Neha live?",
        options: [
          { id: "A", text: "Floor 1" },
          { id: "B", text: "Floor 2" },
          { id: "C", text: "Floor 3" },
          { id: "D", text: "Floor 4" }
        ],
        correctOption: "D",
        solution: "Floors: 4 (top), 3, 2, 1 (bottom).\n1. Karan lives on an odd floor ⇒ Floor 1 or Floor 3.\n2. 'Mona lives immediately above Karan':\n• If Karan is on Floor 3, Mona must be on Floor 4.\n• If Karan is on Floor 1, Mona must be on Floor 2.\n3. 'Leo does not live on floor 4':\n• In Case (Karan = 1, Mona = 2), remaining floors are 3 and 4.\n• Since Leo cannot live on floor 4, Leo MUST live on Floor 3.\n⇒ That leaves Floor 4 for Neha.\n∴ Neha lives on Floor 4."
      },
      {
        problem: "Three colored boxes (Red, Green, Blue) contain a pen, a pencil, and an eraser (one item per box). The Red box does not contain the pen. The pencil is inside the Green box. Which box contains the eraser?",
        options: [
          { id: "A", text: "Red box" },
          { id: "B", text: "Green box" },
          { id: "C", text: "Blue box" },
          { id: "D", text: "Cannot be determined" }
        ],
        correctOption: "A",
        solution: "List the 3 boxes: Red, Green, Blue.\n1. From clue: Green box = Pencil.\n2. Remaining boxes: Red and Blue.\n3. Remaining items: Pen and Eraser.\n4. From clue: Red box does NOT contain the Pen.\n⇒ Red box must contain the Eraser.\n⇒ Blue box contains the Pen.\n∴ The Eraser is in the Red box."
      }
    ],
    commonMistakes: [
      "Numbering floors top-to-bottom instead of bottom-to-top (Floor 1 is the bottom floor).",
      "Confusing 'k persons between A and B' with a floor difference of k instead of k + 1."
    ]
  },

  "analogies": {
    topicId: "analogies",
    title: "Analogies",
    category: "logical",
    introduction: "Analogies evaluates the capacity to identify proportional relationships between words, numbers, or abstract symbols and apply that identical relationship to target pairs.",
    concepts: [
      {
        heading: "Semantic Relational Typologies",
        body: "• Worker and Tool: Carpenter : Saw :: Surgeon : Scalpel\n• Cause and Effect: Virus : Disease :: Spark : Fire\n• Part to Whole: Leaf : Tree :: Page : Book\n• Worker and Workplace: Chef : Kitchen :: Scientist : Laboratory\n• Intensity of Degree: Drizzle : Downpour :: Whisper : Shout\n• Study Domain: Cardiology : Heart :: Entomology : Insects."
      },
      {
        heading: "Number & Operational Analogies",
        body: "Look for numerical mappings involving:\n• Squares and Cubes: x : x² + 1 or x : x³ - x\n• Sum of Digits: Product or sum of constituent digits.\n• Prime Number Progression."
      }
    ],
    formulas: [
      {
        name: "Proportional Analogy Structure",
        formula: "A : B :: C : D  <==>  Relationship(A, B) = Relationship(C, D)",
        explanation: "Directionality and grammatical category must be preserved."
      },
      {
        name: "Grammatical Symmetry Rule",
        formula: "Noun : Noun :: Noun : Noun   |   Verb : Verb :: Verb : Verb",
        explanation: "Analogous pairs must share identical parts of speech."
      }
    ],
    solvedExamples: [
      {
        problem: "Complete the analogy: Ophthalmic : Eye :: Nephrology : ?",
        options: [
          { id: "A", text: "Brain" },
          { id: "B", text: "Kidney" },
          { id: "C", text: "Heart" },
          { id: "D", text: "Liver" }
        ],
        correctOption: "B",
        solution: "Identify the relationship in the first pair:\n'Ophthalmic' is the medical specialty relating to the Eye.\nIn the second pair:\n'Nephrology' is the medical branch specializing in the Kidney (from Greek nephros = kidney).\n∴ Nephrology corresponds to Kidney."
      },
      {
        problem: "Complete the numerical analogy: 7 : 50 :: 11 : ?",
        options: [
          { id: "A", text: "120" },
          { id: "B", text: "122" },
          { id: "C", text: "121" },
          { id: "D", text: "124" }
        ],
        correctOption: "B",
        solution: "Analyze the mathematical rule connecting 7 to 50:\n7² + 1 = 49 + 1 = 50\nThe generating rule is n : ( n² + 1 ).\nApply the identical formula to 11:\n⇒ 11² + 1 = 121 + 1 = 122\n∴ Missing number = 122."
      }
    ],
    commonMistakes: [
      "Reversing the direction of the relationship (e.g. choosing Whole : Part when the prompt was Part : Whole).",
      "Selecting an answer based on broad association rather than the specific functional relationship."
    ]
  },

  "classification": {
    topicId: "classification",
    title: "Classification",
    category: "logical",
    introduction: "Classification (Odd-One-Out) tests the ability to recognize common invariants among a set of entities and isolate the single member that violates that shared property.",
    concepts: [
      {
        heading: "The Common Property Invariant",
        body: "• The correct rule MUST positively unite the other three options under a shared property, not merely point out an isolated quirk of one option.\n• Number Classifications: Prime vs Composite, Divisibility rules, Squares/Cubes, Digit sum parity.\n• Word Classifications: Semantic taxonomy, biological kingdoms, tool types, geographical categories."
      },
      {
        heading: "Alphabetical Cluster Rules",
        body: "Check the gaps between consecutive letters:\n• Constant step shifts (e.g. +2, +2, +2).\n• Vowel count invariants.\n• Symmetrical opposite-letter pairings."
      }
    ],
    formulas: [
      {
        name: "Common Property Invariant",
        formula: "∀ x ∈ Majority, Property(x) = True   ∧   Property(Outlier) = False",
        explanation: "The outlier must be the only element violating the property."
      }
    ],
    solvedExamples: [
      {
        problem: "Find the odd one out from the given numbers:",
        options: [
          { id: "A", text: "27" },
          { id: "B", text: "64" },
          { id: "C", text: "125" },
          { id: "D", text: "216" }
        ],
        correctOption: "B",
        solution: "Inspect powers:\n27 = 3³ (cube)\n64 = 4³ (cube) AND 8² (square)\n125 = 5³ (cube)\n216 = 6³ (cube)\nWhile all four numbers are perfect cubes, 64 is the ONLY number that is simultaneously a perfect square ( 8² = 64 ) and a perfect cube ( 4³ = 64 ).\n∴ 64 is the odd one out."
      },
      {
        problem: "Find the odd letter cluster among the options:",
        options: [
          { id: "A", text: "BDFH" },
          { id: "B", text: "JLNP" },
          { id: "C", text: "RTVX" },
          { id: "D", text: "KMPT" }
        ],
        correctOption: "D",
        solution: "Measure the alphabetical intervals between consecutive letters in each group:\n(A) B (+2) D (+2) F (+2) H ⇒ constant step of +2\n(B) J (+2) L (+2) N (+2) P ⇒ constant step of +2\n(C) R (+2) T (+2) V (+2) X ⇒ constant step of +2\n(D) K (+2) M (+3) P (+4) T ⇒ irregular variable steps (+2, +3, +4)\nClusters (A), (B), and (C) follow a uniform difference of +2, while (D) violates the invariant.\n∴ KMPT is the odd cluster."
      }
    ],
    commonMistakes: [
      "Choosing an answer based on an arbitrary feature that does not unify the remaining three options under a single logical rule.",
      "Overlooking prime numbers when analyzing odd-one-out numbers."
    ]
  },

  "statement-and-conclusion": {
    topicId: "statement-and-conclusion",
    title: "Statement and Conclusion",
    category: "logical",
    introduction: "Statement and Conclusion evaluates rigorous deductive reasoning, assessing whether a stated conclusion follows directly and indisputably from given premises without external extrapolation.",
    concepts: [
      {
        heading: "Absolute Premise Containment",
        body: "• Accept the statement as 100% indisputable truth, even if it contradicts everyday general knowledge.\n• A conclusion logically follows IF AND ONLY IF it is directly derived from the stated premises.\n• No Unwarranted Extrapolation: If an assertion requires unstated outside facts or assumptions, it does NOT follow."
      },
      {
        heading: "Extreme Modifiers & Qualifier Words",
        body: "• Beware of absolute qualifiers: Words like 'all', 'always', 'never', 'only' often render a conclusion invalid unless explicitly confirmed in the statement.\n• Nuanced quantifiers: 'Many' or 'most' means a majority, NOT 100%."
      }
    ],
    formulas: [
      {
        name: "Deductive Truth Containment",
        formula: "Conclusion Follows  <==>  Premises |= Conclusion",
        explanation: "Conclusion must be true in every model where premises hold."
      }
    ],
    solvedExamples: [
      {
        problem: "Statement: 'In country X, the government has mandated solar panels on all newly constructed commercial buildings to reduce carbon emissions.'\nConclusions:\nI. Commercial buildings in country X will generate a portion of their energy from solar power.\nII. Carbon emissions in country X will immediately drop to zero.\nWhich conclusion(s) follow?",
        options: [
          { id: "A", text: "Only Conclusion I follows" },
          { id: "B", text: "Only Conclusion II follows" },
          { id: "C", text: "Both Conclusions I and II follow" },
          { id: "D", text: "Neither Conclusion I nor II follows" }
        ],
        correctOption: "A",
        solution: "Evaluate Conclusion I:\nSince solar panels are mandated on all newly constructed commercial buildings, these buildings will generate solar energy.\n⇒ Conclusion I directly and indisputably follows.\nEvaluate Conclusion II:\nThe statement mentions an intention to reduce emissions, not that national emissions will instantaneously reach zero.\n⇒ 'Immediately drop to zero' is an unjustified extreme extrapolation. Conclusion II does not follow.\n∴ Only Conclusion I follows."
      },
      {
        problem: "Statement: 'Most students who practiced aptitude questions daily scored above 90% in campus recruitment tests.'\nConclusions:\nI. Practicing daily guarantees scoring above 90%.\nII. Some students who practiced daily scored 90% or below.\nWhich conclusion(s) follow?",
        options: [
          { id: "A", text: "Only Conclusion I follows" },
          { id: "B", text: "Only Conclusion II follows" },
          { id: "C", text: "Either Conclusion I or II follows" },
          { id: "D", text: "Neither Conclusion I nor II follows" }
        ],
        correctOption: "B",
        solution: "Evaluate Conclusion I:\nThe statement uses the quantifier 'Most', which means a majority, not 100%. Daily practice does not guarantee a >90% score.\n⇒ Conclusion I does not follow.\nEvaluate Conclusion II:\nSince only 'most' scored above 90%, the remaining fraction (the minority) of daily practitioners did not score above 90%.\n⇒ Conclusion II logically follows.\n∴ Only Conclusion II follows."
      }
    ],
    commonMistakes: [
      "Equating 'Most' with 'All' or 'Guaranteed'.",
      "Introducing personal real-world opinions that are not supported within the four corners of the statement."
    ]
  },

  "statement-and-assumption": {
    topicId: "statement-and-assumption",
    title: "Statement and Assumption",
    category: "logical",
    introduction: "Statement and Assumption evaluates the capacity to identify unstated premises taken for granted by the speaker when formulating an assertion.",
    concepts: [
      {
        heading: "What Constitutes an Assumption?",
        body: "• An assumption is a prerequisite belief taken for granted BEFORE making a statement.\n• An assumption is NOT a future consequence or prediction; it is an underlying foundation.\n• Desirability & Feasibility: When a policy, notice, or product is proposed, the author assumes it is both feasible to execute and desirable to the audience."
      },
      {
        heading: "The Negation Test",
        body: "• Apply the Negation Test: Mentally negate the candidate assumption. If negating it destroys the rationality or logic of the original statement, then the assumption is definitely IMPLICIT!"
      }
    ],
    formulas: [
      {
        name: "Negation Principle for Assumptions",
        formula: "¬Assumption ==> Statement Collapses",
        explanation: "If denying the assumption makes the statement absurd, it is implicit."
      }
    ],
    solvedExamples: [
      {
        problem: "Statement: 'Please do not lean against the train doors while the train is in motion.' — Warning sign inside a metro train.\nAssumptions:\nI. Passengers are capable of reading and understanding the warning notice.\nII. Leaning against doors while transit is in motion presents a potential safety hazard.\nWhich assumption(s) are implicit?",
        options: [
          { id: "A", text: "Only Assumption I is implicit" },
          { id: "B", text: "Only Assumption II is implicit" },
          { id: "C", text: "Both Assumptions I and II are implicit" },
          { id: "D", text: "Neither Assumption I nor II is implicit" }
        ],
        correctOption: "C",
        solution: "Apply the Negation Test to both candidate assumptions:\n1. Test Assumption I: Negate it: 'Passengers cannot read notices.' If passengers cannot read, posting the sign is completely futile. The authority must assume passengers can read.\n⇒ Assumption I is implicit.\n2. Test Assumption II: Negate it: 'Leaning against doors is 100% safe with zero hazard.' If true, there is no rationale for issuing a warning. The authority assumes leaning presents risk.\n⇒ Assumption II is implicit.\n∴ Both Assumptions I and II are implicit."
      },
      {
        problem: "Statement: 'Enroll in our 3-month coding bootcamp to secure a software engineering job at a top tech company.'\nAssumptions:\nI. The bootcamp curriculum teaches skills relevant to software engineering hiring standards.\nII. Only candidates who complete bootcamps can become software engineers.\nWhich assumption is implicit?",
        options: [
          { id: "A", text: "Only Assumption I is implicit" },
          { id: "B", text: "Only Assumption II is implicit" },
          { id: "C", text: "Both Assumptions I and II are implicit" },
          { id: "D", text: "Neither Assumption I nor II is implicit" }
        ],
        correctOption: "A",
        solution: "Evaluate Assumption I:\nThe advertiser claims their curriculum leads to tech jobs. They assume their coursework matches employer expectations. Negating it collapses the premise.\n⇒ Assumption I is implicit.\nEvaluate Assumption II:\nThe advertisement promotes their bootcamp as a viable path; it never claims it is the 'only' route into software engineering.\n⇒ Assumption II contains an unjustified absolute qualifier ('only') and is not implicit.\n∴ Only Assumption I is implicit."
      }
    ],
    commonMistakes: [
      "Confusing an assumption (prerequisite belief) with a conclusion (resulting outcome).",
      "Treating extreme exclusive words ('only', 'solely') as implicit assumptions without explicit warrant."
    ]
  },

  "ranking-and-ordering": {
    topicId: "ranking-and-ordering",
    title: "Ranking and Ordering",
    category: "logical",
    introduction: "Ranking and Ordering determines positions in queues, class ranks from opposite ends, overlapping separations, and total entity counts following position interchanges.",
    concepts: [
      {
        heading: "Total Count Formula from Both Ends",
        body: "• When one person's position is known from both ends of a row:\n  Total (T) = Rank from Left (L) + Rank from Right (R) - 1\n• (The '-1' is required because that individual is counted twice).\n• Rank from opposite end: R = Total - L + 1."
      },
      {
        heading: "Position Interchange & Overlapping Queues",
        body: "• When two persons A and B swap seats, the distance moved by A equals the distance moved by B.\n• Overlapping Row: If the sum of ranks from left and right exceeds total (L + R > T), persons cross over: Persons between = (L + R) - T - 2."
      }
    ],
    formulas: [
      {
        name: "Total Persons in Row",
        formula: "Total = Rank_left + Rank_right - 1",
        explanation: "Applies when a single individual's rank is known from both boundaries."
      },
      {
        name: "Opposite Rank Formula",
        formula: "Rank_right = Total - Rank_left + 1",
        explanation: "Finds rank from right given total and rank from left."
      },
      {
        name: "Overlapping Separation",
        formula: "Between = (Rank_left + Rank_right) - Total - 2",
        explanation: "Applies when individuals cross each other in a queue."
      }
    ],
    solvedExamples: [
      {
        problem: "In a class of 45 students, Rohit ranks 18th from the top. What is his rank from the bottom?",
        options: [
          { id: "A", text: "27th" },
          { id: "B", text: "28th" },
          { id: "C", text: "29th" },
          { id: "D", text: "26th" }
        ],
        correctOption: "B",
        solution: "Total students T = 45; Rank from top = 18.\nApply the opposite rank formula:\nRank from Bottom = Total - Rank from Top + 1\n⇒ Rank from Bottom = 45 - 18 + 1\n⇒ Rank from Bottom = 27 + 1 = 28\nVerification: 18 + 28 - 1 = 45.\n∴ Rohit's rank from the bottom is 28th."
      },
      {
        problem: "In a row of girls, Priya is 9th from the left and Neha is 16th from the right. If they interchange their positions, Priya becomes 25th from the left. How many girls are there in the row?",
        options: [
          { id: "A", text: "39" },
          { id: "B", text: "40" },
          { id: "C", text: "41" },
          { id: "D", text: "42" }
        ],
        correctOption: "B",
        solution: "After interchanging, Priya sits in Neha's original seat.\nPriya's new position = 25th from the left.\nThis same seat was originally 16th from the right (Neha's position).\nWe now know the position of this single seat from both ends of the row: L = 25, R = 16.\n⇒ Total girls = L + R - 1\n⇒ Total = 25 + 16 - 1 = 41 - 1 = 40\n∴ There are 40 girls in the row."
      }
    ],
    commonMistakes: [
      "Forgetting to subtract 1 when summing ranks of the same person from both ends.",
      "Forgetting to add 1 when calculating rank from the opposite end (Total - Rank + 1)."
    ]
  },

  "clocks-and-calendars": {
    topicId: "clocks-and-calendars",
    title: "Clocks and Calendars",
    category: "logical",
    introduction: "Clocks and Calendars calculates angular displacement of clock hands, coincidences, right angles, and Gregorian calendar cycles including leap years and odd-day arithmetic.",
    concepts: [
      {
        heading: "Clock Hand Dynamics & Angle Equation",
        body: "• Minute Hand: Rotates 360° in 60 mins ==> 6° per minute.\n• Hour Hand: Rotates 360° in 12 hours (720 mins) ==> 0.5° per minute.\n• Relative Speed of minute hand over hour hand = 6° - 0.5° = 5.5°/min = 11/2° per minute.\n• Angle between hands at H hours and M minutes: θ = |30H - (11/2)M|."
      },
      {
        heading: "Calendar Cycles & Odd Days",
        body: "• Ordinary Year = 365 days = 52 weeks + 1 Odd Day.\n• Leap Year = 366 days = 52 weeks + 2 Odd Days.\n• Leap Year Rule: Divisible by 4; century years must be divisible by 400 (e.g. 1900 is NOT a leap year; 2000 IS a leap year).\n• Odd days in centuries: 100 years = 5 odd days; 200 years = 3; 300 years = 1; 400 years = 0."
      }
    ],
    formulas: [
      {
        name: "Clock Angle Formula",
        formula: "θ = |30 · H - (11 / 2) · M|",
        explanation: "H: hour (1-12), M: minutes (0-59). Reflex angle = 360° - θ."
      },
      {
        name: "Leap Century Rule",
        formula: "Year is Leap  <==>  (Y mod 4 = 0 ∧ Y mod 100 ≠ 0) ∨ (Y mod 400 = 0)",
        explanation: "Determines leap status for all Gregorian calendar years."
      }
    ],
    solvedExamples: [
      {
        problem: "What is the angle between the hour hand and the minute hand of a clock at 3:40?",
        options: [
          { id: "A", text: "120°" },
          { id: "B", text: "125°" },
          { id: "C", text: "130°" },
          { id: "D", text: "140°" }
        ],
        correctOption: "C",
        solution: "At time H hours and M minutes, the angle θ between the hands is:\nθ = | 30H - ( 11/2 )M |\nHere, H = 3 and M = 40.\n⇒ θ = | 30 × 3 - ( 11/2 ) × 40 |\n⇒ θ = | 90 - 11 × 20 |\n⇒ θ = | 90 - 220 |\n⇒ θ = | -130 | = 130°\n∴ The angle between the hands is 130°."
      },
      {
        problem: "If 1st January 2006 was a Sunday, what day of the week was 1st January 2010?",
        options: [
          { id: "A", text: "Thursday" },
          { id: "B", text: "Friday" },
          { id: "C", text: "Saturday" },
          { id: "D", text: "Sunday" }
        ],
        correctOption: "B",
        solution: "Count the number of elapsed years between 2006 and 2010:\nNumber of years = 4 (2006, 2007, 2008, 2009).\nCount odd days for each year:\n• 2006: Ordinary year = 1 odd day\n• 2007: Ordinary year = 1 odd day\n• 2008: Leap year (divisible by 4) = 2 odd days\n• 2009: Ordinary year = 1 odd day\n⇒ Total odd days = 1 + 1 + 2 + 1 = 5 odd days\n⇒ Day of the week = Sunday + 5 days = Friday\n∴ 1st January 2010 was a Friday."
      }
    ],
    commonMistakes: [
      "Treating non-leap century years like 1700, 1800, 1900 as leap years (they are not divisible by 400).",
      "Using (11/2) times hours instead of minutes in the clock angle formula."
    ]
  },

  "non-verbal-reasoning": {
    topicId: "non-verbal-reasoning",
    title: "Non-verbal Reasoning",
    category: "logical",
    introduction: "Non-verbal Reasoning evaluates spatial intelligence, pattern matrices, rotational transformations, mirror reflections, and paper-folding projections.",
    concepts: [
      {
        heading: "Rotations & Element Shifts",
        body: "• Clockwise (+90°, +180°) vs Counter-Clockwise (-90°, -180°).\n• Elements may step systematically around the perimeter (corners, sides, center).\n• Alternate figure alternation: Odd figures follow Rule A, even figures follow Rule B."
      },
      {
        heading: "Mirror vs Water Reflections",
        body: "• Vertical Mirror Reflection: Inverts LEFT and RIGHT. Top and bottom remain strictly unchanged.\n• Horizontal Water Reflection: Inverts TOP and BOTTOM. Left and right remain strictly unchanged.\n• Paper Folding: The crease line acts as an axis of bilateral reflection."
      }
    ],
    formulas: [
      {
        name: "Mirror Image Transformation",
        formula: "(x, y)  ==>  (-x, y)",
        explanation: "Horizontal inversion across vertical axis."
      },
      {
        name: "Water Reflection Transformation",
        formula: "(x, y)  ==>  (x, -y)",
        explanation: "Vertical inversion across horizontal axis."
      }
    ],
    solvedExamples: [
      {
        problem: "In a visual sequence, an arrow initially points North (0°). In the 2nd figure it points North-East (45°), in the 3rd figure East (90°), and in the 4th figure South-East (135°). In which direction will it point in the 5th figure?",
        options: [
          { id: "A", text: "South-West" },
          { id: "B", text: "South" },
          { id: "C", text: "West" },
          { id: "D", text: "North-West" }
        ],
        correctOption: "B",
        solution: "Track the angular rotation: The arrow rotates clockwise by +45° at each step:\n• Step 1: 0° (North)\n• Step 2: 45° (North-East)\n• Step 3: 90° (East)\n• Step 4: 135° (South-East)\n⇒ Add 45° to the 4th position: 135° + 45° = 180°\nAn angle of 180° corresponds to South.\n∴ The arrow in the 5th figure points South."
      },
      {
        problem: "Which of the following capital letters remains completely unchanged under a horizontal water reflection?",
        options: [
          { id: "A", text: "A" },
          { id: "B", text: "B" },
          { id: "C", text: "H" },
          { id: "D", text: "M" }
        ],
        correctOption: "C",
        solution: "A horizontal water reflection inverts an object vertically (top and bottom swap, left and right remain identical).\nA letter remains unchanged if and only if it possesses horizontal bilateral symmetry:\n• 'A' inverted vertically turns upside down (∀) ⇒ changed.\n• 'B' has a smaller top lobe and wider bottom lobe in standard typography ⇒ changed.\n• 'H' has perfect horizontal bilateral symmetry across its middle bar ⇒ unchanged.\n• 'M' inverted vertically turns into 'W' ⇒ changed.\n∴ The letter 'H' remains unchanged."
      }
    ],
    commonMistakes: [
      "Inverting top and bottom when looking for a vertical mirror image.",
      "Confusing 45° rotational steps with 90° right angles in figure series."
    ]
  }
};
