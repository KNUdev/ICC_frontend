'use client'

import { useEffect, useState } from 'react'
import MultiDropDownInput from '@/common/components/Input/MultiDropDownInput/MultiDropDownInput'

const api = process.env.NEXT_PUBLIC_API_URL

interface Employee {
  id: string
  fullName: string
}

interface AssignToApplicationProps {
  selectedEmployeeIds: string[]
  onAssign: (selected: string[]) => void
  placeholder?: string
}

export function AssignToApplication({
  selectedEmployeeIds,
  onAssign,
  placeholder = 'Назначить сотрудников',
}: AssignToApplicationProps) {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const formData = new FormData()
        formData.append('pageNumber', '0')
        formData.append('pageSize', '10')

        const response = await fetch(`${api}admin/employee/all`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Error fetching employees: ${response.status} ${response.statusText}\nServer responded: ${errorText}`,
          )
        }
        const result = await response.json()
        console.log('Got employees:', result.content)

        const simplified: Employee[] = result.content.map(
          (emp: {
            id: string
            name: { firstName: string; lastName: string; middleName: string }
          }) => ({
            id: emp.id,
            fullName: `${emp.name.firstName} ${emp.name.middleName} ${emp.name.lastName}`,
          }),
        )

        setEmployees(simplified)
      } catch (err) {
        console.error('Error while loading employees:', err)
      }
    }

    fetchEmployees()
  }, [])

  const options = employees.map((emp) => ({
    value: emp.id,
    label: emp.fullName,
  }))

  return (
    <MultiDropDownInput
      options={options}
      initialSelected={selectedEmployeeIds}
      onSubmit={onAssign}
      placeholder={placeholder}
      optionalStyle={true}
    />
  )
}
