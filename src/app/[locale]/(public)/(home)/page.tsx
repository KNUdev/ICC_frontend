import { AnimatedBrain } from '@/common/animations/AnimatedBrain/AnimatedBrain'
import { AnimatedHistory } from '@/common/animations/AnimatedHistory/AnimatedHistory'
import { Form } from '@/components/Form/Form'

export default function HomePage() {
  return (
    <>
      <AnimatedBrain />
    <AnimatedHistory />
      <Form />
    </>
  )
}
