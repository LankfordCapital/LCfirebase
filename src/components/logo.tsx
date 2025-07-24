import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lankford Capital Group Logo"
    >
      <g className="font-headline">
        <text
          x="0"
          y="28"
          fontSize="30"
          fontWeight="bold"
          className="fill-primary"
        >
          Lankford
        </text>
        <text
          x="105"
          y="28"
          fontSize="30"
          className="fill-accent"
        >
          Capital
        </text>
         <text
          x="195"
          y="28"
          fontSize="30"
          fontWeight="bold"
          className="fill-primary"
        >
          Group
        </text>
      </g>
    </svg>
  );
}
