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

  def writePolygonsToCsv(self, fname):
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

  def writeAnimationsToCsv(self, fname):
    with open(fname, 'wb') as csvFile:
      csvWriter = csv.writer(csvFile)

      for polygon in self._polygons:
        for row in polygon.animationRows:
          csvWriter.writerow(row)

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

    numPositionKeyframes = bitStream.read(6)
    numbers.append(numPositionKeyframes)

    firstPosition = None

    for i in range(numPositionKeyframes):
      frameIndex = bitStream.read(6)
      numbers.append(frameIndex)
      positionX = bitStream.read(8) - 128
      numbers.append(positionX)
      positionY = bitStream.read(8) - 128
      numbers.append(positionY)

      if firstPosition is None:
        firstPosition = (positionX, positionY)

      polygon.addPosition(frameIndex, positionX, positionY)

    if firstPosition is not None:
      for point in polygon.points:
        point.x += firstPosition[0]
        point.y += firstPosition[1]

    numRotationKeyframes = bitStream.read(6)

    for i in range(numRotationKeyframes):
      frameIndex = bitStream.read(6)
      numbers.append(frameIndex)
      rotation = bitStream.read(9) / 512.0 * 4 * math.pi - 2 * math.pi
      numbers.append(rotation)

      polygon.addRotation(frameIndex, rotation)

    print(numbers)

    return polygon


class Polygon:
  def __init__(self):
    self._points = []

    self._positionXFrames = AnimationFrames('x')
    self._positionYFrames = AnimationFrames('y')

    self._rotationFrames = AnimationFrames('rotation')

  def addPoint(self, point):
    assert isinstance(point, PolygonPoint)

    self._points.append(point)

  def addPosition(self, frameIndex, x, y):
    self._positionXFrames.setVal(frameIndex, x)
    self._positionYFrames.setVal(frameIndex, y)

  def addRotation(self, frameIndex, rotation):
    self._rotationFrames.setVal(frameIndex, rotation)

  @property
  def points(self):
    return self._points

  @property
  def animationRows(self):
    return [
      self._positionXFrames.asRow,
      self._positionYFrames.asRow,
      self._rotationFrames.asRow
    ]

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


class AnimationFrames:
  FRAMES = 64

  def __init__(self, name):
    self._name = name

    self._vals = [None] * AnimationFrames.FRAMES

  @property
  def name(self):
    return self._name

  @property
  def asRow(self):
    return [self._name] + self._vals

  def setVal(self, frameIndex, val):
    assert(frameIndex < AnimationFrames.FRAMES)

    self._vals[frameIndex] = val
