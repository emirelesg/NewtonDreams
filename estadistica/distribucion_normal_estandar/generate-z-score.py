from scipy.stats import norm

with open('z-score.txt', 'w') as fh:
	fh.write('area = [\n\t')
	for _z in range(-400, 1):
		z = _z / 100.0
		t = "%f, " % (norm.cdf(z))
		fh.write(t)
		if (abs(_z) % 10 == 0): fh.write('\n\t')
	fh.write('\n]')