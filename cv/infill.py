import numpy as np
import cv2

img = cv2.imread('bgorig.png')
mask = cv2.imread('bgmask.png', 0)

inpaintRadius = 5
dstTelea = cv2.inpaint(img, mask, inpaintRadius, cv2.INPAINT_TELEA)
dstNs = cv2.inpaint(img, mask, inpaintRadius, cv2.INPAINT_NS)

cv2.imshow('Telea', dstTelea)
cv2.imshow('Navier-Stokes', dstNs)
cv2.waitKey(0)
cv2.destroyAllWindows()
