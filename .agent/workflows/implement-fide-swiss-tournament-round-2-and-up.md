---
description:
---

Implement a FIDE conform Swiss Tournament calculator.

The calculation of the first round is already implemented. Only take care of round 2 and higher.

These are the FIDE rules that have to be strictly followed and also have to be tested for thouroughly:

1.The number of rounds to be played is declared beforehand.

2.Two participants shall not play against each other more than once.

3.Should the number of participants to be paired be odd, one participant is not paired. This participant receives a pairing-allocated bye: no opponent, no colour and as many points as are rewarded for a win, unless the rules of the tournament state otherwise. This number of points shall be the same for all pairing-allocated byes.

4.A participant who has already received a pairing allocated bye, or has already scored in one single round, without playing, as many points as rewarded for a win, shall not receive the pairing allocated bye.

5.In general, participants are paired to others with the same score.

6.For each participant the difference between the number of rounds they play with Black and the number of rounds they play with White shall not be greater than 2 or less than -2. Each pairing system may have exceptions to this rule.

7.No participants shall receive the same colour three times in a row. Each pairing system may have exceptions to this rule.

8.In general, a participant is given the colour with which they played fewer rounds. If colours are already balanced, then, in general, the participant is given the colour that alternates from the last one with which they played.

9.The pairing rules must be such transparent that the person who is in charge for the pairing can explain them.

Rule 1 and 9 are not part of this calculation.
We will try to follow Rule 6 as strictly as possible.

There is a more detailed description and rule set in .agent/fide-dutch-swiss-rules.md you should follow.

Search the internet for implementation advice or already existing solutions you can copy.
Always use the types in src/types.ts
If you need to create new types add them locally but don't edit src/types.ts

Create a tests/otherRounds.test.ts file first and write tests for common scenarios and edge cases for rounds 2 to 10 with up to 50 players.

The file to be changed is src/calculateSwissPairings.ts
You can create more files for bigger util functions and for splitting logic meaningfully.
Use smaller functions to make the code more readable.
Use lodash-es (already installed) if it makes the logic easier to follow.

Make at least 100 tool usages.

Run tests in the shell with "bun test", check the output and reiterate on the code until the tests pass.

If all tests pass run "bun run build" to check if the project builds.
