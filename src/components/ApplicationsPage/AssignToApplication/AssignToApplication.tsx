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
        const response = await fetch(`${api}admin/employee/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageNumber: 0, pageSize: 10 }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Error fetching employees: ${response.status} ${response.statusText}\nServer responded: ${errorText}`,
          )
        }
        const result = await response.json()
        console.log('Got employees:', result.content)

        setEmployees(result.content)
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
    />
  )
}
