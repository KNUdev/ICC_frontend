import { AnimatedBrain } from '@/common/animations/AnimatedBrain/AnimatedBrain'
import { AnimatedHistory } from '@/common/animations/AnimatedHistory/AnimatedHistory'
import FAQ from '@/app/[locale]/(public)/(home)/components/FAQ/FAQ'
import { Form } from '@/components/Form/Form'

export default function HomePage() {
  return (
    <>
      <AnimatedBrain />
      <AnimatedHistory />
      <Form />
      <FAQ />
    </>
  )
}
