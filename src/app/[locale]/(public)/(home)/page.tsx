import FAQ from '@/app/[locale]/(public)/(home)/components/FAQ/FAQ'
import { Form } from '@/app/[locale]/(public)/(home)/components/Form/Form'
import { FormLines } from '@/app/[locale]/(public)/(home)/components/Form/FormApplication/FormLines/FormLines'

export default function HomePage() {
  return (
    <div>
      <Form />
      <FAQ />
      <FormLines />
    </div>
  )
}
