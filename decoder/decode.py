from AnimationDecoder import AnimationDecoder

import sys

name = sys.argv[1]

decoder = AnimationDecoder()
decoder.decode('qr%s.png' % name)
decoder.writePolygonsToCsv('poly%s.csv' % name)
decoder.writeAnimationsToCsv('anim%s.csv' % name)