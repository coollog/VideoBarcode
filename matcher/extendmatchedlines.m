% Extend matched Hough lines to intersection points to form new polygon.

function [polylineX, polylineY] = extendmatchedlines(lines)

newX = zeros(length(lines), 2);
newY = zeros(length(lines), 2);
for i = 1:length(lines)
    xy1 = lines{i}(1, :);
    xy2 = lines{i}(2, :);
    
    % Extend both points.
    angle21 = atan2(xy2(2) - xy1(2), xy2(1) - xy1(1));
    xy1new = xy2 + [cos(angle21) * 100000, sin(angle21) * 100000];
    angle12 = angle21 + pi;
    xy2new = xy1 + [cos(angle12) * 100000, sin(angle12) * 100000];
    
    newX(i, :) = [xy1new(1), xy2new(1)];
    newY(i, :) = [xy1new(2), xy2new(2)];
end

polylineX = zeros(length(lines), 1);
polylineY = zeros(length(lines), 1);
for i = 1:length(lines)
    i2 = mod(i, length(lines)) + 1;
    x1 = newX(i, :);
    y1 = newY(i, :);
    x2 = newX(i2, :);
    y2 = newY(i2, :);
    
    [xi, yi] = polyxpoly(x1, y1, x2, y2);
    polylineX(i) = xi(1);
    polylineY(i) = yi(1);
end