/**
 * Quantitative Aptitude Concepts, Formulas, Solved Examples, and Common Pitfalls
 * Comprehensive guides for all 16 Quantitative Topics in CareerForge AI.
 * Formatted in authentic competitive examination / IndiaBIX worked example structure.
 */

export const QUANTITATIVE_CONCEPTS = {
  "number-system": {
    topicId: "number-system",
    title: "Number System",
    category: "quantitative",
    introduction: "Number System is the bedrock of quantitative aptitude. It governs the structural properties of integers, classifications of real numbers, divisibility tests, unit digit cyclicity, factor theory, and remainder theorems.",
    concepts: [
      {
        heading: "Classification of Numbers & Divisibility Tests",
        body: "• Natural Numbers (N = {1, 2, 3...}), Whole Numbers (W = {0, 1, 2...}), and Integers (Z = {..., -2, -1, 0, 1, 2...}).\n• Prime Numbers: Numbers greater than 1 divisible only by 1 and themselves (2 is the only even prime).\n• Divisibility by 3 & 9: Sum of digits must be divisible by 3 or 9.\n• Divisibility by 4 & 8: Last 2 digits (for 4) or last 3 digits (for 8) must be divisible by 4 or 8.\n• Divisibility by 11: Difference between the sum of digits at odd places and the sum of digits at even places must be 0 or a multiple of 11."
      },
      {
        heading: "Unit Digit Cyclicity & Factor Theory",
        body: "Powers of integers follow repeating 4-step cycles in their unit digits:\n• 2, 3, 7, 8 have a cyclicity of 4.\n• 4 and 9 have a cyclicity of 2 (4^odd=4, 4^even=6; 9^odd=9, 9^even=1).\n• 0, 1, 5, 6 always maintain the same unit digit for any positive integer power.\nTo find the unit digit of x^n, evaluate the remainder when n is divided by 4 (if remainder is 0, use the 4th power)."
      }
    ],
    formulas: [
      {
        name: "Division Algorithm",
        formula: "Dividend = (Divisor × Quotient) + Remainder",
        explanation: "Where 0 ≤ Remainder < Divisor."
      },
      {
        name: "HCF and LCM Product Rule",
        formula: "HCF(A, B) × LCM(A, B) = A × B",
        explanation: "Strictly valid for any two positive integers A and B."
      },
      {
        name: "Total Number of Factors",
        formula: "If N = p^a · q^b · r^c, Total Factors = (a + 1)(b + 1)(c + 1)",
        explanation: "Where p, q, and r are distinct prime factors of N."
      },
      {
        name: "Sum of First n Natural Numbers",
        formula: "S_n = [n(n + 1)] / 2",
        explanation: "Sum of squares = [n(n + 1)(2n + 1)] / 6; Sum of cubes = [n(n + 1) / 2]²."
      }
    ],
    solvedExamples: [
      {
        problem: "What is the unit digit in the product 7^105 ?",
        options: [
          { id: "A", text: "1" },
          { id: "B", text: "3" },
          { id: "C", text: "7" },
          { id: "D", text: "9" }
        ],
        correctOption: "C",
        solution: "Unit digit in powers of 7 follows a 4-step recurring cycle:\n7¹ = 7 ;\n7² = 49 ;\n7³ = 343 ;\n7⁴ = 2401 ;\nDividing the power 105 by 4 gives a remainder of 1 .\n⇒ 105 = ( 4 × 26 ) + 1 .\n∴ Unit digit of 7¹⁰⁵ = Unit digit of 7¹ = 7 ."
      },
      {
        problem: "The HCF of two numbers is 12 and their LCM is 240. If one of the numbers is 48, what is the other number?",
        options: [
          { id: "A", text: "54" },
          { id: "B", text: "60" },
          { id: "C", text: "72" },
          { id: "D", text: "84" }
        ],
        correctOption: "B",
        solution: "Product of two numbers = HCF × LCM ;\nLet the required number be B ;\n⇒ 48 × B = 12 × 240 ;\n⇒ 48 × B = 2880 ;\n⇒ B = ( 2880 / 48 ) ;\n∴ Other number = 60 ."
      }
    ],
    commonMistakes: [
      "When evaluating unit digit cyclicity with a remainder of 0 (e.g. 7^100), using power 0 instead of the 4th power (7^4).",
      "Attempting to apply HCF(A,B,C) × LCM(A,B,C) = A × B × C; this relationship is only true for two numbers."
    ]
  },

  "simplification": {
    topicId: "simplification",
    title: "Simplification",
    category: "quantitative",
    introduction: "Simplification tests mastery of the standard operational hierarchy of arithmetic (VBODMAS), algebraic identities, fraction arithmetic, surds, and decimal conversions.",
    concepts: [
      {
        heading: "The VBODMAS Hierarchy",
        body: "Operations must strictly follow this precedence order:\n1. V (Vinculum / Bar over digits: e.g. 5 - 2 with a bar over it must be resolved first).\n2. B (Brackets: innermost round '()', then curly '{}', then square '[]').\n3. O (Of / Orders: powers, roots, and percentages).\n4. D & M (Division and Multiplication: equal precedence, evaluated from left to right).\n5. A & S (Addition and Subtraction: equal precedence, evaluated from left to right)."
      },
      {
        heading: "Standard Algebraic Identity Shortcuts",
        body: "Many complex numerical expressions reduce rapidly using identity theorems:\n• a² - b² = (a - b)(a + b)\n• (a + b)³ = a³ + b³ + 3ab(a + b)\n• a³ + b³ = (a + b)(a² - ab + b²)  ==>  (a³ + b³) / (a² - ab + b²) = a + b\n• If a + b + c = 0, then a³ + b³ + c³ = 3abc."
      }
    ],
    formulas: [
      {
        name: "Cubic Sum Identity",
        formula: "(a³ + b³) / (a² - ab + b²) = a + b",
        explanation: "Analogously, (a³ - b³) / (a² + ab + b²) = a - b."
      },
      {
        name: "Difference of Squares",
        formula: "a² - b² = (a + b)(a - b)",
        explanation: "Crucial for rationalizing radical denominators with conjugates."
      },
      {
        name: "Radical Rationalization",
        formula: "1 / (√a + √b) = (√a - √b) / (a - b)",
        explanation: "Multiply numerator and denominator by conjugate (√a - √b)."
      }
    ],
    solvedExamples: [
      {
        problem: "Evaluate: 36 - 2 × [ 15 - { 8 ÷ 2 + ( 6 - (4 - 1) ) } ] where (4 - 1) is under a vinculum.",
        options: [
          { id: "A", text: "16" },
          { id: "B", text: "18" },
          { id: "C", text: "20" },
          { id: "D", text: "24" }
        ],
        correctOption: "C",
        solution: "Evaluating vinculum first: 4 - 1 = 3 ;\nInside parentheses: ( 6 - 3 ) = 3 ;\nInside curly brackets: { 8 ÷ 2 + 3 } = { 4 + 3 } = 7 ;\nInside square brackets: [ 15 - 7 ] = 8 ;\n⇒ Expression = 36 - 2 × 8 ;\n⇒ 36 - 16 = 20 ;\n∴ Result = 20 ."
      },
      {
        problem: "Simplify: ( 0.87 × 0.87 × 0.87 + 0.13 × 0.13 × 0.13 ) / ( 0.87 × 0.87 - 0.87 × 0.13 + 0.13 × 0.13 ) .",
        options: [
          { id: "A", text: "0.74" },
          { id: "B", text: "1" },
          { id: "C", text: "1.25" },
          { id: "D", text: "2" }
        ],
        correctOption: "B",
        solution: "Let a = 0.87 and b = 0.13 ;\nGiven expression is of the form: ( a³ + b³ / a² - ab + b² ) ;\nUsing identity: a³ + b³ = ( a + b )( a² - ab + b² ) ;\n⇒ ( a³ + b³ / a² - ab + b² ) = ( a + b ) ;\n⇒ 0.87 + 0.13 = 1 ;\n∴ Value = 1 ."
      }
    ],
    commonMistakes: [
      "Performing addition before subtraction when subtraction appears further to the left (e.g. 10 - 3 + 2 is 7 + 2 = 9, not 10 - 5 = 5).",
      "Failing to distribute negative signs across brackets: -(x - y) = -x + y."
    ]
  },

  "percentages": {
    topicId: "percentages",
    title: "Percentages",
    category: "quantitative",
    introduction: "Percentages quantify proportional parts per hundred and serve as the core language of commercial mathematics, growth metrics, and data analysis.",
    concepts: [
      {
        heading: "The Percentage Base Rule",
        body: "Percentage means 'per 100'. When computing percentage change, the denominator MUST ALWAYS be the initial (original) base value:\n• % Increase = [(New Value - Original Value) / Original Value] × 100%\n• % Decrease = [(Original Value - New Value) / Original Value] × 100%"
      },
      {
        heading: "Successive Changes & Product Constancy",
        body: "• If a value changes successively by a% and b%, the combined net change is [a + b + (ab / 100)]%.\n• Expenditure = Price × Consumption. If Price increases by r%, consumption must decrease by [r / (100 + r)] × 100% to keep expenditure constant."
      }
    ],
    formulas: [
      {
        name: "Percentage Value",
        formula: "Value = (P / 100) × Base",
        explanation: "P is the percentage rate; Base is the reference whole."
      },
      {
        name: "Successive Percentage Change",
        formula: "Net % = a + b + (ab / 100)",
        explanation: "Use positive signs for increases and negative signs for decreases or discounts."
      },
      {
        name: "Price-Consumption Invariance",
        formula: "Consumption Reduction % = [r / (100 + r)] × 100%",
        explanation: "Where r is the percentage increase in unit price."
      }
    ],
    solvedExamples: [
      {
        problem: "The price of an article is increased by 25% and then discounted by 20% on the new price. What is the net percentage change in price?",
        options: [
          { id: "A", text: "5% increase" },
          { id: "B", text: "5% decrease" },
          { id: "C", text: "0% (No change)" },
          { id: "D", text: "4% decrease" }
        ],
        correctOption: "C",
        solution: "Let initial price = Rs. 100 ;\nPrice after 25% increase = Rs. 125 ;\nDiscount of 20% on Rs. 125 = ( 125 × 20 / 100 ) = Rs. 25 ;\nFinal price = Rs. ( 125 - 25 ) = Rs. 100 ;\n(Using formula: a + b + ab/100 = 25 - 20 - 500/100 = 0% ) ;\n∴ Net percentage change = 0% (No change) ."
      },
      {
        problem: "If the price of petrol increases by 25%, by what percentage must a driver reduce petrol consumption so that monthly fuel expenditure remains constant?",
        options: [
          { id: "A", text: "16 2/3%" },
          { id: "B", text: "20%" },
          { id: "C", text: "25%" },
          { id: "D", text: "15%" }
        ],
        correctOption: "B",
        solution: "Reduction in consumption = [ r / (100 + r) ] × 100% ;\n= ( 25 / 125 ) × 100% ;\n= ( 1/5 × 100 )% ;\n= 20% ;\n∴ Required consumption reduction = 20% ."
      }
    ],
    commonMistakes: [
      "Dividing by the final value instead of the original base value when calculating percentage growth.",
      "Assuming successive percentage changes add linearly (e.g. +20% followed by -20% does not equal 0%; it produces a net 4% loss)."
    ]
  },

  "profit-and-loss": {
    topicId: "profit-and-loss",
    title: "Profit and Loss",
    category: "quantitative",
    introduction: "Profit and Loss models commercial transactions involving Cost Price (CP), Selling Price (SP), Marked Price (MP), and promotional discounts.",
    concepts: [
      {
        heading: "Cost Price vs Selling Price vs Marked Price",
        body: "• Cost Price (CP): The actual cost incurred to purchase or produce the article.\n• Selling Price (SP): The amount received upon sale.\n• Marked Price (MP / List Price): The catalog price before discounts.\n• Profit occurs when SP > CP (Profit = SP - CP). Loss occurs when CP > SP (Loss = CP - SP).\n• Profit% and Loss% are STRICTLY calculated on Cost Price (CP) unless explicitly specified otherwise."
      },
      {
        heading: "Discounts & The Equal Selling Price Rule",
        body: "• Discount is ALWAYS calculated on Marked Price (MP): Discount = MP - SP; Discount% = (Discount / MP) × 100%.\n• When two articles are sold at the same Selling Price, one at a gain of x% and the other at a loss of x%, there is always an overall net LOSS of (x² / 100)%."
      }
    ],
    formulas: [
      {
        name: "Profit and Loss Percentages",
        formula: "Profit % = (Profit / CP) × 100   |   Loss % = (Loss / CP) × 100",
        explanation: "Always calculated with CP in the denominator."
      },
      {
        name: "Selling Price from CP",
        formula: "SP = CP × [(100 + P%) / 100]   |   SP = CP × [(100 - L%) / 100]",
        explanation: "P% is profit percentage; L% is loss percentage."
      },
      {
        name: "Marked Price to Cost Price Ratio",
        formula: "MP / CP = (100 + Profit %) / (100 - Discount %)",
        explanation: "Directly relates markup and discount to target profit."
      },
      {
        name: "Net Loss on Equal SP",
        formula: "Overall Loss % = (x² / 100)%",
        explanation: "Applies when two items have identical SP with equal +x% and -x% outcomes."
      }
    ],
    solvedExamples: [
      {
        problem: "A shopkeeper buys an article for Rs. 800. At what price should he mark it so that after allowing a 20% discount, he still earns a profit of 25%?",
        options: [
          { id: "A", text: "Rs. 1150" },
          { id: "B", text: "Rs. 1200" },
          { id: "C", text: "Rs. 1250" },
          { id: "D", text: "Rs. 1300" }
        ],
        correctOption: "C",
        solution: "Cost Price (CP) = Rs. 800 ; Desired profit = 25% ;\nTarget Selling Price (SP) = ( 800 × 125 / 100 ) = Rs. 1000 ;\nSince discount = 20% on Marked Price (MP) :\n⇒ 80% of MP = Rs. 1000 ;\n⇒ ( 80 × MP / 100 ) = 1000 ;\n⇒ MP = ( 1000 × 100 / 80 ) ;\n∴ Marked Price = Rs. 1250 ."
      },
      {
        problem: "A merchant sells two bicycles for Rs. 4,800 each. On one he gains 20%, and on the other he loses 20%. What is his overall gain or loss percentage?",
        options: [
          { id: "A", text: "No profit, no loss" },
          { id: "B", text: "2% loss" },
          { id: "C", text: "4% loss" },
          { id: "D", text: "4% gain" }
        ],
        correctOption: "C",
        solution: "When two articles have equal Selling Prices with equal +x% and -x% :\nOverall Loss % = ( x² / 100 )% ;\n= ( 20² / 100 )% ;\n= ( 400 / 100 )% ;\n= 4% ;\n∴ Overall result = 4% Loss ."
      }
    ],
    commonMistakes: [
      "Calculating discount percentage on Cost Price rather than Marked Price.",
      "Assuming that selling two articles at equal SP with +20% and -20% results in zero net gain and zero net loss."
    ]
  },

  "ratio-and-proportion": {
    topicId: "ratio-and-proportion",
    title: "Ratio and Proportion",
    category: "quantitative",
    introduction: "Ratio and Proportion compares quantities of the same dimension and provides tools for scaling, proportional division, finding mean proportionals, and mixing components.",
    concepts: [
      {
        heading: "Fundamental Definitions",
        body: "• Ratio (a : b) expresses the relative magnitude of a and b (where b ≠ 0). Multiplying or dividing both terms by any non-zero constant k leaves the ratio unchanged: a:b = ka:kb.\n• Proportion: When two ratios are equal, a:b = c:d (written a:b :: c:d). Here a and d are the 'extremes', and b and c are the 'means'. The fundamental property is: Product of Extremes = Product of Means (ad = bc)."
      },
      {
        heading: "Proportional Variations & Combining Ratios",
        body: "• Mean Proportional between a and b is √(ab).\n• Third Proportional to a and b is x such that a:b = b:x  ==>  x = b² / a.\n• Fourth Proportional to a, b, c is x such that a:b = c:x  ==>  x = bc / a.\n• Combining Ratios: If A:B = a:b and B:C = c:d, make the common term B equal by scaling: A:B:C = (a × c) : (b × c) : (b × d)."
      }
    ],
    formulas: [
      {
        name: "Cross-Product Rule",
        formula: "a : b :: c : d  <==>  a · d = b · c",
        explanation: "Product of extremes equals product of means."
      },
      {
        name: "Mean Proportional",
        formula: "Mean Proportional = √(a · b)",
        explanation: "Geometric mean of numbers a and b."
      },
      {
        name: "Third Proportional",
        formula: "Third Proportional = b² / a",
        explanation: "For the continued proportion a : b :: b : x."
      },
      {
        name: "Combined Ratio",
        formula: "A:B = a:b & B:C = c:d  ==>  A:B:C = ac : bc : bd",
        explanation: "Scales both ratios to equate the shared middle term B."
      }
    ],
    solvedExamples: [
      {
        problem: "If A : B = 3 : 4 and B : C = 8 : 9, find the ratio A : C .",
        options: [
          { id: "A", text: "1 : 2" },
          { id: "B", text: "2 : 3" },
          { id: "C", text: "3 : 5" },
          { id: "D", text: "4 : 5" }
        ],
        correctOption: "B",
        solution: "A/B = 3/4 and B/C = 8/9 ;\nMultiply both ratios together :\n⇒ ( A / B ) × ( B / C ) = ( 3/4 × 8/9 ) ;\n⇒ A / C = ( 24 / 36 ) ;\n⇒ A / C = 2/3 ;\n∴ A : C = 2 : 3 ."
      },
      {
        problem: "A bag contains 50p, 25p, and 10p coins in the ratio 5 : 9 : 4, amounting to Rs. 206 in total. Find the number of 50p coins.",
        options: [
          { id: "A", text: "150" },
          { id: "B", text: "180" },
          { id: "C", text: "200" },
          { id: "D", text: "240" }
        ],
        correctOption: "C",
        solution: "Let number of coins be 5x, 9x, and 4x respectively ;\nValue of 50p coins = Rs. ( 5x × 0.50 ) = Rs. 2.50x ;\nValue of 25p coins = Rs. ( 9x × 0.25 ) = Rs. 2.25x ;\nValue of 10p coins = Rs. ( 4x × 0.10 ) = Rs. 0.40x ;\nTotal monetary sum = 2.50x + 2.25x + 0.40x = 5.15x ;\n⇒ 5.15x = 206 ;\n⇒ x = ( 206 / 5.15 ) = 40 ;\n∴ Number of 50p coins = 5 × 40 = 200 ."
      }
    ],
    commonMistakes: [
      "Confusing the ratio of coin counts with the ratio of total monetary value.",
      "Dividing an amount into ratio a:b by dividing by a or b instead of the sum of terms (a + b)."
    ]
  },

  "averages": {
    topicId: "averages",
    title: "Averages",
    category: "quantitative",
    introduction: "Averages measures central tendency across sets of numerical observations. Mastery includes arithmetic mean, weighted averages, and rapid deviation shortcuts for additions, removals, and replacements.",
    concepts: [
      {
        heading: "Arithmetic Mean & Weighted Average",
        body: "• Average = (Sum of all observations) / (Total number of observations).\n• Weighted Average: When combining subsets with sizes n₁, n₂ and respective averages A₁, A₂, the combined average is [n₁A₁ + n₂A₂] / (n₁ + n₂)."
      },
      {
        heading: "The Deviation & Replacement Shortcut",
        body: "Instead of recalculating full sums, track net deviations:\n• New Member Included = New Average + [Old Count × Increase in Average]\n• Member Replaced = Replaced Member's Weight + [Total Count × Net Increase in Average]\n• Erroneous Entry Corrected: Correct Average = Stated Average + [(Correct Value - Incorrect Value) / Total Count]."
      }
    ],
    formulas: [
      {
        name: "Arithmetic Average",
        formula: "Average = Σx / N",
        explanation: "Σx is the total sum of observations; N is the count of items."
      },
      {
        name: "Weighted Average",
        formula: "A_w = (n₁A₁ + n₂A₂) / (n₁ + n₂)",
        explanation: "Combines two distinct groups with different sizes and averages."
      },
      {
        name: "Replacement Formula",
        formula: "Weight of New Person = Weight of Replaced Person ± (N × ΔA)",
        explanation: "N is total group size; ΔA is the shift in the average."
      }
    ],
    solvedExamples: [
      {
        problem: "The average weight of 24 students in a class is 40 kg. If the teacher's weight is included, the average increases by 1 kg. What is the teacher's weight?",
        options: [
          { id: "A", text: "60 kg" },
          { id: "B", text: "64 kg" },
          { id: "C", text: "65 kg" },
          { id: "D", text: "66 kg" }
        ],
        correctOption: "C",
        solution: "Total weight of 24 students = ( 24 × 40 ) = 960 kg ;\nTotal members including teacher = 25 ;\nNew average = 40 + 1 = 41 kg ;\nTotal weight of 25 persons = ( 25 × 41 ) = 1025 kg ;\nTeacher's weight = ( 1025 - 960 ) = 65 kg ;\n(Shortcut: 41 + 24 × 1 = 65 kg ) ;\n∴ Teacher's weight = 65 kg ."
      },
      {
        problem: "The average marks of 50 students were calculated as 68. Later, it was found that a score of 48 was misread as 84. What is the correct average marks?",
        options: [
          { id: "A", text: "66.82" },
          { id: "B", text: "67.28" },
          { id: "C", text: "67.50" },
          { id: "D", text: "68.72" }
        ],
        correctOption: "B",
        solution: "Correct marks = 48 ; Incorrect marks = 84 ;\nNet difference in total sum = ( 48 - 84 ) = -36 ;\nChange in average = ( -36 / 50 ) = -0.72 ;\nCorrect Average = 68 - 0.72 = 67.28 ;\n∴ Correct average = 67.28 ."
      }
    ],
    commonMistakes: [
      "Forgetting to update the denominator count when a person joins (using N instead of N + 1).",
      "Subtracting the correction in the wrong direction when correcting misread values."
    ]
  },

  "time-and-work": {
    topicId: "time-and-work",
    title: "Time and Work",
    category: "quantitative",
    introduction: "Time and Work analyzes reciprocal productivity rates, work efficiency ratios, cooperative labor, alternate-day work cycles, and pipes & cistern hydraulics.",
    concepts: [
      {
        heading: "The Unitary Work Rate & LCM Method",
        body: "• If a person completes a full task in n days, the fraction of work completed in 1 day is 1/n.\n• LCM Method: Assume total work to be the LCM of individual times. This replaces unwieldy fractions with clean integer units of work per day."
      },
      {
        heading: "Efficiency Ratios & Pipes and Cisterns",
        body: "• Efficiency is inversely proportional to time taken: If A is twice as efficient as B, A takes half the time of B to complete the same work.\n• Men-Days Formula: (M₁ × D₁ × H₁) / W₁ = (M₂ × D₂ × H₂) / W₂.\n• Pipes & Cisterns: An inlet pipe adds positive work (+1/A); a leak or outlet pipe contributes negative work (-1/B)."
      }
    ],
    formulas: [
      {
        name: "Combined Time (Two Workers)",
        formula: "Time = (A × B) / (A + B)",
        explanation: "Where A and B are the individual times required to complete the task alone."
      },
      {
        name: "Chain Rule / Men-Days Equation",
        formula: "(M₁ · D₁ · H₁) / W₁ = (M₂ · D₂ · H₂) / W₂",
        explanation: "M: workers, D: days, H: daily hours, W: work units completed."
      },
      {
        name: "Net Filling Rate (Inlet + Leak)",
        formula: "Net Rate = (1 / Inlet) - (1 / Leak)",
        explanation: "Tanks fill only when inlet rate exceeds the leak rate."
      }
    ],
    solvedExamples: [
      {
        problem: "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is :",
        options: [
          { id: "A", text: "7/15" },
          { id: "B", text: "1/10" },
          { id: "C", text: "1/4" },
          { id: "D", text: "8/15" }
        ],
        correctOption: "D",
        solution: "A's 1 day's work = 1/15 ;\nB's 1 day's work = 1/20 ;\n(A + B)'s 1 day's work = ( 1/15 + 1/20 ) = 7/60 .\n(A + B)'s 4 day's work = ( 7/60 × 4 ) = 7/15 .\nTherefore, Remaining work = ( 1 - 7/15 ) = 8/15 ."
      },
      {
        problem: "Pipe A can fill a tank in 10 hours and Pipe B can fill it in 15 hours. Pipe C can empty the full tank in 20 hours. If all three pipes are opened simultaneously, how long will it take to fill the tank?",
        options: [
          { id: "A", text: "7 hours" },
          { id: "B", text: "8 4/7 hours" },
          { id: "C", text: "9 hours" },
          { id: "D", text: "10 1/2 hours" }
        ],
        correctOption: "B",
        solution: "Part filled by A in 1 hr = 1/10 ;\nPart filled by B in 1 hr = 1/15 ;\nPart emptied by C in 1 hr = 1/20 ;\nNet part filled in 1 hour = ( 1/10 + 1/15 - 1/20 ) = 7/60 .\n∴ Time taken to fill the tank = 60/7 hours = 8 4/7 hours."
      }
    ],
    commonMistakes: [
      "Adding days directly (e.g. 12 days + 18 days = 30 days) instead of combining reciprocal work rates.",
      "Treating an emptying leak as positive work instead of subtracting its rate."
    ]
  },

  "time-speed-distance": {
    topicId: "time-speed-distance",
    title: "Time, Speed and Distance",
    category: "quantitative",
    introduction: "Covers uniform kinematics, unit conversions between km/h and m/s, relative velocity between moving bodies, train crossings, and river current problems (boats & streams).",
    concepts: [
      {
        heading: "Fundamental Kinematic Relationships & Unit Conversions",
        body: "• Speed = Distance / Time; Distance = Speed × Time; Time = Distance / Speed.\n• To convert km/h to m/s: Multiply by 5/18 (1 km/h = 1000m / 3600s = 5/18 m/s).\n• To convert m/s to km/h: Multiply by 18/5.\n• Average Speed for Equal Distances: Harmonic mean = [2uv] / (u + v)."
      },
      {
        heading: "Relative Speed, Trains & River Streams",
        body: "• Relative Speed:\n  - Moving in opposite directions: Relative Speed = S₁ + S₂.\n  - Moving in the same direction: Relative Speed = |S₁ - S₂|.\n• Train Crossing:\n  - Point object (pole, stationary person): Distance = Length of train.\n  - Extended platform or bridge: Distance = Length of train + Length of platform.\n• Boats & Streams: Boat speed in still water = u, Stream speed = v.\n  - Downstream Speed (D) = u + v\n  - Upstream Speed (U) = u - v\n  - u = (D + U) / 2; v = (D - U) / 2."
      }
    ],
    formulas: [
      {
        name: "Average Speed (Equal Distances)",
        formula: "Average Speed = (2 · u · v) / (u + v)",
        explanation: "Harmonic mean when equal distances are covered at speeds u and v."
      },
      {
        name: "Relative Velocity",
        formula: "Opposite: S₁ + S₂   |   Same Direction: |S₁ - S₂|",
        explanation: "Governs time-to-meet and overtaking problems."
      },
      {
        name: "Still Water Boat Speed",
        formula: "u = (Downstream + Upstream) / 2",
        explanation: "Arithmetic mean of downstream and upstream velocities."
      },
      {
        name: "Stream Current Speed",
        formula: "v = (Downstream - Upstream) / 2",
        explanation: "Half the difference between downstream and upstream velocities."
      }
    ],
    solvedExamples: [
      {
        problem: "A train 150 meters long traveling at 54 km/h crosses a railway platform in 20 seconds. What is the length of the platform?",
        options: [
          { id: "A", text: "120 m" },
          { id: "B", text: "140 m" },
          { id: "C", text: "150 m" },
          { id: "D", text: "180 m" }
        ],
        correctOption: "C",
        solution: "Speed of train = ( 54 × 5/18 ) = 15 m/s ;\nDistance covered in 20 seconds = ( 15 × 20 ) = 300 m ;\nDistance = Length of train + Length of platform ;\n⇒ 300 = 150 + Length of platform ;\n∴ Length of platform = ( 300 - 150 ) = 150 m ."
      },
      {
        problem: "A motorboat travels 24 km downstream in 2 hours and takes 4 hours to return upstream. Find the speed of the motorboat in still water.",
        options: [
          { id: "A", text: "8 km/h" },
          { id: "B", text: "9 km/h" },
          { id: "C", text: "10 km/h" },
          { id: "D", text: "12 km/h" }
        ],
        correctOption: "B",
        solution: "Downstream speed (D) = ( 24 / 2 ) = 12 km/h ;\nUpstream speed (U) = ( 24 / 4 ) = 6 km/h ;\nSpeed of boat in still water = ( D + U / 2 ) ;\n= ( 12 + 6 / 2 ) = ( 18 / 2 ) = 9 km/h ;\n∴ Speed of motorboat in still water = 9 km/h ."
      }
    ],
    commonMistakes: [
      "Mixing units (e.g. multiplying km/h by seconds without converting to m/s first).",
      "Using the simple arithmetic average (u + v) / 2 for round-trip speeds instead of the harmonic mean 2uv / (u + v)."
    ]
  },

  "simple-interest": {
    topicId: "simple-interest",
    title: "Simple Interest",
    category: "quantitative",
    introduction: "Simple Interest (SI) computes financial returns strictly on the original principal balance throughout the entire duration of a loan or investment.",
    concepts: [
      {
        heading: "Core Variables & Deterministic Linearity",
        body: "• Principal (P): The original capital borrowed or invested.\n• Rate (R): Annual percentage rate.\n• Time (T): Time period measured strictly in years.\n• Amount (A): Total accumulated balance: A = P + SI.\n• Linearity: Simple interest earned is strictly identical every year because the interest-earning base never changes."
      },
      {
        heading: "The Sum Multiplier Shortcut",
        body: "If a sum of money becomes N times itself in T years at simple interest:\n• The interest earned is (N - 1) × P.\n• Rate of Interest: R = [(N - 1) × 100] / T."
      }
    ],
    formulas: [
      {
        name: "Simple Interest Formula",
        formula: "SI = (P · R · T) / 100",
        explanation: "P: principal, R: annual rate %, T: duration in years."
      },
      {
        name: "Maturity Amount",
        formula: "A = P + SI = P · [1 + (R · T) / 100]",
        explanation: "Total repayment amount at conclusion of loan."
      },
      {
        name: "Multiplier Rule (N-fold in T years)",
        formula: "R = [(N - 1) · 100] / T",
        explanation: "Calculates annual rate when capital increases N times."
      }
    ],
    solvedExamples: [
      {
        problem: "A sum of Rs. 1200 is lent at a certain rate of interest for a certain number of years, numerically equal to the rate percent. If the interest paid is Rs. 432, what is the rate of interest?",
        options: [
          { id: "A", text: "3.6%" },
          { id: "B", text: "6%" },
          { id: "C", text: "18%" },
          { id: "D", text: "4%" }
        ],
        correctOption: "B",
        solution: "Let rate = R% and time = R years.\nThen, ( 1200 × R × R / 100 ) = 432\n⇒ 12R² = 432\n⇒ R² = 36\n⇒ R = 6."
      },
      {
        problem: "A sum of money amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years at simple interest. Find the sum (principal).",
        options: [
          { id: "A", text: "Rs. 650" },
          { id: "B", text: "Rs. 690" },
          { id: "C", text: "Rs. 698" },
          { id: "D", text: "Rs. 700" }
        ],
        correctOption: "C",
        solution: "S.I. for 1 year = Rs. (854 - 815) = Rs. 39.\nS.I. for 3 years = Rs. (39 × 3) = Rs. 117.\n∴ Principal = Rs. (815 - 117) = Rs. 698."
      }
    ],
    commonMistakes: [
      "When a sum becomes N times, counting interest as NP instead of (N - 1)P.",
      "Plugging in months directly as T without dividing by 12 (e.g. 6 months must be 6/12 = 0.5 years)."
    ]
  },

  "compound-interest": {
    topicId: "compound-interest",
    title: "Compound Interest",
    category: "quantitative",
    introduction: "Compound Interest (CI) generates exponential returns by compounding interest onto accumulated interest across consecutive compounding periods.",
    concepts: [
      {
        heading: "Compounding Frequencies",
        body: "• Annually: A = P × [1 + (R / 100)]ⁿ\n• Semi-Annually (Half-Yearly): Rate becomes R/2%, and number of compounding periods becomes 2n.\n• Quarterly: Rate becomes R/4%, and number of compounding periods becomes 4n.\n• Compound Interest = Amount - Principal (CI = A - P)."
      },
      {
        heading: "The CI vs SI Difference Formulas",
        body: "The difference between Compound Interest and Simple Interest is a classic exam benchmark:\n• For 2 Years: Δ₂ = CI - SI = P × (R / 100)²\n• For 3 Years: Δ₃ = CI - SI = P × (R / 100)² × [(300 + R) / 100]."
      }
    ],
    formulas: [
      {
        name: "Compound Amount Formula",
        formula: "A = P · [1 + (R / 100)]ⁿ",
        explanation: "P: principal, R: annual rate %, n: number of compounding years."
      },
      {
        name: "Compound Interest",
        formula: "CI = A - P = P · {[1 + (R / 100)]ⁿ - 1}",
        explanation: "Net interest accumulated over principal P."
      },
      {
        name: "Two-Year CI-SI Difference",
        formula: "Δ₂ = P · (R / 100)²",
        explanation: "Exact difference between CI and SI for 2 years at annual rate R."
      }
    ],
    solvedExamples: [
      {
        problem: "The difference between simple interest and compound interest on a certain principal sum at 5% per annum for 2 years is Rs. 15. Find the principal sum.",
        options: [
          { id: "A", text: "Rs. 5000" },
          { id: "B", text: "Rs. 5500" },
          { id: "C", text: "Rs. 6000" },
          { id: "D", text: "Rs. 6500" }
        ],
        correctOption: "C",
        solution: "Difference for 2 years (Δ₂) = P × ( R / 100 )² ;\n⇒ 15 = P × ( 5 / 100 )² ;\n⇒ 15 = P × ( 1 / 20 )² ;\n⇒ 15 = ( P / 400 ) ;\n⇒ P = 15 × 400 = 6000 ;\n∴ Principal sum = Rs. 6000 ."
      },
      {
        problem: "Find the compound interest on Rs. 8,000 at 10% per annum for 1 1/2 years, compounded semi-annually.",
        options: [
          { id: "A", text: "Rs. 1161" },
          { id: "B", text: "Rs. 1200" },
          { id: "C", text: "Rs. 1261" },
          { id: "D", text: "Rs. 1320" }
        ],
        correctOption: "C",
        solution: "Effective rate per half-year = ( 10% / 2 ) = 5% ;\nNumber of half-year cycles (n) = ( 1.5 × 2 ) = 3 periods ;\nAmount = 8000 × ( 1 + 5/100 )³ ;\n= 8000 × ( 21/20 )³ ;\n= ( 8000 × 9261 / 8000 ) = Rs. 9261 ;\nCI = Amount - Principal = ( 9261 - 8000 ) ;\n∴ Compound Interest = Rs. 1261 ."
      }
    ],
    commonMistakes: [
      "Forgetting to halve the rate and double the time periods when compounding semi-annually.",
      "Reporting the total amount A as the answer instead of subtracting the principal to provide CI."
    ]
  },

  "problems-on-ages": {
    topicId: "problems-on-ages",
    title: "Problems on Ages",
    category: "quantitative",
    introduction: "Problems on Ages utilizes linear algebraic equations to solve age relationships between family members across past, present, and future time intervals.",
    concepts: [
      {
        heading: "The Constant Age Difference Invariant",
        body: "• The difference between the ages of two persons remains CONSTANT throughout their entire lives. If person A is 6 years older than person B today, person A was 6 years older 20 years ago and will be 6 years older 50 years in the future."
      },
      {
        heading: "Variable Setup Protocol",
        body: "• Always designate variables (e.g. x, y) for PRESENT ages unless a ratio from the past provides simpler integer expressions.\n• If present age is x:\n  - Age n years ago was (x - n).\n  - Age n years in the future will be (x + n)."
      }
    ],
    formulas: [
      {
        name: "Time Offset Mapping",
        formula: "Past = (x - t)   |   Present = x   |   Future = (x + t)",
        explanation: "Always shift all individuals simultaneously by the exact same t years."
      },
      {
        name: "Difference Invariance",
        formula: "Age_A(t) - Age_B(t) = Constant",
        explanation: "Age gap never changes over time."
      }
    ],
    solvedExamples: [
      {
        problem: "The present ages of a father and his son are in the ratio 7 : 2. Five years ago, the ratio of their ages was 6 : 1. Find the present age of the father.",
        options: [
          { id: "A", text: "28 years" },
          { id: "B", text: "35 years" },
          { id: "C", text: "42 years" },
          { id: "D", text: "49 years" }
        ],
        correctOption: "B",
        solution: "Let present age of father = 7x and son = 2x ;\nFive years ago: ( 7x - 5 / 2x - 5 ) = 6/1 ;\n⇒ 1 × ( 7x - 5 ) = 6 × ( 2x - 5 ) ;\n⇒ 7x - 5 = 12x - 30 ;\n⇒ 12x - 7x = 30 - 5 ;\n⇒ 5x = 25  ==>  x = 5 ;\n∴ Father's present age = 7 × 5 = 35 years ."
      },
      {
        problem: "A mother is 24 years older than her daughter. In 4 years, her age will be 3 times the age of her daughter. Find the daughter's present age.",
        options: [
          { id: "A", text: "6 years" },
          { id: "B", text: "8 years" },
          { id: "C", text: "10 years" },
          { id: "D", text: "12 years" }
        ],
        correctOption: "B",
        solution: "Let daughter's present age = d years ;\nMother's present age = ( d + 24 ) years ;\nIn 4 years: Mother's age = 3 × Daughter's age ;\n⇒ ( d + 24 ) + 4 = 3( d + 4 ) ;\n⇒ d + 28 = 3d + 12 ;\n⇒ 2d = 16 ;\n∴ Daughter's present age = 8 years ."
      }
    ],
    commonMistakes: [
      "Adding the time shift to only one person while forgetting to add it to the other person.",
      "Changing the age gap over time (the age difference between two siblings or parent and child never changes)."
    ]
  },

  "mixtures-and-alligation": {
    topicId: "mixtures-and-alligation",
    title: "Mixtures and Alligation",
    category: "quantitative",
    introduction: "Alligation is a fast proportioning technique used to find the ratio in which two ingredients of differing costs or concentrations must be blended to produce a desired mixture.",
    concepts: [
      {
        heading: "The Rule of Alligation",
        body: "When two ingredients of unit cost c (cheaper) and d (dearer) are combined to produce a mixture of mean unit cost m (where c < m < d):\n• (Quantity of Cheaper) / (Quantity of Dearer) = (d - m) / (m - c).\n• Cross-subtraction gives the required ratio directly."
      },
      {
        heading: "Repeated Liquid Dilution",
        body: "If a vessel initially contains x liters of pure liquid, and y liters are drawn off and replaced with water repeatedly for n successive cycles:\n• Quantity of pure liquid remaining = x × [1 - (y / x)]ⁿ."
      }
    ],
    formulas: [
      {
        name: "Rule of Alligation Cross",
        formula: "Q_cheaper / Q_dearer = (d - m) / (m - c)",
        explanation: "c: cheaper price, d: dearer price, m: mean mixture price."
      },
      {
        name: "Repeated Liquid Replacement",
        formula: "Remaining Pure Liquid = x · [1 - (y / x)]ⁿ",
        explanation: "x: initial pure volume, y: quantity drawn and replaced each cycle, n: operations."
      }
    ],
    solvedExamples: [
      {
        problem: "In what ratio must a grocer mix two varieties of tea costing Rs. 60 per kg and Rs. 85 per kg so that selling the mixture at Rs. 84 per kg yields a 20% profit?",
        options: [
          { id: "A", text: "2 : 3" },
          { id: "B", text: "3 : 2" },
          { id: "C", text: "4 : 5" },
          { id: "D", text: "5 : 4" }
        ],
        correctOption: "B",
        solution: "Mean Cost Price (m) = ( 84 / 1.20 ) = Rs. 70 per kg ;\nApply Rule of Alligation :\nCheaper c = 60, Dearer d = 85, Mean m = 70 ;\nRatio = ( d - m ) / ( m - c ) ;\n= ( 85 - 70 ) / ( 70 - 60 ) ;\n= ( 15 / 10 ) = 3/2 ;\n∴ Required mixing ratio = 3 : 2 ."
      },
      {
        problem: "A container holds 40 liters of pure milk. From this, 4 liters are drawn and replaced with water. This process is repeated 2 more times (total 3 operations). How much pure milk remains?",
        options: [
          { id: "A", text: "28.50 L" },
          { id: "B", text: "29.16 L" },
          { id: "C", text: "30.24 L" },
          { id: "D", text: "31.00 L" }
        ],
        correctOption: "B",
        solution: "Initial pure volume x = 40 L ; Replaced y = 4 L ; Operations n = 3 ;\nRemaining pure milk = 40 × [ 1 - (4 / 40) ]³ ;\n= 40 × ( 9/10 )³ ;\n= 40 × ( 729 / 1000 ) ;\n= ( 29160 / 1000 ) = 29.16 L ;\n∴ Remaining pure milk = 29.16 liters ."
      }
    ],
    commonMistakes: [
      "Using Selling Price directly in the alligation cross instead of first converting it to Mean Cost Price.",
      "Subtracting in reverse order (m - d instead of d - m), producing invalid negative ratios."
    ]
  },

  "permutations-combinations": {
    topicId: "permutations-combinations",
    title: "Permutations and Combinations",
    category: "quantitative",
    introduction: "Combinatorics studies the mathematics of counting: Permutations (ordered arrangements) and Combinations (unordered group selections).",
    concepts: [
      {
        heading: "Permutation (Order Matters) vs Combination (Selection)",
        body: "• Fundamental Counting Principle: If event A can occur in m ways and event B in n ways, both events occur in (m × n) ways.\n• Permutations (ⁿP_r): Number of ways to arrange r items from n distinct items: ⁿP_r = n! / (n - r)!.\n• Combinations (ⁿC_r): Number of ways to choose r items from n distinct items: ⁿC_r = n! / [r!(n - r)!].\n• Arrangements with duplicate items: If letters repeat p and q times, total arrangements = n! / (p! × q!).\n• Circular Permutation: Arranging n distinct objects in a circle has (n - 1)! arrangements."
      },
      {
        heading: "Grouping & Complementary Logic",
        body: "• 'Vowels together' problem: Tie the items together into a single mega-unit, arrange the remaining units, then multiply by internal permutations of the tied group.\n• 'At least one' rule: Total ways with at least one = (Total unrestricted ways) - (Ways with none)."
      }
    ],
    formulas: [
      {
        name: "Permutations (Arrangements)",
        formula: "ⁿP_r = n! / (n - r)!",
        explanation: "Used when the sequence or order of elements is significant."
      },
      {
        name: "Combinations (Selections)",
        formula: "ⁿC_r = n! / [r! · (n - r)!]",
        explanation: "Used for committee selection, hands of cards, or team groupings."
      },
      {
        name: "Symmetric Identity",
        formula: "ⁿC_r = ⁿC_(n - r)",
        explanation: "e.g. ¹⁰C₈ = ¹⁰C₂ = (10 × 9) / (2 × 1) = 45."
      }
    ],
    solvedExamples: [
      {
        problem: "In how many different ways can the letters of the word 'LEADING' be arranged such that the vowels always come together?",
        options: [
          { id: "A", text: "360" },
          { id: "B", text: "480" },
          { id: "C", text: "720" },
          { id: "D", text: "5040" }
        ],
        correctOption: "C",
        solution: "Vowels in 'LEADING' = { E, A, I } (3 vowels) ;\nConsonants = { L, D, N, G } (4 consonants) ;\nTie the 3 vowels into a single unit: (EAI) ;\nTotal units to arrange = 4 consonants + 1 block = 5 units ;\n5 units can arrange in 5! = 120 ways ;\nInside block, 3 vowels arrange in 3! = 6 ways ;\nTotal arrangements = ( 120 × 6 ) = 720 ;\n∴ Total permissible ways = 720 ."
      },
      {
        problem: "A committee of 5 members is to be formed from 6 men and 4 women. In how many ways can this be done if the committee must contain at least 3 women?",
        options: [
          { id: "A", text: "45" },
          { id: "B", text: "60" },
          { id: "C", text: "66" },
          { id: "D", text: "72" }
        ],
        correctOption: "C",
        solution: "Case 1: (3 Women, 2 Men) ;\n= ⁴C₃ × ⁶C₂ = 4 × 15 = 60 ways ;\nCase 2: (4 Women, 1 Man) ;\n= ⁴C₄ × ⁶C₁ = 1 × 6 = 6 ways ;\nTotal ways = 60 + 6 = 66 ways ;\n∴ Total committee selections = 66 ."
      }
    ],
    commonMistakes: [
      "Using permutations (ⁿP_r) instead of combinations (ⁿC_r) for committee selections where order of members does not matter.",
      "Forgetting to multiply by the internal permutations of bundled units in grouping problems."
    ]
  },

  "probability": {
    topicId: "probability",
    title: "Probability",
    category: "quantitative",
    introduction: "Probability measures the mathematical likelihood of an event occurring within a well-defined sample space, spanning classical odds, dice, cards, coins, and compound events.",
    concepts: [
      {
        heading: "Classical Definition & Sample Spaces",
        body: "• Probability: P(E) = n(E) / n(S) = (Number of favorable outcomes) / (Total outcomes in sample space).\n• Boundedness: 0 ≤ P(E) ≤ 1. Impossible event = 0; Certain event = 1.\n• Complement Rule: P(E') = 1 - P(E).\n• Two dice roll: Total outcomes = 6 × 6 = 36.\n• Standard 52-card deck: 4 suits of 13 cards (Spades, Clubs are Black; Hearts, Diamonds are Red); 12 face cards (Jack, Queen, King across 4 suits)."
      },
      {
        heading: "Compound Events & Independence",
        body: "• Addition Rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B). For mutually exclusive events, P(A ∩ B) = 0.\n• Independent Events: Event A occurring does not affect event B: P(A ∩ B) = P(A) × P(B)."
      }
    ],
    formulas: [
      {
        name: "Classical Probability",
        formula: "P(E) = n(E) / n(S)",
        explanation: "Favorable outcomes divided by total sample space."
      },
      {
        name: "Addition Theorem",
        formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
        explanation: "P(A ∩ B) = 0 when events are mutually exclusive."
      },
      {
        name: "Independent Multiplication Rule",
        formula: "P(A ∩ B) = P(A) · P(B)",
        explanation: "Holds when event A does not alter the probability distribution of event B."
      }
    ],
    solvedExamples: [
      {
        problem: "Two unbiased six-sided dice are thrown simultaneously. What is the probability that the sum of the numbers appearing on top is equal to 8?",
        options: [
          { id: "A", text: "1/6" },
          { id: "B", text: "5/36" },
          { id: "C", text: "7/36" },
          { id: "D", text: "1/9" }
        ],
        correctOption: "B",
        solution: "Total sample space n(S) = ( 6 × 6 ) = 36 ;\nFavorable pairs summing to 8 :\n(2, 6), (3, 5), (4, 4), (5, 3), (6, 2) ;\n⇒ Number of favorable outcomes n(E) = 5 ;\nProbability P(Sum = 8) = ( n(E) / n(S) ) ;\n∴ P(Sum = 8) = 5/36 ."
      },
      {
        problem: "From a well-shuffled standard pack of 52 playing cards, two cards are drawn at random without replacement. What is the probability that both cards are Kings?",
        options: [
          { id: "A", text: "1/169" },
          { id: "B", text: "1/221" },
          { id: "C", text: "4/663" },
          { id: "D", text: "2/221" }
        ],
        correctOption: "B",
        solution: "Total Kings in deck = 4 ; Total cards = 52 ;\nProbability that 1st card is King = ( 4 / 52 ) = 1/13 ;\nRemaining Kings = 3 ; Remaining cards = 51 ;\nProbability that 2nd card is King = ( 3 / 51 ) = 1/17 ;\nJoint Probability = ( 1/13 × 1/17 ) = 1/221 ;\n∴ P(Both Kings) = 1/221 ."
      }
    ],
    commonMistakes: [
      "Not reducing the total cards or balls in the denominator when draws occur without replacement.",
      "Treating outcomes like (2, 6) and (6, 2) on two dice as a single outcome rather than two distinct possibilities."
    ]
  },

  "quant-number-series": {
    topicId: "quant-number-series",
    title: "Number Series",
    category: "quantitative",
    introduction: "Quantitative Number Series tests pattern discovery across mathematical progressions, geometric scalings, polynomial sequences, difference-of-differences, and mixed operational series.",
    concepts: [
      {
        heading: "Standard Sequence Architectures",
        body: "• Arithmetic Progression (AP): Constant difference d between terms: T_n = a + (n - 1)d.\n• Geometric Progression (GP): Constant ratio r: T_n = a · rⁿ⁻¹.\n• Quadratic Differences: The differences between consecutive terms themselves form an arithmetic progression.\n• Cubic and Square Offsets: Patterns generated by (n² ± k) or (n³ ± n)."
      },
      {
        heading: "Dual Operational Progressions",
        body: "Many recruitment tests feature series where each term is multiplied by a factor and then adjusted by an offset:\n• T_(n+1) = (T_n × 2) + 3\n• T_(n+1) = (T_n × k) - k."
      }
    ],
    formulas: [
      {
        name: "AP General Term",
        formula: "T_n = a + (n - 1) · d",
        explanation: "a: first term, d: common difference."
      },
      {
        name: "GP General Term",
        formula: "T_n = a · rⁿ⁻¹",
        explanation: "a: first term, r: common ratio."
      },
      {
        name: "Cubic Sequence Pattern",
        formula: "T_n = n³ ± k",
        explanation: "e.g. 0, 7, 26, 63, 124 represents n³ - 1."
      }
    ],
    solvedExamples: [
      {
        problem: "Find the missing number in the series: 4, 11, 25, 53, 109, ?",
        options: [
          { id: "A", text: "218" },
          { id: "B", text: "221" },
          { id: "C", text: "225" },
          { id: "D", text: "229" }
        ],
        correctOption: "B",
        solution: "Pattern rule: Multiply by 2 and add 3 ;\n4 × 2 + 3 = 11 ;\n11 × 2 + 3 = 25 ;\n25 × 2 + 3 = 53 ;\n53 × 2 + 3 = 109 ;\n⇒ 109 × 2 + 3 = 218 + 3 = 221 ;\n∴ Missing number = 221 ."
      },
      {
        problem: "Find the next term in the sequence: 2, 9, 28, 65, 126, ?",
        options: [
          { id: "A", text: "215" },
          { id: "B", text: "216" },
          { id: "C", text: "217" },
          { id: "D", text: "218" }
        ],
        correctOption: "C",
        solution: "General term represents n³ + 1 :\n1³ + 1 = 1 + 1 = 2 ;\n2³ + 1 = 8 + 1 = 9 ;\n3³ + 1 = 27 + 1 = 28 ;\n4³ + 1 = 64 + 1 = 65 ;\n5³ + 1 = 125 + 1 = 126 ;\n⇒ For n = 6 : 6³ + 1 = 216 + 1 = 217 ;\n∴ Next term = 217 ."
      }
    ],
    commonMistakes: [
      "Stopping after examining only first-order differences when terms exhibit polynomial or geometric acceleration.",
      "Overlooking alternating interleaved patterns where odd and even positions follow independent rules."
    ]
  },

  "data-interpretation": {
    topicId: "data-interpretation",
    title: "Data Interpretation",
    category: "quantitative",
    introduction: "Data Interpretation evaluates the ability to extract, analyze, and synthesize numerical facts presented across pie charts, bar graphs, line charts, and tabular spreadsheets into actionable metrics.",
    concepts: [
      {
        heading: "Pie Chart Angles & Percentage Equivalence",
        body: "• A complete circle represents 100% or 360°.\n• Conversion: 100% = 360°  ==>  1% = 3.6°  ==>  1° = (5 / 18)%.\n• Sector Value = (Sector Angle / 360°) × Total Value.\n• Shortcut: When comparing two sectors in the same pie chart, take the ratio of their angles directly; do not calculate absolute values first."
      },
      {
        heading: "Growth Rates & Relative Shares",
        body: "• Percentage Growth = [(Final Value - Initial Value) / Initial Value] × 100%.\n• Always verify the base year in the denominator.\n• Ratio Comparisons: To compare growth across multiple years, use fractional approximations rather than manual multi-digit division."
      }
    ],
    formulas: [
      {
        name: "Pie Chart Sector Value",
        formula: "Value = (Sector Angle / 360°) · Total",
        explanation: "Converts degree slice into absolute numerical value."
      },
      {
        name: "Percentage Growth Rate",
        formula: "% Growth = [(V_final - V_initial) / V_initial] · 100%",
        explanation: "Denominator is strictly the initial base period."
      },
      {
        name: "Degree to Percentage",
        formula: "Percentage = (Angle / 360°) · 100% = Angle / 3.6",
        explanation: "Quick conversion from degrees to percentage."
      }
    ],
    solvedExamples: [
      {
        problem: "In a pie chart representing a total annual corporate budget of Rs. 72 Lakhs, the sector angle for R&D is 54°. What absolute amount was allocated to R&D?",
        options: [
          { id: "A", text: "Rs. 9.6 Lakhs" },
          { id: "B", text: "Rs. 10.8 Lakhs" },
          { id: "C", text: "Rs. 12.0 Lakhs" },
          { id: "D", text: "Rs. 14.4 Lakhs" }
        ],
        correctOption: "B",
        solution: "Total budget = Rs. 72 Lakhs ; Full circle = 360° ;\nR&D Allocation = ( 54° / 360° ) × Rs. 72 Lakhs ;\n= ( 3 / 20 ) × 72 Lakhs ;\n= ( 216 / 20 ) Lakhs = 10.8 Lakhs ;\n∴ R&D Allocation = Rs. 10.8 Lakhs ."
      },
      {
        problem: "A company's revenue increased from Rs. 40 Crores to Rs. 50 Crores, while operating expenses increased from Rs. 30 Crores to Rs. 35 Crores. By what percentage did net profit increase?",
        options: [
          { id: "A", text: "25%" },
          { id: "B", text: "33 1/3%" },
          { id: "C", text: "50%" },
          { id: "D", text: "60%" }
        ],
        correctOption: "C",
        solution: "Profit in Year 1 = ( 40 - 30 ) = Rs. 10 Crores ;\nProfit in Year 2 = ( 50 - 35 ) = Rs. 15 Crores ;\nIncrease in profit = ( 15 - 10 ) = Rs. 5 Crores ;\nPercentage increase = ( 5 / 10 ) × 100% = 50% ;\n∴ Net profit increase = 50% ."
      }
    ],
    commonMistakes: [
      "Computing absolute values for every single segment when the question only asks for a ratio or percentage comparison.",
      "Dividing by the final year's figure instead of the base year's figure when calculating growth."
    ]
  }
};
