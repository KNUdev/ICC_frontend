import Image from "next/image";
import styles from "./Footer.module.scss";

const navigation = [
  "Головна",
  "Запит на послугу",
  "Історія",
  "Фотогалерея",
  "Штат",
  "ЦОМ",
  "Документи",
  "Часті запитання",
];

const institutions = [
  "Навчально-науковий інститут “Інститут геології”",
  "Військовий інститут",
  "Інститут Управління державної охорони України",
  "Інститут післядипломної освіти",
  "Навчально-науковий інститут",
];

const faculties = [
  "Географічний факультет",
  "Економічний факультет",
  "Історичний факультет",
  "Механіко-математичний факультет",
  "Фікультет інформаційних технологій",
];

export function Footer() {
  return (
    <footer className={styles.Footer}>
      <div className={styles.Container}>
        <h2 className={styles.InfoHeading}>
          Інформаційно-обчислювальний центр
        </h2>
        <Image
          src={"/FooterIcons/knu-logo.png"}
          alt="knu logo"
          width={80}
          height={86}
        />
      </div>

      <hr className={styles.Divider} />

      <div className={styles.NavLinks}>
        <div className={styles.NavContainer}>
          <h3 className={styles.Heading}>Навігація</h3>

          <ul className={styles.List}>
            {navigation.map((nav, index) => (
              <li key={index}>{nav}</li>
            ))}
          </ul>
        </div>

        <div className={styles.NavContainer}>
          <h3 className={styles.Heading}>Інститути</h3>

          <ul className={styles.List}>
            {institutions.map((institute, index) => (
              <li key={index}>{institute}</li>
            ))}

            <li>
              <a className={styles.Hyperlink}>Дивитись більше</a>
            </li>
          </ul>
        </div>

        <div className={styles.NavContainer}>
          <h3 className={styles.Heading}>Факультети</h3>

          <ul className={styles.List}>
            {faculties.map((faculty, index) => (
              <li key={index}>{faculty}</li>
            ))}

            <li>
              <a className={styles.Hyperlink}>Дивитись більше</a>
            </li>
          </ul>
        </div>
      </div>

      <hr className={styles.Divider} />

      <div className={styles.Container}>
        <div className={styles.MailContainer}>
          <Image
            src={"/FooterIcons/social/mail.png"}
            alt="mail"
            width={24}
            height={24}
          />
          <p>example@gmail.com</p>
        </div>

        <div className={styles.SocialMediaContainer}>
          <Image
            src={"/FooterIcons/social/instagram.png"}
            alt="instagram"
            width={30}
            height={30}
          />
          <Image
            src={"/FooterIcons/social/facebook.png"}
            alt="facebook"
            width={30}
            height={30}
          />
          <Image
            src={"/FooterIcons/social/linkedin.png"}
            alt="linkedin"
            width={30}
            height={30}
          />
        </div>

        <div className={styles.TelephoneContainer}>
          <Image
            src={"/FooterIcons/social/telephone.png"}
            alt="telephone"
            width={24}
            height={24}
          />
          <p>+380(786)376-38-52</p>
        </div>
      </div>
    </footer>
  );
}
