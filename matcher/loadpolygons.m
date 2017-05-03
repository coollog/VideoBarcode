% Loads polygon data from a CSV file.

function polygons = loadpolygons(fname)

magDegree = 1; %.9 + rand * .2;

data = csvread(fname);
nRows = size(data, 1);

polygons = cell(nRows, 1);

for row = 1:nRows
    nPoints = data(row, 1);
    
    outlineX = zeros(1, nPoints);
    outlineY = zeros(1, nPoints);
    
    for polyi = 1:nPoints
        % Add random shift error.
%         outlineX(1, polyi) = data(row, 2 * polyi) - 20 + rand * 40;
%         outlineY(1, polyi) = data(row, 2 * polyi + 1) - 20 + rand * 40;
        
        % Add magnification error.
        outlineX(1, polyi) = (data(row, 2 * polyi) - 127) * magDegree + 127;
        outlineY(1, polyi) = (data(row, 2 * polyi + 1) - 127) * magDegree + 127;
    end
    
    polygons{row} = {outlineX outlineY};
end