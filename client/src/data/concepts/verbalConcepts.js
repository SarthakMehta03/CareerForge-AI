/**
 * Verbal Ability Concepts, Grammatical Rules, Solved Examples, and Common Pitfalls
 * Comprehensive guides for all 11 Verbal Ability Topics in CareerForge AI.
 * Formatted with IndiaBIX / Competitive Exam layout (options, answer pills, step-by-step derivations).
 */

export const VERBAL_CONCEPTS = {
  "grammar": {
    topicId: "grammar",
    title: "Grammar",
    category: "verbal",
    introduction: "Grammar establishes the syntactic rules of standard English, covering subject-verb agreement, tense harmony, proper modifier attachment, conditional clauses, and pronoun cases.",
    concepts: [
      {
        heading: "Subject-Verb Agreement Principles",
        body: "• Singular subjects take singular verbs; plural subjects take plural verbs.\n• Intervening Phrases: Parenthetical expressions such as 'as well as', 'along with', 'together with', 'accompanied by', and 'in addition to' do NOT change the number of the subject. The verb strictly agrees with the initial primary subject.\n• Indefinite Pronouns: Words like 'each', 'every', 'everyone', 'everybody', 'neither', and 'either' are grammatically singular and require singular verbs (e.g. 'Each of the cars is inspected')."
      },
      {
        heading: "Correlative Conjunctions & Modifiers",
        body: "• Proximity Rule: When compound subjects are joined by 'either...or' or 'neither...nor', the verb agrees in number with the subject closest to it.\n• Dangling Modifiers: An introductory participial phrase must modify the noun immediately following the comma; otherwise, it illogically modifies the wrong entity."
      }
    ],
    formulas: [
      {
        name: "Proximity Concord Rule",
        formula: "Neither [Subj₁] nor [Subj₂]  ==>  Verb agrees with Subj₂",
        explanation: "Verb matches the closest subject in number."
      },
      {
        name: "Intervening Phrase Invariance",
        formula: "Subject + [as well as / along with ...] + Verb  ==>  Verb agrees with Subject",
        explanation: "Parenthetical additions do not pluralize a singular subject."
      }
    ],
    solvedExamples: [
      {
        problem: "Choose the grammatically correct sentence among the options:",
        options: [
          { id: "A", text: "The CEO, along with his executive board members, are visiting the campus tomorrow." },
          { id: "B", text: "The CEO, along with his executive board members, is visiting the campus tomorrow." },
          { id: "C", text: "The CEO, along with his executive board members, were visiting the campus tomorrow." },
          { id: "D", text: "The CEO, along with his executive board members, have visited the campus tomorrow." }
        ],
        correctOption: "B",
        solution: "Identify the grammatical subject of the sentence:\n'The CEO' is a singular third-person noun.\nThe phrase 'along with his executive board members' is an intervening parenthetical prepositional modifier.\nIntervening prepositional phrases do not alter the grammatical number of the subject.\n⇒ The verb must agree with 'The CEO' in the singular: 'is visiting'.\n∴ The correct sentence is Option (B)."
      },
      {
        problem: "Select the sentence that resolves the dangling modifier in: 'Walking into the library, the books were neatly organized on the shelves.'",
        options: [
          { id: "A", text: "Walking into the library, the shelves held neatly organized books." },
          { id: "B", text: "Walking into the library, neatly organized books were seen on the shelves." },
          { id: "C", text: "Walking into the library, I noticed that the books were neatly organized on the shelves." },
          { id: "D", text: "Walking into the library, the room was full of organized books." }
        ],
        correctOption: "C",
        solution: "An introductory participial phrase ('Walking into the library') must logically modify the agent immediately following the comma.\nIn options (A), (B), and (D), the subject immediately following the comma is 'the shelves', 'neatly organized books', or 'the room'—none of which can walk into a library!\n⇒ In Option (C), the subject following the comma is 'I', the person performing the action.\n∴ Option (C) eliminates the dangling modifier."
      }
    ],
    commonMistakes: [
      "Matching the verb to the nearest noun inside a prepositional phrase (e.g. saying 'The quality of the apples were good' instead of 'was good').",
      "Using plural verbs with indefinite pronouns like 'each of the participants'."
    ]
  },

  "vocabulary": {
    topicId: "vocabulary",
    title: "Vocabulary",
    category: "verbal",
    introduction: "Vocabulary measures command of English diction, etymological Greek and Latin roots, precise contextual word choice, connotations, and confusing homophone distinctions.",
    concepts: [
      {
        heading: "Etymology & Root Words",
        body: "• 'Bene' (well/good): benevolent, benefactor, beneficial.\n• 'Mal' (bad/evil): malevolent, malicious, malady.\n• 'Chron' (time): chronic, chronological, anachronism.\n• 'Loqu / Loc' (speak): eloquent, loquacious, circumlocution.\n• 'Path' (feeling/disease): empathy, antipathy, pathology.\nDeconstructing unfamiliar words into prefix + root + suffix unlocks their meaning rapidly."
      },
      {
        heading: "Contextual Diction & Confusing Homophones",
        body: "• Affect (verb: to influence) vs. Effect (noun: result or outcome).\n• Principal (adjective/noun: head, main, capital) vs. Principle (noun: fundamental truth or rule of conduct).\n• Compliment (praise) vs. Complement (that which completes or balances)."
      }
    ],
    formulas: [
      {
        name: "Root Deconstruction",
        formula: "Meaning = Prefix (direction) + Root (core concept) + Suffix (part of speech)",
        explanation: "Systematic morphological vocabulary decoding."
      },
      {
        name: "Grammatical Register Compatibility",
        formula: "Select Word  <==>  Matches semantic tone, formality, and syntax",
        explanation: "Ensures word fits the formal academic or professional register."
      }
    ],
    solvedExamples: [
      {
        problem: "Choose the correct word to fill in the blank: 'The implementation of the new automated tool had an immediate ________ on employee productivity.'",
        options: [
          { id: "A", text: "affect" },
          { id: "B", text: "effect" },
          { id: "C", text: "effective" },
          { id: "D", text: "affective" }
        ],
        correctOption: "B",
        solution: "Inspect the grammatical role required:\nThe blank is preceded by the article 'an' and the adjective 'immediate'.\n⇒ A singular noun is required.\nDistinguish between 'affect' and 'effect':\n• 'Affect' is predominantly a verb meaning to act upon or influence.\n• 'Effect' is a noun meaning a result, outcome, or consequence.\n⇒ The noun 'effect' is the correct choice.\n∴ The correct word is effect."
      },
      {
        problem: "What is the meaning of the word 'anachronism' based on its constituent Greek etymological roots?",
        options: [
          { id: "A", text: "A fear of open spaces" },
          { id: "B", text: "Something positioned in an incorrect historical time period" },
          { id: "C", text: "A recurring contagious illness" },
          { id: "D", text: "A state of social rebellion" }
        ],
        correctOption: "B",
        solution: "Break down the Greek roots:\n• 'Ana-' = against, backward, or out of place.\n• 'Chronos' = time.\nAn 'anachronism' is an entity, custom, or object placed in a chronological era to which it does not belong (e.g. an electronic wristwatch appearing in a film set in ancient Rome).\n∴ The correct definition is Option (B)."
      }
    ],
    commonMistakes: [
      "Selecting a word that possesses the correct broad definition but the wrong part of speech for the blank.",
      "Confusing 'affect' (influence) with 'effect' (result)."
    ]
  },

  "synonyms-and-antonyms": {
    topicId: "synonyms-and-antonyms",
    title: "Synonyms and Antonyms",
    category: "verbal",
    introduction: "Synonyms and Antonyms tests the mastery of semantic equivalents and polar opposites, evaluating secondary definitions, emotional connotations, and contextual nuance.",
    concepts: [
      {
        heading: "Contextual Nuance & Secondary Meanings",
        body: "• Many high-frequency test words have multiple meanings depending on context:\n  - 'Temper': As a noun means mood; as a verb means to moderate or soften.\n  - 'Champion': As a noun means victor; as a verb means to advocate vigorously for a cause.\n  - 'Grave': As a noun means burial place; as an adjective means solemn and serious.\n• Always examine how the target word functions in its sentence context before selecting an equivalent."
      },
      {
        heading: "The Part-of-Speech Invariant",
        body: "• A synonym or antonym must share the EXACT SAME part of speech as the original word:\n  - Verb <==> Verb (e.g. mitigate <==> alleviate)\n  - Adjective <==> Adjective (e.g. pragmatic <==> practical)\n  - Noun <==> Noun (e.g. adversity <==> hardship)."
      }
    ],
    formulas: [
      {
        name: "Part-of-Speech Conservation",
        formula: "Part_of_Speech(Target) = Part_of_Speech(Synonym / Antonym)",
        explanation: "Eliminates candidates with mismatched grammatical classes."
      },
      {
        name: "Semantic Polarity Inversion",
        formula: "Sentiment(Antonym) = -1 · Sentiment(Target)",
        explanation: "Antonyms strictly invert positive, neutral, or negative polarity."
      }
    ],
    solvedExamples: [
      {
        problem: "Find the closest SYNONYM for the word PRAGMATIC in the context: 'The engineering team opted for a pragmatic solution to meet the tight deadline.'",
        options: [
          { id: "A", text: "Theoretical" },
          { id: "B", text: "Practical" },
          { id: "C", text: "Idealistic" },
          { id: "D", text: "Careless" }
        ],
        correctOption: "B",
        solution: "'Pragmatic' means dealing with situations sensibly and realistically based on practical considerations rather than theoretical ideals.\n• 'Practical' is the direct synonym.\n• 'Theoretical' and 'Idealistic' are antonyms.\n• 'Careless' is an unrelated negative adjective.\n∴ The closest synonym is Practical."
      },
      {
        problem: "Select the most appropriate ANTONYM for the word EPHEMERAL:",
        options: [
          { id: "A", text: "Fleeting" },
          { id: "B", text: "Transient" },
          { id: "C", text: "Permanent" },
          { id: "D", text: "Delicate" }
        ],
        correctOption: "C",
        solution: "'Ephemeral' means lasting for a very short duration; transient, momentary, or fleeting.\n• 'Fleeting' and 'Transient' are synonyms.\n• The polar opposite of lasting temporarily is lasting indefinitely: 'Permanent' (or enduring).\n∴ The most appropriate antonym is Permanent."
      }
    ],
    commonMistakes: [
      "Accidentally selecting a synonym when the question specifically requested an antonym.",
      "Overlooking secondary definitions of common words."
    ]
  },

  "sentence-correction": {
    topicId: "sentence-correction",
    title: "Sentence Correction",
    category: "verbal",
    introduction: "Sentence Correction identifies and rectifies syntactic flaws including faulty parallelism, redundancy, incorrect pronoun-antecedent agreement, and non-standard idioms.",
    concepts: [
      {
        heading: "The Law of Parallel Structure",
        body: "• Coordinated words, phrases, or clauses joined by conjunctions ('and', 'or', 'but') must maintain identical grammatical forms:\n  - Incorrect: 'She likes hiking, swimming, and to ride a bicycle.'\n  - Correct: 'She likes hiking, swimming, and riding a bicycle.'\n• When comparing entities with 'than' or 'as', ensure parallel comparison: 'The salary of an engineer is higher than a teacher' (Incorrect: compares salary to teacher) ==> 'higher than that of a teacher' (Correct)."
      },
      {
        heading: "Redundancy & Tautology",
        body: "• Eliminate repetitive phrases that express the same meaning twice:\n  - 'Revert back' ==> 'Revert'\n  - 'Past history' ==> 'History'\n  - 'Adequate enough' ==> 'Adequate'\n  - 'Reason is because' ==> 'Reason is that'."
      }
    ],
    formulas: [
      {
        name: "Parallel Coordination Rule",
        formula: "Verb₁ [gerund] + Verb₂ [gerund] + and + Verb₃ [gerund]",
        explanation: "All coordinated elements must share identical grammatical inflection."
      },
      {
        name: "Comparative Entity Equality",
        formula: "Attribute(A) compared with Attribute(B) [using 'that of' / 'those of']",
        explanation: "Prevents comparing an attribute directly to a person."
      }
    ],
    solvedExamples: [
      {
        problem: "Choose the correct phrasing to improve the sentence: 'The committee resolved to invest in renewable energy, upgrading older facilities, and to reduce overhead expenses.'",
        options: [
          { id: "A", text: "to invest in renewable energy, upgrading older facilities, and to reduce overhead expenses." },
          { id: "B", text: "to invest in renewable energy, upgrade older facilities, and reduce overhead expenses." },
          { id: "C", text: "investing in renewable energy, upgrade older facilities, and reducing overhead expenses." },
          { id: "D", text: "to invest in renewable energy, to upgrading older facilities, and reduce overhead expenses." }
        ],
        correctOption: "B",
        solution: "Inspect the coordinated verbs following 'resolved to':\n• 'to invest' (base verb / infinitive)\n• 'upgrading' (gerund — violates parallel structure!)\n• 'to reduce' (infinitive)\nIn a parallel series joined by 'and', all verbs must maintain identical grammatical inflection.\n⇒ Using the base form 'invest, upgrade, and reduce' after the common auxiliary 'to' establishes parallel concord.\n∴ Option (B) is the correct revision."
      },
      {
        problem: "Identify the redundant phrase in: 'The admissions office requested that international students return back the signed verification forms.'",
        options: [
          { id: "A", text: "admissions office" },
          { id: "B", text: "return back" },
          { id: "C", text: "international students" },
          { id: "D", text: "verification forms" }
        ],
        correctOption: "B",
        solution: "The verb 'return' already means to give, send, or come back.\nCombining 'return' with 'back' creates an unnecessary tautology.\n⇒ The correct phrasing is 'return the signed verification forms'.\n∴ 'return back' is the redundant phrase."
      }
    ],
    commonMistakes: [
      "Mixing infinitives and gerunds across items in a coordinated series.",
      "Comparing an attribute of an object with an entire object (e.g. 'The battery life of Phone A is longer than Phone B' instead of 'than that of Phone B')."
    ]
  },

  "error-spotting": {
    topicId: "error-spotting",
    title: "Error Spotting",
    category: "verbal",
    introduction: "Error Spotting tests systematic inspection of segmented sentences to detect hidden errors in subject-verb concord, pronoun cases, verb tense sequences, and correlative conjunction pairings.",
    concepts: [
      {
        heading: "The 5-Point Diagnostic Protocol",
        body: "Inspect every sentence systematically across these 5 frequent error points:\n1. Subject-Verb Agreement: Identify the true subject and check whether it matches the verb in number.\n2. Pronoun Case: Verify subjective ('I', 'he', 'they') vs. objective ('me', 'him', 'them') case, especially after prepositions ('between you and me').\n3. Sequence of Tenses: Ensure past events in sequence use Past Perfect for the earlier event and Simple Past for the later event.\n4. Correlative Conjunctions: Verify standard pairings:\n   - Not only ... but also\n   - Neither ... nor\n   - Scarcely / Hardly ... when\n   - No sooner ... than.\n5. Prepositional Collocations: Ensure idioms like 'abstain from', 'comply with', 'senior to' use the correct preposition."
      },
      {
        heading: "Pronoun-Antecedent Agreement & Structural Parallelism",
        body: "• Singular Indefinite Pronouns: Words like 'everyone', 'each', 'somebody', and 'nobody' take singular pronouns ('his or her', not 'their') in formal grammar tests.\n• Case After Comparisons: Pronouns following 'than' or 'as' take subjective case if the comparison is between subjects: 'He is taller than I (am)', not 'than me'.\n• Correlative Placement: Elements following 'not only' and 'but also' must be grammatically balanced (e.g. verb to verb, noun to noun)."
      }
    ],
    formulas: [
      {
        name: "Correlative Pair Rule",
        formula: "No sooner had ... than   |   Hardly had ... when",
        explanation: "Pairing 'No sooner' with 'when' is a classic grammar error."
      },
      {
        name: "Objective Pronoun After Preposition",
        formula: "Preposition + [Objective Case Pronoun: me, him, her, us, them]",
        explanation: "e.g. 'Between you and me' (never 'Between you and I')."
      }
    ],
    solvedExamples: [
      {
        problem: "Find which segment contains an error:\n'No sooner had the bell rung (A) / when the students (B) / rushed out of the lecture hall (C) / into the courtyard (D).'",
        options: [
          { id: "A", text: "No sooner had the bell rung" },
          { id: "B", text: "when the students" },
          { id: "C", text: "rushed out of the lecture hall" },
          { id: "D", text: "into the courtyard" }
        ],
        correctOption: "B",
        solution: "Segment (A) begins with the correlative conjunction 'No sooner had...'.\nIn standard English grammar, the mandatory correlative pairing for 'No sooner' is 'than', NEVER 'when'.\n• 'No sooner ... than'\n• 'Hardly / Scarcely ... when'\nSegment (B) incorrectly employs 'when'. It must be replaced by 'than the students'.\n∴ Segment (B) contains the error."
      },
      {
        problem: "Find which segment contains an error:\n'Between you and I, (A) / the newly proposed schedule (B) / seems impractical (C) / given current constraints (D).'",
        options: [
          { id: "A", text: "Between you and I," },
          { id: "B", text: "the newly proposed schedule" },
          { id: "C", text: "seems impractical" },
          { id: "D", text: "given current constraints" }
        ],
        correctOption: "A",
        solution: "Segment (A) contains the preposition 'Between'.\nPrepositions must be followed by pronouns in the objective case (me, him, her, us, them).\n⇒ The objective case of 'I' is 'me'.\nThe correct phrase is 'Between you and me'.\n∴ Segment (A) contains the error."
      }
    ],
    commonMistakes: [
      "Pairing 'No sooner' with 'when' instead of 'than'.",
      "Using subjective pronouns ('I', 'she', 'he') after prepositions like 'between' or 'except'."
    ]
  },

  "fill-in-the-blanks": {
    topicId: "fill-in-the-blanks",
    title: "Fill in the Blanks",
    category: "verbal",
    introduction: "Fill in the Blanks tests reading comprehension, syntax, transition markers, and precise contextual vocabulary to complete single-blank sentences.",
    concepts: [
      {
        heading: "Directional Transition Clues",
        body: "• Contrast Markers (Reverses direction): although, however, despite, nevertheless, whereas, yet, on the other hand. The missing word will have opposite sentiment to the surrounding clause.\n• Support Markers (Continues direction): furthermore, additionally, consequently, therefore, since, because. The missing word reinforces the established sentiment.\n• Cause and Effect: 'Because X happened, Y resulted.'"
      },
      {
        heading: "Grammatical Part-of-Speech Deduction",
        body: "Before inspecting the options, deduce what grammatical part of speech is required:\n• Is it an adjective modifying a noun?\n• Is it an adverb describing a verb?\n• Is it an idiomatic preposition matching the preceding verb?"
      }
    ],
    formulas: [
      {
        name: "Contrast Signal Inversion",
        formula: "Clause₁ [Negative] + Contrast Marker [Although / However]  ==>  Blank [Positive]",
        explanation: "Reverses polarity across the contrast junction."
      },
      {
        name: "Collocation Agreement",
        formula: "Verb + Mandatory Preposition",
        explanation: "e.g. 'absorbed in', 'refrain from', 'adhere to'."
      }
    ],
    solvedExamples: [
      {
        problem: "Fill in the blank: 'Although the initial market reception was decidedly lukewarm, the product experienced an ________ surge in customer orders during the holiday season.'",
        options: [
          { id: "A", text: "insignificant" },
          { id: "B", text: "unprecedented" },
          { id: "C", text: "obsolete" },
          { id: "D", text: "equivocal" }
        ],
        correctOption: "B",
        solution: "Identify the transition marker:\nThe sentence opens with 'Although', a contrast marker.\nClause 1 describes a quiet, negative reception ('lukewarm').\nClause 2 must contrast by describing a remarkable, positive surge in orders.\n• 'Unprecedented' means never before seen or done; extraordinary.\n• 'Insignificant' (minor), 'obsolete' (outdated), and 'equivocal' (vague) do not provide the positive contrast.\n∴ The correct word is unprecedented."
      },
      {
        problem: "Fill in the blank with the correct preposition: 'The young software engineer was completely absorbed ________ her code and did not hear the phone ring.'",
        options: [
          { id: "A", text: "with" },
          { id: "B", text: "at" },
          { id: "C", text: "in" },
          { id: "D", text: "for" }
        ],
        correctOption: "C",
        solution: "Analyze the preceding adjective and context:\nWhen describing mental concentration or immersion, the standard English idiomatic collocation is 'absorbed in'.\n• 'absorbed with' and 'absorbed at' are non-standard.\n∴ The correct preposition is in."
      }
    ],
    commonMistakes: [
      "Ignoring contrast transition markers like 'although' and selecting a word with the same polarity as the initial clause.",
      "Selecting a preposition based on literal translation from one's native language rather than standard English idiom."
    ]
  },

  "sentence-completion": {
    topicId: "sentence-completion",
    title: "Sentence Completion",
    category: "verbal",
    introduction: "Sentence Completion evaluates two-blank syntactic and semantic integration, requiring simultaneous alignment of logical transitions, tone, and vocabulary.",
    concepts: [
      {
        heading: "The Dual-Blank Solving Protocol",
        body: "1. Read the entire sentence without looking at the answer choices to identify the overall logical trajectory.\n2. Solve the easier blank first: Often one blank has a sharper, more unambiguous context clue than the other.\n3. Eliminate option pairs where the first word fails, regardless of how attractive the second word appears.\n4. Re-read the completed sentence with both chosen words to ensure coherent flow and grammatical concord."
      },
      {
        heading: "Antithesis & Paradox Structures",
        body: "Phrases like 'Far from being X, he was Y' establish that X and Y must be polar opposites. If X is lazy, Y must be hardworking."
      }
    ],
    formulas: [
      {
        name: "Antithetical Pairing Rule",
        formula: "Far from being [Word₁] , Subject was [Word₂]  ==>  Word₁ = -1 · Word₂",
        explanation: "Both words must be direct antonyms."
      },
      {
        name: "Cause-and-Effect Alignment",
        formula: "Because [Action / Cause], [Result / Effect]",
        explanation: "Ensures both blanks work harmoniously towards the same outcome."
      }
    ],
    solvedExamples: [
      {
        problem: "Complete the sentence: 'Because the key witness gave ________ testimony during the cross-examination, the defense attorney was able to swiftly ________ his credibility.'",
        options: [
          { id: "A", text: "consistent ... bolster" },
          { id: "B", text: "contradictory ... dismantle" },
          { id: "C", text: "compelling ... question" },
          { id: "D", text: "ambiguous ... confirm" }
        ],
        correctOption: "B",
        solution: "The sentence establishes a direct cause-and-effect relationship initiated by 'Because'.\nExamine Option (B):\nIf testimony is 'contradictory' (self-conflicting), an opposing attorney can easily 'dismantle' (destroy) his credibility.\nBoth words fit the logical cause and effect seamlessly.\nIn Option (A), consistent testimony would reinforce credibility, not allow cross-examination destruction.\n∴ Option (B) is the correct choice."
      },
      {
        problem: "Complete the sentence: 'Far from being ________, the new analyst proved to be remarkably ________, completing all assigned audits days ahead of schedule.'",
        options: [
          { id: "A", text: "diligent ... lazy" },
          { id: "B", text: "indolent ... industrious" },
          { id: "C", text: "proficient ... skilled" },
          { id: "D", text: "reticent ... vocal" }
        ],
        correctOption: "B",
        solution: "The phrase 'Far from being [Word 1]' sets up an antithesis: Word 1 and Word 2 must be polar opposites.\nThe clue following the comma says 'completing all assigned audits days ahead of schedule', describing someone who is hardworking.\n• 'Indolent' means lazy; 'industrious' means hardworking.\n• 'Far from being lazy (indolent), he was hardworking (industrious).'\n∴ Option (B) completes the sentence accurately."
      }
    ],
    commonMistakes: [
      "Settling for an option where only one word fits well while ignoring that the other word makes the sentence illogical.",
      "Missing double negatives that invert the expected meaning."
    ]
  },

  "para-jumbles": {
    topicId: "para-jumbles",
    title: "Para Jumbles",
    category: "verbal",
    introduction: "Para Jumbles evaluates paragraph reconstruction, requiring scrambled sentences to be reassembled into a coherent argument using chronological, pronominal, and transitional clues.",
    concepts: [
      {
        heading: "Identifying the Opening Sentence (Independent Anchor)",
        body: "• The opening sentence must be an independent assertion introducing the central topic or noun.\n• It NEVER begins with unresolved pronouns ('He', 'They', 'It', 'This') whose antecedents haven't been stated.\n• It NEVER begins with transitional connectives ('However', 'Furthermore', 'Consequently', 'On the other hand')."
      },
      {
        heading: "Mandatory Pairs & Chronological Flow",
        body: "• Full Name / Acronym Pair: A person or institution is introduced by their full name first, followed by acronyms or pronouns in subsequent sentences (e.g. World Health Organization before WHO).\n• Pronoun-Noun Link: A sentence introducing a noun immediately precedes the sentence referring to it via 'This [noun]' or 'These [nouns]'.\n• Cause precedes Effect: A problem is described before its solution is proposed."
      }
    ],
    formulas: [
      {
        name: "Noun-to-Pronoun Mandatory Pair",
        formula: "Sentence(Noun)  -->  Sentence(Pronoun / 'This')",
        explanation: "The noun must appear before the pronoun referencing it."
      },
      {
        name: "Acronym Sequence Rule",
        formula: "Full Form Name  -->  Abbreviated Acronym",
        explanation: "e.g. United Nations first, UN subsequently."
      }
    ],
    solvedExamples: [
      {
        problem: "Arrange the four sentences (A, B, C, D) in the correct logical sequence:\nA. However, modern automated trading algorithms are rapidly altering this dynamic.\nB. Historically, financial trading floors were dominated by human floor brokers shouting orders.\nC. Today, more than eighty percent of equity trades are executed by computerized high-frequency systems.\nD. This physical marketplace required immense manual coordination and intense vocal stamina.",
        options: [
          { id: "A", text: "B - D - A - C" },
          { id: "B", text: "A - C - B - D" },
          { id: "C", text: "B - A - D - C" },
          { id: "D", text: "D - B - A - C" }
        ],
        correctOption: "A",
        solution: "1. Find the opening sentence: Sentence B introduces the topic historically ('Historically, financial trading floors were dominated...'). It establishes context independently.\n2. Find mandatory pairs:\n• Sentence D mentions 'This physical marketplace', which directly refers back to the physical floors in B. Thus, (B - D) is a mandatory pair.\n• Sentence A introduces a modern contrast ('However, modern automated trading algorithms...').\n• Sentence C provides supporting data ('Today, more than eighty percent...') for the shift introduced in A. Thus, (A - C) is a mandatory pair.\n3. Synthesize the sequence: B → D → A → C.\n∴ The correct sequence is B - D - A - C."
      },
      {
        problem: "Arrange the four sentences (A, B, C, D) into a coherent chronological paragraph:\nA. She was awarded the Nobel Prize in Physics in 1903 for her research on radiation phenomena.\nB. Marie Curie was born in Warsaw, Poland, in 1867.\nC. Later in 1911, she received a second Nobel Prize, this time in Chemistry.\nD. She moved to Paris to pursue her higher scientific education at the Sorbonne.",
        options: [
          { id: "A", text: "B - A - D - C" },
          { id: "B", text: "B - D - A - C" },
          { id: "C", text: "D - B - A - C" },
          { id: "D", text: "B - D - C - A" }
        ],
        correctOption: "B",
        solution: "Trace the biographical chronology:\n1. Sentence B introduces Marie Curie by name and birth year (1867) — independent opening sentence.\n2. Sentence D follows with her move to Paris to pursue studies at the Sorbonne.\n3. Sentence A follows with her first Nobel Prize in 1903.\n4. Sentence C follows with her second Nobel Prize in 1911 ('Later in 1911...').\nChronological sequence: B (1867) → D (studies) → A (1903) → C (1911).\n∴ The correct sequence is B - D - A - C."
      }
    ],
    commonMistakes: [
      "Selecting a sentence with a dangling pronoun like 'This' or a transition like 'However' as the opening sentence.",
      "Violating chronological order when specific historical years or sequence markers are stated."
    ]
  },

  "reading-comprehension": {
    topicId: "reading-comprehension",
    title: "Reading Comprehension",
    category: "verbal",
    introduction: "Reading Comprehension evaluates structural textual analysis, central idea extraction, authorial tone, factual verification, and deductive inference from academic and professional passages.",
    concepts: [
      {
        heading: "Primary Purpose vs. Supporting Details",
        body: "• Primary Purpose / Central Idea: What the passage as an integrated whole accomplishes. Typically established in the opening paragraph and synthesized in the conclusion.\n• Direct Facts: Information explicitly stated verbatim in the text.\n• Inferences: Unstated conclusions that are 100% logically necessitated by the text. If an option requires outside speculation, it is an invalid inference."
      },
      {
        heading: "Author's Tone & Distractor Elimination",
        body: "• Tone Classifications: Objective/Analytical (factual, neutral), Critical (highlighting flaws), Skeptical (doubting claims), Laudatory (praising), Pragmatic (practical).\n• Distractor Traps:\n  - Too Broad: Exceeds the passage's actual scope.\n  - Too Narrow: Accurately describes one minor detail but fails as a main idea.\n  - Extreme Qualifiers: Uses absolute words like 'always', 'never', 'completely' when the text was measured."
      }
    ],
    formulas: [
      {
        name: "Passage Primacy Principle",
        formula: "Valid Answer  <==>  Substantiated within the text",
        explanation: "Outside real-world facts cannot be used if unsupported by the passage."
      },
      {
        name: "Extreme Modifier Heuristic",
        formula: "Options with 'always', 'never', 'only' are incorrect unless explicitly affirmed in text",
        explanation: "Helps eliminate aggressive distractors."
      }
    ],
    solvedExamples: [
      {
        problem: "Passage:\n'While quantum computing holds immense theoretical promise for cryptography and molecular simulation, current prototypes remain severely constrained by qubit decoherence and thermal noise. Without scalable fault-tolerant error correction, practical commercial utility outside specialized laboratories remains years away.'\nWhat is the author's primary purpose?",
        options: [
          { id: "A", text: "To dismiss quantum computing as an unviable dead end." },
          { id: "B", text: "To provide a balanced assessment of quantum computing's potential alongside its immediate engineering hurdles." },
          { id: "C", text: "To advocate for increased government funding for molecular simulation." },
          { id: "D", text: "To explain the detailed physics of qubit decoherence." }
        ],
        correctOption: "B",
        solution: "Analyze the tone and overall scope:\nThe author acknowledges the 'immense theoretical promise' while also identifying current practical engineering barriers ('severely constrained', 'years away').\n• Option (B) captures this measured, balanced evaluation.\n• (A) is overly negative ('dead end').\n• (C) mentions government funding, which is absent from the text.\n• (D) is too narrow as physics mechanisms are not detailed.\n∴ Option (B) represents the primary purpose."
      },
      {
        problem: "Based on the passage above, what can be logically inferred?",
        options: [
          { id: "A", text: "Commercial quantum computers currently operate widely across industry." },
          { id: "B", text: "Quantum computing will replace classical computing within the decade." },
          { id: "C", text: "Overcoming qubit decoherence through error correction is necessary for practical commercial deployment." },
          { id: "D", text: "Quantum computers can operate without error correction." }
        ],
        correctOption: "C",
        solution: "Inspect the explicit statement in the passage:\n'Without scalable fault-tolerant error correction, practical commercial utility... remains years away.'\n⇒ This logically implies that overcoming decoherence via error correction is a necessary prerequisite for commercial utility.\n• Options (A), (B), and (D) contradict the text or make unsupported leaps.\n∴ Option (C) is the sound inference."
      }
    ],
    commonMistakes: [
      "Choosing an answer based on external knowledge that contradicts or is unsupported by the passage.",
      "Picking an option that is true of one individual sentence but does not represent the main theme of the entire passage."
    ]
  },

  "idioms-and-phrases": {
    topicId: "idioms-and-phrases",
    title: "Idioms and Phrases",
    category: "verbal",
    introduction: "Idioms and Phrases assesses figurative expressions, proverbs, and metaphorical phrases frequently used in professional, corporate, and campus communication.",
    concepts: [
      {
        heading: "Figurative vs. Literal Meaning",
        body: "• An idiom is an expression whose figurative meaning cannot be deduced simply from the literal definitions of its individual words.\n• Common Workplace Idioms:\n  - 'Bite the bullet': Face a difficult or unpleasant situation with courage.\n  - 'Burn the midnight oil': Work or study late into the night.\n  - 'Play devil's advocate': Argue against an idea purely to test its validity or provoke debate.\n  - 'At the eleventh hour': At the last possible moment before a deadline.\n  - 'Take with a grain of salt': View a statement with skepticism or reservation."
      },
      {
        heading: "High-Frequency Thematic Categories & Context Clues",
        body: "• Communication & Secrets: 'Spill the beans' (reveal secrets prematurely), 'Hear through the grapevine' (learn via informal gossip), 'Read between the lines' (discern implied meaning).\n• Decision Making & Risk: 'Cross the Rubicon' (make an irreversible decision), 'Throw in the towel' (admit defeat), 'Skating on thin ice' (taking dangerous risks).\n• Contextual Clues: Examine the emotional tone and outcomes in the sentence to deduce whether the idiom conveys success, warning, or persistence."
      }
    ],
    formulas: [
      {
        name: "Metaphorical Interpretation Principle",
        formula: "Meaning(Idiom) ≠ Σ Meaning(Individual Words)",
        explanation: "Literal interpretations of idioms are almost always incorrect distractors."
      }
    ],
    solvedExamples: [
      {
        problem: "What is the meaning of the underlined idiom: 'During the design review, Priya decided to play devil's advocate to stress-test our assumptions.'",
        options: [
          { id: "A", text: "To maliciously sabotage the engineering project." },
          { id: "B", text: "To present opposing arguments to provoke critical debate and uncover weaknesses." },
          { id: "C", text: "To act as the official spokesperson for senior leadership." },
          { id: "D", text: "To mediate an argument between two developers." }
        ],
        correctOption: "B",
        solution: "The idiom 'to play devil's advocate' means to deliberately take an opposing position or question assumptions to stimulate debate and test the robustness of a plan.\n• Option (B) expresses this exact figurative meaning.\n• (A), (C), and (D) are incorrect.\n∴ The correct meaning is Option (B)."
      },
      {
        problem: "Identify the sentence that correctly uses the idiom 'at the eleventh hour':",
        options: [
          { id: "A", text: "The meeting was scheduled at the eleventh hour of the morning, exactly 11:00 AM." },
          { id: "B", text: "The research team submitted their conference paper at the eleventh hour, just five minutes before the portal closed." },
          { id: "C", text: "He worked eleven hours every single day to finish his project." },
          { id: "D", text: "The clock chimed eleven times during the night." }
        ],
        correctOption: "B",
        solution: "The idiom 'at the eleventh hour' figuratively means at the very last moment or just before a cutoff deadline.\n• Sentence (B) uses the idiom correctly in its figurative sense.\n• Sentences (A), (C), and (D) mistakenly interpret the phrase literally.\n∴ Sentence (B) is the correct usage."
      }
    ],
    commonMistakes: [
      "Interpreting idioms literally rather than metaphorically.",
      "Confusing idioms with similar wording but different meanings."
    ]
  },

  "one-word-substitution": {
    topicId: "one-word-substitution",
    title: "One-word Substitution",
    category: "verbal",
    introduction: "One-word Substitution evaluates the ability to replace verbose descriptive definitions with precise, economical single-word vocabulary across professions, governance, philosophies, and behavior.",
    concepts: [
      {
        heading: "High-Frequency Categories",
        body: "• Persons & Specialists:\n  - Polyglot: A person who speaks or writes several languages fluently.\n  - Philanthropist: One who actively seeks to promote human welfare and donates to causes.\n  - Altruist: One who selflessly puts the welfare of others before themselves.\n  - Misanthrope: One who dislikes or distrusts humankind.\n• Systems of Governance:\n  - Oligarchy: Rule by a small group of powerful individuals.\n  - Plutocracy: Government by the wealthy.\n  - Anarchy: Absence of government or political authority.\n  - Autocracy: Government by a single individual with absolute power.\n• Beliefs & Philosophies:\n  - Agnostic: One who believes the existence of God is unknown or unknowable.\n  - Atheist: One who disbelieves in the existence of a deity.\n  - Stoic: One who endures pain or hardship without showing emotion or complaining."
      },
      {
        heading: "Root Suffixes in Word Substitutions",
        body: "Recognizing common Greek and Latin suffixes speeds up substitution:\n• '-cide' (killing): regicide (king), patricide (father), insecticide (insects).\n• '-cracy' (governance): democracy (people), meritocracy (merit), bureaucracy (officials).\n• '-phobia' (irrational fear): claustrophobia (confined spaces), acrophobia (heights).\n• '-phile' (love/affinity): bibliophile (books), audiophile (sound).\n• '-ology' (systematic study): ornithology (birds), entomology (insects)."
      }
    ],
    formulas: [
      {
        name: "Lexical Economy Principle",
        formula: "Verbose Descriptive Clause  <==>  Single Precise Word",
        explanation: "Enhances clarity and conciseness in professional communication."
      }
    ],
    solvedExamples: [
      {
        problem: "Identify the single word that substitutes: 'A person who speaks or writes several languages fluently.'",
        options: [
          { id: "A", text: "Linguist" },
          { id: "B", text: "Polyglot" },
          { id: "C", text: "Grammarian" },
          { id: "D", text: "Monoglot" }
        ],
        correctOption: "B",
        solution: "Analyze the options:\n• 'Polyglot': poly (many) + glotta (tongue) = one who speaks multiple languages fluently.\n• 'Linguist': a scholar who studies linguistics (the science of language).\n• 'Grammarian': an expert in grammar rules.\n• 'Monoglot': a person who speaks only one language.\n∴ The exact one-word substitute is Polyglot."
      },
      {
        problem: "Find the single word for: 'One who endures pain, hardship, or misfortune without showing feelings or complaining.'",
        options: [
          { id: "A", text: "Pessimist" },
          { id: "B", text: "Stoic" },
          { id: "C", text: "Hedonist" },
          { id: "D", text: "Cynic" }
        ],
        correctOption: "B",
        solution: "Analyze the options:\n• 'Stoic': one who endures pain or adversity with calm restraint and without complaint.\n• 'Pessimist': one who tends to see the worst aspect of things.\n• 'Hedonist': one who believes pursuit of pleasure is the primary good.\n• 'Cynic': one who believes people are motivated purely by self-interest.\n∴ The correct substitute is Stoic."
      }
    ],
    commonMistakes: [
      "Confusing 'linguist' (a researcher of languages) with 'polyglot' (a person who speaks multiple languages).",
      "Confusing 'agnostic' (believes God's existence is unknowable) with 'atheist' (disbelieves in God)."
    ]
  }
};
