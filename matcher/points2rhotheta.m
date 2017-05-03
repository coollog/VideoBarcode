% Converts two points on a line to Hesse normal form.

function [rho, theta] = points2rhotheta(x1, y1, x2, y2)

% Find point on line orthogonal to origin.
% Use parametric form of line = [x1, y1] + t * [x2 - x1, y2 - y1]

xdiff = x2 - x1;
ydiff = y2 - y1;

t = (-xdiff * x1 - ydiff * y1) / (xdiff^2 + ydiff^2);

point = [x1 + t * xdiff, y1 + t * ydiff];

rho = sqrt(point(1)^2 + point(2)^2);
theta = atan2(point(2), point(1));