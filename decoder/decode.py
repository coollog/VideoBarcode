from AnimationDecoder import AnimationDecoder

decoder = AnimationDecoder()
decoder.decode('qr7.png')
decoder.writePolygonsToCsv('poly1.csv')
decoder.writeAnimationsToCsv('anim1.csv')