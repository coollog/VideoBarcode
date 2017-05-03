% Draws polygons loaded from loadpolygons.

function drawpolygons(polygons, toSize)

nPolygons = size(polygons, 1);

% Get some color coding for polygons.
colormap jet;
colors = colormap();

for pi = 1:nPolygons
    outlineX = polygons{pi, 1}{1, 1};
    outlineY = polygons{pi, 1}{1, 2};
    
    color = colors(ceil(rand * size(colors,1)),:);
    
    for i = 1:length(outlineX)
        i2 = mod(i, length(outlineX)) + 1;
        x = [outlineX(i), outlineX(i2)] * toSize / 256;
        y = [outlineY(i), outlineY(i2)] * toSize / 256;

        plot(x, y, 'LineWidth', 2, 'Color', color);

        % Plot beginnings and ends of lines
        plot(x(1),y(1),'x','LineWidth',2,'Color','yellow');
        plot(x(2),y(2),'x','LineWidth',2,'Color','yellow');
    end
end