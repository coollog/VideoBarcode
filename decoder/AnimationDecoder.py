import math
import qrtools
from BitStream import BitStream

class AnimationDecoder:
  def __init__(self):
    self._polygons = []

    self._qr = qrtools.QR()

  def decode(self, fname):
    self._qr.decode(fname)

    bits = BitStream()

    for uint8 in self._qr.data:
      byte = ord(uint8)
      bits.write(8, byte)

    print(bits)

    self._processPolygons(bits)

  def _processPolygons(self, bitStream):
    polygon = True

    while polygon != None:
      polygon = self._processPolygon(bitStream)
      self._polygons.append(polygon)

  # Process a single polygon from 'bitStream'.
  # Returns the polygon or none if failed.
  def _processPolygon(self, bitStream):
    numPoints = bitStream.read(4)
    print(numPoints)
    if math.isnan(numPoints) or numPoints == 0:
      return None

    polygon = Polygon()

    for i in range(numPoints):
      x = bitStream.read(8)
      y = bitStream.read(8)
      point = PolygonPoint(x, y)
      polygon.addPoint(point)

    numKeyframes = bitStream.read(6)

    for i in range(numKeyframes):
      frameIndex = bitStream.read(6)
      positionX = bitStream.read(8)
      positionY = bitStream.read(8)
      # TODO: Add these to a frame model.

    return polygon


class Polygon:
  def __init__(self):
    self._points = []

  def addPoint(self, point):
    assert isinstance(point, PolygonPoint)

    self._points.append(point)

  def __str__(self):
    s = 'Polygon with %d points: ' % len(self._points)
    s += ', '.join(str(point) for point in self._points)
    return s


class PolygonPoint:
  def __init__(self, x, y):
    self._x = x
    self._y = y

  @property
  def x(self):
    return self._x

  @property
  def y(self):
    return self._y

  def __str__(self):
    return '[%d,%d]' % (self._x, self._y)

decoder = AnimationDecoder()
decoder.decode('qr3.png')
print(decoder._polygons[0])