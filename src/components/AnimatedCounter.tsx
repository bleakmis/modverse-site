import { useCountUp } from '@/hooks/useCountUp'

export default function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const { ref, value } = useCountUp(to)
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
