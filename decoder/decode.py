from AnimationDecoder import AnimationDecoder

decoder = AnimationDecoder()
decoder.decode('qr8.png')
decoder.writePolygonsToCsv('poly2.csv')
decoder.writeAnimationsToCsv('anim2.csv')