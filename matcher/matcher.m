%%
clc;
clear;
close all;
workspace;
fontSize = 16;

%% Constants

IMAGE_FILE = 'c_pyramidposter.jpg';
POLYGON_FILE = 'polypyramid.csv';
NORMAL_SIZE = 1000;

%% Load the image.

rgbImage = imread(IMAGE_FILE);

% Get image size.
[imWidth, imHeight, ~] = size(rgbImage);
imSize = min(imWidth, imHeight);
scaleFactor = NORMAL_SIZE / imSize;

rgbImage = imresize(rgbImage, scaleFactor);

grayImage = rgb2gray(rgbImage);

%% Display the image.

subplot(3, 3, 1);
imshow(rgbImage);
title('Original', 'FontSize', fontSize);
set(gcf, 'Position', get(0,'Screensize')); % Enlarge figure to full

%% Load polygons.

polygons = loadpolygons(POLYGON_FILE);
nPolygons = length(polygons);
nEdges = countedges(polygons);

%% Display our polygons.

subplot(3, 3, 2);
imshow(rgbImage);
title('Defined Polygons', 'FontSize', fontSize);
hold on;

drawpolygons(polygons, imSize);

%% Extract initial polygons.
initMask = zeros(imWidth, imHeight);
for i = 1:nPolygons
    x = polygons{i}{1} * imSize / 256;
    y = polygons{i}{2} * imSize / 256;
    initMask = bitor(initMask, poly2mask(x, y, imWidth, imHeight));
end

% Dilate polygon mask.
se = strel('disk', 50 * scaleFactor, 0);
initMask = imdilate(initMask, se);

%% Mask gray image with polygon mask.

grayImage(~initMask) = 0;

%% Edge detection.

BW = edge(grayImage, 'canny', 0.2);

%% Remove edge of image from detected edges.

se = strel('disk', 2, 0);
BW(~imerode(initMask, se)) = 0;

%% Display our edge detection.

subplot(3, 3, 3);
imshow(BW, []);
title('Edges', 'FontSize', fontSize);

%% Get Hough lines.

numPeaks = ceil(nEdges * 10);

[H,T,R] = hough(BW);
P = houghpeaks(H,numPeaks,'threshold',ceil(0.1*max(H(:))));

lines = houghlines(BW,T,R,P,...
                   'FillGap', 20 * scaleFactor,...
                   'MinLength', 28 * scaleFactor);

%% Display our Hough lines.

subplot(3, 3, 4);
imshow(rgbImage);
title('Hough Lines', 'FontSize', fontSize);
hold on;
for k = 1:length(lines)
   xy = [lines(k).point1; lines(k).point2];
   plot(xy(:,1),xy(:,2),'LineWidth',2,'Color','green');

   % Plot beginnings and ends of lines
   plot(xy(1,1),xy(1,2),'x','LineWidth',2,'Color','yellow');
   plot(xy(2,1),xy(2,2),'x','LineWidth',2,'Color','red');
end

%% Find matching line segments.

matchedLines = cell(nPolygons, 1);
matchedDiffs = cell(nPolygons, 1);
for i = 1:nPolygons
    [matchedLines{i}, matchedDiffs{i}] = ...
        matchlinestopolygon(lines, polygons{i}, imSize);
end

%% Display matched line segments.

subplot(3, 3, 5);
imshow(rgbImage);
title('Matched Lines', 'FontSize', fontSize);
hold on;

colormap parula;
colors = colormap();
totalColors = size(colors,1);

for polyi = 1:nPolygons
    ml = matchedLines{polyi};
    
    minDiffs = matchedDiffs{polyi};
    minMinDiff = min(minDiffs);
    maxMinDiff = max(minDiffs);
    
    for i = 1:length(ml)
        xy = ml{i};
        
%             outlineX = polygons{polyi}{1} * imSize / 256;
%             outlineY = polygons{polyi}{2} * imSize / 256;
% 
%             nPoints = size(outlineX, 2);
%             i2 = mod(i, nPoints) + 1;
% 
%             xy1 = [outlineX(i), outlineY(i)];
%             xy2 = [outlineX(i2), outlineY(i2)];
%             [rho, theta] = points2rhotheta(xy1(1), xy1(2), xy2(1), xy2(2));
%             drawline_rhotheta(rho, theta);
        
        colorIndex = floor((minDiffs(i) - minMinDiff) / ...
                           (maxMinDiff-minMinDiff+1) * totalColors) + 1;
        plot(xy(:,1),xy(:,2),'LineWidth',2,'Color',colors(colorIndex, :));

        % Plot beginnings and ends of lines
        plot(xy(1,1),xy(1,2),'x','LineWidth',1,'Color','yellow');
        plot(xy(2,1),xy(2,2),'x','LineWidth',1,'Color','red');
    end
end

%% Extend matched lines into polygonal shape.

polylineX = cell(nPolygons, 1);
polylineY = cell(nPolygons, 1);
for i = 1:nPolygons
    [polylineX{i}, polylineY{i}] = extendmatchedlines(matchedLines{i});
end

%% Display extended matched lines.

subplot(3, 3, 6);
imshow(rgbImage);
title('Extended Lines', 'FontSize', fontSize);
hold on;

for i = 1:nPolygons
    px = polylineX{i};
    py = polylineY{i};
    
    for i = 1:length(px)
        i2 = mod(i, length(px)) + 1;
        x = [px(i), px(i2)];
        y = [py(i), py(i2)];

        plot(x, y,'LineWidth',2,'Color','green');

        % Plot beginnings and ends of lines
        plot(x(1),y(1),'x','LineWidth',2,'Color','yellow');
        plot(x(2),y(2),'x','LineWidth',2,'Color','yellow');
    end
end

%% Masking out the polygons.

maskedImages = cell(nPolygons, 1);
masks = cell(nPolygons, 1);
for i = 1:nPolygons
    x = polylineX{i};
    y = polylineY{i};
    masks{i} = poly2mask(x, y, imWidth, imHeight);
    
    % Blur masks by a bit.
    masks{i} = imgaussfilt(double(masks{i}), 1);

    maskedImages{i} = bsxfun(@times, rgbImage, cast(masks{i}, 'like', rgbImage));

    if 6 + i <= 9
        subplot(3, 3, 6 + i);
        imshow(maskedImages{i});
        title('Matched Object', 'FontSize', fontSize);
    end
end

%% Save masked out polygons.

for i = 1:nPolygons
    imwrite(rgbImage, ['object' num2str(i) '.png'], 'Alpha', double(masks{i}));
end

%% Make background.

bgMask = 1 - masks{1};
for i = 2:nPolygons
    bgMask = bgMask .* (1 - masks{i});
end

% Erase border artifacts.
se = strel('square', ceil(size(bgMask, 1) * 0.010));
bgMask = imerode(bgMask, se);

bgImageOrig = bsxfun(@times, rgbImage, cast(bgMask, 'like', rgbImage));

%% Infill background.

bgImageRed = bgImageOrig(:, :, 1);
bgImageGreen = bgImageOrig(:, :, 2);
bgImageBlue = bgImageOrig(:, :, 3);

fillMask = uint8(zeros(imWidth, imHeight));
for i = 1:nPolygons
    fillMask = bitor(fillMask, uint8(masks{i}));
end

se = strel('disk', 8 * scaleFactor);
fillMask = imdilate(fillMask, se);

bgImageRed = regionfill(bgImageRed, fillMask);
bgImageGreen = regionfill(bgImageGreen, fillMask);
bgImageBlue = regionfill(bgImageBlue, fillMask);

bgImage = bgImageOrig;
bgImage(:, :, 1) = bgImageRed;
bgImage(:, :, 2) = bgImageGreen;
bgImage(:, :, 3) = bgImageBlue;

%% Save background.

imwrite(bgImage, 'bg.png');
imwrite(bgImageOrig, 'bgorig.png', 'Alpha', bgMask);
imwrite(imdilate(1 - bgMask, strel('disk', 10 * scaleFactor)), 'bgmask.png');
