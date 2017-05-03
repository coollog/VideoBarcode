% Match Hough lines to polygon edges of a polygon loaded via loadpolygons.
% Returns the rho, theta of matched lines.

function matches = matchhoughtopolygon(P, R, T, polygon, toSize)

peaks = [R(P(:,1)).', T(P(:,2)).'];

% Convert to radians.
peaks(:, 2) = peaks(:, 2) / 180 * pi;

DIFF_THRESHOLD = 100;

outlineX = polygon{1, 1} * toSize / 256;
outlineY = polygon{1, 2} * toSize / 256;

nPoints = size(outlineX, 2);

matches = cell(nPoints, 1);

for i = 1:length(peaks)
    if peaks(i, 1) < 0
        peaks(i, 1) = -peaks(i, 1);
        peaks(i, 2) = peaks(i, 2) + pi;
    end
end
peaks
for i = 1:nPoints
    i2 = mod(i, nPoints) + 1;
    xy1 = [outlineX(i), outlineY(i)];
    xy2 = [outlineX(i2), outlineY(i2)];

    % Get normal form of line.
    [rho, theta] = points2rhotheta(xy1(1), xy1(2), xy2(1), xy2(2))
    
    % Get difference for each peak.
    diffs = bsxfun(@(a, b) a - b, peaks, [rho, theta]);
    
    diffs(:, 1) = abs(diffs(:, 1));
    diffs(:, 2) = mod(diffs(:, 2), pi);
    diffs(:, 2) = min(diffs(:, 2), pi - diffs(:, 2));
    diffs
    diff = diffs(:, 1) + diffs(:, 2) * 100;
    
    [~, maxIndex] = min(diff);
    
    matches{i} = peaks(maxIndex, :);
end
