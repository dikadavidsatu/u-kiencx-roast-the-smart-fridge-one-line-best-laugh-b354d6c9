/**
 * Roast the Smart Fridge: One Line, Best Laugh Wins
 *
 * A tiny, deterministic TypeScript program whose entire job is to print
 * exactly one line: a roast of the modern "smart" fridge — an appliance
 * that costs as much as a used car, watches everything you eat through
 * an interior camera, and reports your midnight snacking to an app.
 *
 * The joke is assembled from named fragments (the surveillance setup,
 * the price tag, and the parole-officer punchline) so the structure of
 * the gag is readable in the source, then passed through a small gate
 * that enforces the competition's shape before anything is printed:
 *
 *   - the output is a single line (no embedded line breaks),
 *   - the line stays within the one-liner character budget,
 *   - the line is non-empty and already trimmed.
 *
 * Running the program twice always produces byte-identical output:
 * there is no randomness, no clock, no environment or network access.
 */

/** Maximum characters allowed for the one-line entry. */
const MAX_LINE_CHARS = 240;

/** The fridge's surveillance habits, listed the way its marketing brags. */
const SURVEILLANCE_SETUP: readonly string[] = [
  "texts me when I open it at 2 a.m.",
  "photographs the evidence",
  "and snitches to an app",
];

/** What the buyer thought they were paying for. */
const PRICE_TAG = "I paid $3,000 for a refrigerator";

/** What the buyer actually ended up with. */
const PUNCHLINE = "accidentally hired a parole officer for cheese";

/**
 * Join the setup fragments into one flowing clause.
 *
 * The fragments are stored comma-free on purpose: this helper owns the
 * punctuation so the assembled sentence reads as a single breath, the
 * way a stand-up setup is delivered before the pause.
 */
function joinSetup(fragments: readonly string[]): string {
  return fragments.join(", ");
}

/**
 * Assemble the full roast line from its parts.
 *
 * Shape: "My smart fridge <setup> — <price tag> and <punchline>."
 * The em dash is the beat before the twist; everything after it is the
 * reframe that turns a kitchen appliance into a corrections officer
 * assigned to dairy.
 */
function buildRoastLine(): string {
  const subject = "My smart fridge";
  const setup = joinSetup(SURVEILLANCE_SETUP);
  return `${subject} ${setup} — ${PRICE_TAG} and ${PUNCHLINE}.`;
}

/**
 * Count the characters of a line the way a character gate would:
 * by Unicode code points, not UTF-16 code units, so an em dash or any
 * other punctuation counts exactly once.
 */
function countChars(line: string): number {
  return [...line].length;
}

/**
 * Check a candidate line against the entry gate.
 *
 * Returns a list of problems; an empty list means the line may print.
 * Kept separate from the throwing wrapper below so the rules are easy
 * to eyeball and the failure messages stay specific.
 */
function gateProblems(line: string): string[] {
  const problems: string[] = [];
  if (line.length === 0) {
    problems.push("the line is empty");
  }
  if (line !== line.trim()) {
    problems.push("the line has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("the entry must be exactly one line");
  }
  if (countChars(line) > MAX_LINE_CHARS) {
    problems.push(`the line exceeds ${MAX_LINE_CHARS} characters`);
  }
  return problems;
}

/**
 * Enforce the gate: throw with every problem found, or return the line
 * unchanged when it is fit to print.
 */
function assertGate(line: string): string {
  const problems = gateProblems(line);
  if (problems.length > 0) {
    throw new Error(`entry gate failed: ${problems.join("; ")}`);
  }
  return line;
}

/**
 * Prove the gate actually bites before trusting it with the real line.
 *
 * Each sample below violates exactly one rule, and each must come back
 * with at least one problem; a gate that waves everything through is
 * worse than no gate at all. This runs silently — the roast remains
 * the program's only output.
 */
function selfCheckGate(): void {
  const badLines: readonly string[] = [
    "",
    " two lines\nof roast ",
    "x".repeat(MAX_LINE_CHARS + 1),
  ];
  for (const bad of badLines) {
    if (gateProblems(bad).length === 0) {
      throw new Error("entry gate self-check failed: a bad line passed");
    }
  }
  if (gateProblems(buildRoastLine()).length !== 0) {
    throw new Error("entry gate self-check failed: the roast was rejected");
  }
}

/** Build the roast, gate it, and print it as the program's only output. */
function main(): void {
  selfCheckGate();
  const line = assertGate(buildRoastLine());
  console.log(line);
}

main();
