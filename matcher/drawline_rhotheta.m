% Draws a line with Hesse normal form rho, theta.

function drawline_rhotheta(rho, theta)

x = rho * cos(theta);
y = rho * sin(theta);

perpTheta = theta + pi / 2;

x1 = x + 300 * cos(perpTheta);
y1 = y + 300 * sin(perpTheta);
x2 = x + 300 * cos(perpTheta + pi);
y2 = y + 300 * sin(perpTheta + pi);

plot([x1, x2], [y1, y2], 'LineWidth', 2, 'Color', 'green');

end