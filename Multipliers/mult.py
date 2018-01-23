import fractions
from pprint import pprint

lcm_limit = 32
octave_limit = 4

candidates = [(x, y) for x in range(1, lcm_limit + 1) for y in range(1, lcm_limit + 1)]
candidates = [c for c in candidates
	if fractions.gcd(c[0], c[1]) == 1
	and c[0] * c[1] <= lcm_limit
	and 1 / octave_limit <= c[0] / c[1] <= octave_limit]

candidates.sort(key=lambda c: c[0] / c[1])

pprint(candidates)
print(len(candidates))