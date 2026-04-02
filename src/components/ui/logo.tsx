import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-current', className)}
    >
      <path
        d="M50 95C50 95 15 65 15 35C15 15 50 5 50 5C50 5 85 15 85 35C85 65 50 95 50 95Z"
        stroke="url(#leaf-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 95V40"
        stroke="url(#leaf-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="40" r="10" fill="currentColor" />
      <circle cx="30" cy="30" r="5" fill="currentColor" />
      <circle cx="70" cy="30" r="5" fill="currentColor" />
      <path d="M43 40L30 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M57 40L70 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient
          id="leaf-gradient"
          x1="15"
          y1="5"
          x2="85"
          y2="95"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  )
}
