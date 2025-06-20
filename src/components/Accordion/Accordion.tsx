'use client';

import { useState } from 'react';
import styles from './Accordion.module.scss';

type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
};



export default function Accordion({ items }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={item.id}
            className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}
          >
            <button
              className={`${styles.accordionButton} ${
                isOpen ? styles.active : styles.collapsed
              }`}
              onClick={() => toggle(index)}
            >
              <span className={styles.title}>{item.title}</span>
              <span className={styles.icon}>
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M8.16671 15.1666H19.8334V12.8333H8.16671V15.1666ZM14 25.6666C12.3862 25.6666 10.8695 25.3604 9.45004 24.7479C8.0306 24.1354 6.79587 23.3041 5.74587 22.2541C4.69587 21.2041 3.86462 19.9694 3.25212 18.55C2.63962 17.1305 2.33337 15.6139 2.33337 14C2.33337 12.3861 2.63962 10.8694 3.25212 9.44998C3.86462 8.03053 4.69587 6.79581 5.74587 5.74581C6.79587 4.69581 8.0306 3.86456 9.45004 3.25206C10.8695 2.63956 12.3862 2.33331 14 2.33331C15.6139 2.33331 17.1306 2.63956 18.55 3.25206C19.9695 3.86456 21.2042 4.69581 22.2542 5.74581C23.3042 6.79581 24.1355 8.03053 24.748 9.44998C25.3605 10.8694 25.6667 12.3861 25.6667 14C25.6667 15.6139 25.3605 17.1305 24.748 18.55C24.1355 19.9694 23.3042 21.2041 22.2542 22.2541C21.2042 23.3041 19.9695 24.1354 18.55 24.7479C17.1306 25.3604 15.6139 25.6666 14 25.6666Z"
                      fill="#272727"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M12.8334 19.8333H15.1667V15.1666H19.8334V12.8333H15.1667V8.16665H12.8334V12.8333H8.16671V15.1666H12.8334V19.8333ZM14 25.6666C12.3862 25.6666 10.8695 25.3604 9.45004 24.7479C8.0306 24.1354 6.79587 23.3041 5.74587 22.2541C4.69587 21.2041 3.86462 19.9694 3.25212 18.55C2.63962 17.1305 2.33337 15.6139 2.33337 14C2.33337 12.3861 2.63962 10.8694 3.25212 9.44998C3.86462 8.03053 4.69587 6.79581 5.74587 5.74581C6.79587 4.69581 8.0306 3.86456 9.45004 3.25206C10.8695 2.63956 12.3862 2.33331 14 2.33331C15.6139 2.33331 17.1306 2.63956 18.55 3.25206C19.9695 3.86456 21.2042 4.69581 22.2542 5.74581C23.3042 6.79581 24.1355 8.03053 24.748 9.44998C25.3605 10.8694 25.6667 12.3861 25.6667 14C25.6667 15.6139 25.3605 17.1305 24.748 18.55C24.1355 19.9694 23.3042 21.2041 22.2542 22.2541C21.2042 23.3041 19.9695 24.1354 18.55 24.7479C17.1306 25.3604 15.6139 25.6666 14 25.6666Z"
                      fill="#6D6D6D"
                    />
                  </svg>
                )}
              </span>
            </button>
            {isOpen && (
              <div className={styles.accordionBody}>{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
