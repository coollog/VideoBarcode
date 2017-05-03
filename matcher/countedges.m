% Counts the number of edges for polygons loaded from loadpolygons.

function nEdges = countedges(polygons)

nPolygons = size(polygons, 1);

nEdges = -1;

for i = 1:nPolygons
    nPoints = size(polygons{i, 1}{1, 1}, 2);
    nEdges = nEdges + nPoints;
end