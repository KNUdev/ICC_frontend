'use client'

import { useState } from 'react'
import styles from './Accordion.module.scss'
import PlusIcon from 'src/assets/image/icons/faq/plus.svg'
import MinusIcon from 'src/assets/image/icons/faq/minus.svg'

type AccordionItem = {
  id: string
  title: string
  content: React.ReactNode
}

type AccordionProps = {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index
        return (
          <div
            key={item.id}
            className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}
          >
            <button
              className={`
                ${styles.accordionButton} 
                ${isOpen ? styles.active : styles.collapsed}
              `}
              onClick={() => toggle(index)}
            >
              <span className={styles.title}>{item.title}</span>
              <span className={styles.icon}>
                {isOpen ? (
                  <MinusIcon fill="#272727" />
                ) : (
                  <PlusIcon fill="#6D6D6D" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className={styles.accordionBody}>{item.content}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
