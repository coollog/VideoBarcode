from AnimationDecoder import AnimationDecoder

decoder = AnimationDecoder()
decoder.decode('qrrot2.png')
decoder.writePolygonsToCsv('polyrot2.csv')
decoder.writeAnimationsToCsv('animrot2.csv')