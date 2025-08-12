import CloseIcon from '@/assets/image/icons/form/close.svg'
import { useTranslations } from 'next-intl'
import styles from './AssignedEmployees.module.scss'

interface Employee {
  id: string
  fullName: string
}

interface Application {
  id: string
  assignedEmployeeIds: string[]
}

interface Props {
  app: Application
  allEmployees: Employee[]
  onRemoveEmployee: (applicationId: string, employeeId: string) => void
}

export function AssignedEmployees({
  app,
  allEmployees,
  onRemoveEmployee,
}: Props) {
  const tApplications = useTranslations('admin/applications')

  const assignedEmployees = app.assignedEmployeeIds
    .map((id) => allEmployees.find((e) => e.id === id))
    .filter(Boolean) as Employee[]

  return (
    <div className={styles.assignedEmployeesContainer}>
      {assignedEmployees.length === 0 ? (
        <p className={styles.noEmployeesText}>
          {tApplications('assignedEmployees.noEmployees')}
        </p>
      ) : (
        assignedEmployees.map((employee) => (
          <div key={employee.id} className={styles.assignedEmployeeTag}>
            <span className={styles.employeeName}>{employee.fullName}</span>
            <button
              type='button'
              className='clearBtn'
              onClick={() => onRemoveEmployee(app.id, employee.id)}
              aria-label='Remove employee'
            >
              <span aria-hidden='true'>
                <CloseIcon />
              </span>
            </button>
          </div>
        ))
      )}
    </div>
  )
}
