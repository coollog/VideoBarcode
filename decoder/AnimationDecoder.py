import base64
import csv
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
    print(self._qr.data)

    binData = base64.b64decode(self._qr.data)

    for uint8 in binData:
      byte = ord(uint8)
      bits.write(8, byte)

    print(bits)

    self._processPolygons(bits)

  def writeToCsv(self, fname):
    with open(fname, 'wb') as csvFile:
      csvWriter = csv.writer(csvFile)

      for polygon in self._polygons:
        print(polygon)

        polyRow = []
        polyRow.append(len(polygon.points))

        for point in polygon.points:
          polyRow.append(point.x)
          polyRow.append(point.y)

        csvWriter.writerow(polyRow)

  def _processPolygons(self, bitStream):
    polygon = True

    while polygon != None:
      polygon = self._processPolygon(bitStream)
      if polygon is not None:
        self._polygons.append(polygon)

  # Process a single polygon from 'bitStream'.
  # Returns the polygon or none if failed.
  def _processPolygon(self, bitStream):
    numbers = []

    numPoints = bitStream.read(4)
    numbers.append(numPoints)
    if math.isnan(numPoints) or numPoints == 0:
      return None

    polygon = Polygon()

    for i in range(numPoints):
      x = bitStream.read(8)
      numbers.append(x)
      y = bitStream.read(8)
      numbers.append(y)
      point = PolygonPoint(x, y)
      polygon.addPoint(point)

    numKeyframes = bitStream.read(6)
    numbers.append(numKeyframes)

    firstPosition = None

    for i in range(numKeyframes):
      frameIndex = bitStream.read(6)
      numbers.append(frameIndex)
      positionX = bitStream.read(8)
      numbers.append(positionX)
      positionY = bitStream.read(8)
      numbers.append(positionY)

      if firstPosition is None:
        firstPosition = (positionX - 128, positionY - 128)

      # TODO: Add these to a frame model.

    if firstPosition is not None:
      for point in polygon.points:
        point.x += firstPosition[0]
        point.y += firstPosition[1]

    print(numbers)

    return polygon


class Polygon:
  def __init__(self):
    self._points = []

  def addPoint(self, point):
    assert isinstance(point, PolygonPoint)

    self._points.append(point)

  @property
  def points(self):
    return self._points

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

  @x.setter
  def x(self, value):
    self._x = value

  @y.setter
  def y(self, value):
    self._y = value

  def __str__(self):
    return '[%d,%d]' % (self._x, self._y)

decoder = AnimationDecoder()
decoder.decode('qr6.png')
decoder.writeToCsv('poly1.csv')