import logoKnu from "@/assets/image/icons/logo_knu.png";
import FacebookIcon from "@/assets/image/icons/social/facebook.svg";
import InstagramIcon from "@/assets/image/icons/social/instagram.svg";
import LinkedInIcon from "@/assets/image/icons/social/linkedin.svg";
import Mail from "@/assets/image/icons/social/mail.svg";
import Telephone from "@/assets/image/icons/social/telephone.svg";
import {
  contactInfo,
  facultyLinks,
  footerNavigation,
  institutionLinks,
} from "@/lib/footerData";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import "../../app/[locale]/globals.scss";
import styles from "./Footer.module.scss";

export function Footer() {
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer id={styles.footer} role="contentinfo">
      <header className={styles.container}>
        <h2 className={styles.infoHeading}>{tCommon("titleFullName")}</h2>
        <Image
          src={logoKnu}
          alt={`${tCommon("titleFullName")} logo`}
          width={80}
          height={86}
          priority
        />
      </header>

      <hr className={styles.divider} role="separator" />

      <nav
        className={styles.navLinks}
        role="navigation"
        aria-label="Footer navigation"
      >
        <section className={styles.navContainer}>
          <h3 className={styles.heading}>{tCommon("navigationHeading")}</h3>

          <ul className={styles.list} role="list">
            {footerNavigation.map(({ key, link }) => (
              <li key={key} role="listitem">
                <Link href={link} className="navLink">
                  {tFooter(`navigation.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.navContainer}>
          <h3 className={styles.heading}>{tCommon("institutionsHeading")}</h3>

          <ul className={styles.list} role="list">
            {institutionLinks.slice(0, 5).map(({ key, link }) => (
              <li key={key} role="listitem">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${tCommon(
                    `institutions.${key}`
                  )} (opens in a new tab)`}
                  className="navLink"
                >
                  {tCommon(`institutions.${key}`)}
                </a>
              </li>
            ))}

            <li role="listitem">
              <Link href={"/institutions"} className="hyperlink">
                {tCommon("seeMore")}
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.navContainer}>
          <h3 className={styles.heading}>{tCommon("facultiesHeading")}</h3>

          <ul className={styles.list} role="list">
            {facultyLinks.slice(0, 5).map(({ key, link }) => (
              <li key={key} role="listitem">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${tCommon(
                    `faculties.${key}`
                  )} (opens in a new tab)`}
                  className="navLink"
                >
                  {tCommon(`faculties.${key}`)}
                </a>
              </li>
            ))}

            <li role="listitem">
              <Link href={"/faculties"} className="hyperlink">
                {tCommon("seeMore")}
              </Link>
            </li>
          </ul>
        </section>
      </nav>

      <hr className={styles.divider} role="separator" />

      <address className={styles.container}>
        <div className={styles.mailContainer}>
          <Mail alt="mailIcon" className={styles.contactImage} />
          <a
            href={`mailto:${contactInfo.email}`}
            aria-label={tFooter("aria.sendEmail")}
            className="supportLink"
          >
            {contactInfo.email}
          </a>
        </div>

        <div
          className={styles.socialMediaContainer}
          role="group"
          aria-label={tFooter("aria.socialMedia")}
        >
          <a
            href={contactInfo.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tFooter("aria.instagram")}
            className="imgLink"
          >
            <InstagramIcon alt="instagramIcon" />
          </a>
          <a
            href={contactInfo.socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tFooter("aria.facebook")}
            className="imgLink"
          >
            <FacebookIcon alt="facebookIcon" />
          </a>
          <a
            href={contactInfo.socialMedia.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tFooter("aria.linkedin")}
            className="imgLink"
          >
            <LinkedInIcon alt="linkedinIcon" />
          </a>
        </div>

        <div className={styles.telephoneContainer}>
          <Telephone alt="telephoneIcon" className={styles.contactImage} />
          <a
            href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
            aria-label={tFooter("aria.callPhone")}
            className="supportLink"
          >
            {contactInfo.phone}
          </a>
        </div>
      </address>
    </footer>
  );
}
