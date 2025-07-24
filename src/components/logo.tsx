import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lankford Lending Logo"
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
          Lending
        </text>
      </g>
    </svg>
  );
}
