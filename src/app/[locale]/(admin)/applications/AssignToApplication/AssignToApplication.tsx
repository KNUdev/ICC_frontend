'use client'

import MultiDropDownInput from '@/common/components/Input/MultiDropDownInput/MultiDropDownInput'
import { getAdminEmployees } from '@/shared/api/employees'
import { useEffect, useState } from 'react'

interface Employee {
  id: string
  fullName: string
}

interface AssignToApplicationProps {
  onAssign: (selected: { id: string; fullName: string }[]) => void
  placeholder?: string
}

export function AssignToApplication({
  onAssign,
  placeholder = 'Назначить сотрудников',
}: AssignToApplicationProps) {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await getAdminEmployees({
          pageNumber: 0,
          pageSize: 10,
        })
        setEmployees(employees)
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
      initialSelected={[]}
      onSubmit={(selectedIds) => {
        const selectedEmployees = employees.filter((emp) =>
          selectedIds.includes(emp.id),
        )
        onAssign(selectedEmployees)
      }}
      placeholder={placeholder}
      optionalStyle={true}
    />
  )
}
