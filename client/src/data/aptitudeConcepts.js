/**
 * Master Aptitude Concepts Registry
 * Combines all Quantitative (16), Logical Reasoning (15), and Verbal Ability (11) topics.
 * Used in LEARN MODE across CareerForge AI.
 */

import { QUANTITATIVE_CONCEPTS } from "./concepts/quantitativeConcepts.js";
import { LOGICAL_CONCEPTS } from "./concepts/logicalConcepts.js";
import { VERBAL_CONCEPTS } from "./concepts/verbalConcepts.js";

export const TOPIC_CONCEPTS = {
  ...QUANTITATIVE_CONCEPTS,
  ...LOGICAL_CONCEPTS,
  ...VERBAL_CONCEPTS,
};

/**
 * Retrieves the comprehensive concept guide for any topicId.
 */
export const getConceptByTopicId = (topicId, topicMeta = {}) => {
  if (topicId && TOPIC_CONCEPTS[topicId]) {
    return TOPIC_CONCEPTS[topicId];
  }

  // Graceful fallback for any dynamic topic
  const name = topicMeta?.name || (typeof topicId === "string" ? topicId.replace(/-/g, " ") : "Aptitude Topic");
  const cat = topicMeta?.category || "quantitative";

  return {
    topicId: topicId || "general",
    title: name,
    category: cat,
    introduction: `Concept overview and preparation guide for ${name}. Master key problem-solving methodologies, structural rules, and practice questions to score high on campus recruitment aptitude tests.`,
    concepts: [
      {
        heading: "Core Problem-Solving Strategy",
        body: `Mastering ${name} requires attentive reading of problem constraints, identifying known and unknown variables, applying standard relationships, and systematically checking arithmetic or logic before finalizing.`
      },
      {
        heading: "Systematic Verification",
        body: "Always verify boundary cases, units of measurement, signs, and whether answers require integer or fractional precision."
      }
    ],
    formulas: [
      {
        name: "Standard Solving Heuristic",
        formula: "Systematically analyze given constraints and deduce target variables step by step.",
        explanation: `Apply core mathematical or logical relationships specific to ${name}.`
      }
    ],
    solvedExamples: [
      {
        problem: `Benchmark review problem for ${name}`,
        solution: "Identify given variables, state governing relationships, substitute values step by step, and verify the final result."
      }
    ],
    commonMistakes: [
      "Rushing into calculations before reading all given constraints and units.",
      "Skipping verification of boundary conditions."
    ]
  };
};
