# Writes and reads to a bit stream.
class BitStream:
  READ_BITS_MAX = 32

  def __init__(self):
    self._bits = []
    self._pos = 0

  def write(self, nBits, num):
    assert num < 1 << nBits;

    bits = format(num, '0%db' % nBits)
    for bit in bits:
      self._bits.append(int(bit))

  def read(self, nBits):
    if nBits > BitStream.READ_BITS_MAX:
      return float('nan');

    num = 0
    for pos in range(nBits):
      if self._pos >= len(self._bits):
        continue

      power = nBits - pos - 1

      num += self._bits[self._pos] * (1 << power)
      self._pos += 1

    return num

  def __str__(self):
    return ''.join(str(bit) for bit in self._bits)
