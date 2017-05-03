clc
close all;
clear all;
s=imread('bgmask.png');
figure , imshow(s)
g=im2bw(s);
b=strel('disk', 100, 0).getnhood();
[p q]=size(b);
  figure, imshow(g)
  [m n]=size(g);
  temp= zeros(m,n);
   for i=1:m
       for j=1:n
           if (g(i,j)==1)
        
             for k=1:p
       for l=1:q
          if(b(k,l)==1)
           c=i+k;
           d=j+l;
           temp(c,d)=1;
          
          end
       end
             end
           end
           
       end
   end
   figure, imshow(temp)