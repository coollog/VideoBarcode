from AnimationDecoder import AnimationDecoder

name = 'rot3'

decoder = AnimationDecoder()
decoder.decode('qr%s.png' % name)
decoder.writePolygonsToCsv('poly%s.csv' % name)
decoder.writeAnimationsToCsv('anim%s.csv' % name)