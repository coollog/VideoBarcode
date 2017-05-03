% Match Hough lines to polygon edges of a polygon loaded via loadpolygons.
% Returns the indices of matched lines.

function [minLines, minDiffs] = matchlinestopolygon(lines, polygon, toSize)

SCALE_FACTOR = 1000 / toSize;

DIFF_THRESHOLD = 50 * SCALE_FACTOR;

outlineX = polygon{1, 1} * toSize / 256;
outlineY = polygon{1, 2} * toSize / 256;

nPoints = size(outlineX, 2);

usedIndices = zeros(length(lines), 1);

minLines = cell(nPoints, 1);
minDiffs = zeros(nPoints, 1);
for i = 1:nPoints
    i2 = mod(i, nPoints) + 1;
    xy1 = [outlineX(i), outlineY(i)];
    xy2 = [outlineX(i2), outlineY(i2)];
    
    minDiff = realmax;
    minIndex = -1;
    
    for j = 1:length(lines)
        if usedIndices(j)
            continue
        end
        
        xy = [lines(j).point1; lines(j).point2];
        
        % Get difference.
        angle1 = atan2(xy2(2) - xy1(2), xy2(1) - xy1(1));
        angle2 = atan2(xy(2, 2) - xy(1, 2), xy(2, 1) - xy(1, 1));
        
        diffAngle = mod(angle1 - angle2, pi);
        diffAngle = min(diffAngle, pi - diffAngle);
        diffForward = norm(xy(1, :) - xy1) * norm(xy(2, :) - xy2);
        diffBackward = norm(xy(2, :) - xy1) * norm(xy(1, :) - xy2);
        diffPoints = min(diffForward, diffBackward);
        
        % Get rho, theta difference.
        [r1, t1] = points2rhotheta(xy(1, 1), xy(1, 2), xy(2, 1), xy(2, 2));
        [r2, t2] = points2rhotheta(xy1(1), xy1(2), xy2(1), xy2(2));
        diffRho = abs(r1 - r2);
        diffTheta = mod(t1 - t2, pi);
        diffTheta = min(diffTheta, pi - diffTheta);
        
        % Difference = PointDiff + 50 * AngleDiff
        diff = sqrt(diffPoints) * SCALE_FACTOR * 0.1 + 100 * diffAngle;
        
        if diff > DIFF_THRESHOLD
            diff = diffRho * SCALE_FACTOR + diffTheta * 100; 
        end
%         if (diffTheta < 0.03) && (diffRho < 10 * SCALE_FACTOR)
%             diff = diff - DIFF_THRESHOLD;
%         end
        if diff < minDiff
            minDiff = diff;
            minIndex = j;
        end
    end
  
    minDiffs(i) = minDiff;
    
    if minDiff < DIFF_THRESHOLD
        minLines(i, 1) = {[lines(minIndex).point1; lines(minIndex).point2]};
        usedIndices(minIndex, 1) = 1;
    else
        minLines(i, 1) = {[xy1; xy2]};
    end
end