import { useTranslations } from "next-intl";
import styles from "./FormPoints.module.scss";

export function FormPoints() {
  const tFormPoints = useTranslations("form/points");

  const steps = [
    "request",
    "trial",
    "discussion",
    "execution",
    "completed",
  ] as const;

  return (
    <article className={styles.formPoints}>
      {steps.map((key, index) => (
        <details key={key} className={styles.details}>
          <summary className={styles.summary}>
            {index + 1}. {tFormPoints(`pointHeaders.${key}`)}
            <div className={styles.timer} />
          </summary>

          <hr className={styles.divider} />

          <p className={styles.paragraph}>{tFormPoints(`pointTexts.${key}`)}</p>
        </details>
      ))}
    </article>
  );
}
