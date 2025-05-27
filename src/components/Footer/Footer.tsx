import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
// import { footerNavLink, instituteLink, facultyLink } from "./footerConfig";
import styles from "./Footer.module.scss";

export function Footer() {
  const locale = useLocale();
  const tFooter = useTranslations("footer");
  const navigationArr = (tFooter.raw("footer.navigationArr") as string[]) || [];
  const institutionsArr =
    (tFooter.raw("footer.institutionsArr") as string[]) || [];
  const facultiesArr = (tFooter.raw("footer.facultiesArr") as string[]) || [];

  return (
    <footer id={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.infoHeading}>
          {tFooter("footer.infoCenterHeading")}
        </h2>
        <Image
          src={"/image/icons/logo_knu.webp"}
          alt="knu logo"
          width={80}
          height={86}
        />
      </div>

      <hr className={styles.divider} />

      <nav className={styles.navLinks}>
        <div className={styles.navContainer}>
          <h3 className={styles.heading}>{tFooter("footer.navigation")}</h3>

          <ul className={styles.list}>
            {navigationArr.map((nav, index) => (
              <li key={index}>
                <Link
                  href={`/${nav.toLowerCase().replace(/\s+/g, "-")}`}
                  locale={locale}
                >
                  {nav}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.navContainer}>
          <h3 className={styles.heading}>{tFooter("footer.institutions")}</h3>

          <ul className={styles.list}>
            {institutionsArr.map((institute, index) => (
              <li key={index}>
                <Link
                  href={`/${institute.toLowerCase().replace(/\s+/g, "-")}`}
                  locale={locale}
                >
                  {institute}
                </Link>
              </li>
            ))}

            <li>
              <a className={styles.hyperlink}>{tFooter("footer.seeMore")}</a>
            </li>
          </ul>
        </div>

        <div className={styles.navContainer}>
          <h3 className={styles.heading}>{tFooter("footer.faculties")}</h3>

          <ul className={styles.list}>
            {facultiesArr.map((faculty, index) => (
              <li key={index}>
                <Link
                  href={`/${faculty.toLowerCase().replace(/\s+/g, "-")}`}
                  locale={locale}
                >
                  {faculty}
                </Link>
              </li>
            ))}

            <li>
              <a className={styles.hyperlink}>{tFooter("footer.seeMore")}</a>
            </li>
          </ul>
        </div>
      </nav>

      <hr className={styles.divider} />

      <div className={styles.container}>
        <div className={styles.mailContainer}>
          <Image
            src={"/image/icons/social/mail.svg"}
            alt="mail"
            width={24}
            height={20}
          />
          <p>example@gmail.com</p>
        </div>

        <div className={styles.socialMediaContainer}>
          <Image
            src={"/image/icons/social/instagram.svg"}
            alt="instagram"
            width={30}
            height={18}
          />
          <Image
            src={"/image/icons/social/facebook.svg"}
            alt="facebook"
            width={30}
            height={30}
          />
          <Image
            src={"/image/icons/social/linkedin.svg"}
            alt="linkedin"
            width={30}
            height={30}
          />
        </div>

        <div className={styles.telephoneContainer}>
          <Image
            src={"/image/icons/social/telephone.svg"}
            alt="telephone"
            width={24}
            height={20}
          />
          <p>+380(786)376-38-52</p>
        </div>
      </div>
    </footer>
  );
}
