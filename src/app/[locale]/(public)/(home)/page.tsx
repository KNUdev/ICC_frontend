import FAQ from '@/app/[locale]/(public)/(home)/components/FAQ/FAQ'
import { Form } from '@/app/[locale]/(public)/(home)/components/Form/Form'
import { FormLines } from '@/app/[locale]/(public)/(home)/components/Form/FormApplication/FormLines/FormLines'
import { AnimatedBrain } from '@/common/animations/AnimatedBrain/AnimatedBrain'
import { AnimatedHistory } from '@/common/animations/AnimatedHistory/AnimatedHistory'

export default function HomePage() {
  return (
    <>
      <AnimatedBrain />
      <AnimatedHistory />
      <Form />
      <FAQ />
      <FormLines />
    </>
  )
}
