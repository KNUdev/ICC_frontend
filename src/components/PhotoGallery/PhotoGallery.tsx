import HomeIcon from '@/assets/image/icons/icon_home.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import ArrowUp from '@/assets/image/icons/align_arrow_up_line.svg'
import GalleryIcon from '@/assets/image/icons/animation/gallery.svg'
import { photos } from '@/shared/data/photos.data'
import { useTranslations } from "next-intl"
import { PAGES } from '@/config/page.config'
import Link from 'next/link'
import styles from './PhotoGallery.module.scss'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'

export function PhotoGallery() {
    const tCommon = useTranslations('common')
    const tAlt = useTranslations('photosAlt/alt')
    
    return (
        <section aria-label="Photo gallery" className="gallery">
            <div className={styles.mainContainer}>
                <div className='header-container'>
                    <div className='hyperlink-container'>
                        <Hyperlink href={PAGES.HOME}>
                            <div className={styles.hyperlink}>
                                <HomeIcon />
                                <span>{tCommon('backToHome')}</span>
                            </div>
                        </Hyperlink>
                    </div>
                    <div className={styles.galleryHeader}>
                        <div className={styles.galleryHeaderContainer}>
                            <div className={styles.galleryIconsWrapper}>
                                {[...Array(5)].map((_, rowIdx) => (
                                    <div key={rowIdx} className={styles.galleryIcons}>
                                      {[...Array(6)].map((_, iconIdx) => (
                                        <GalleryIcon key={iconIdx} className={styles.galleryIcon} />
                                      ))}
                                    </div>
                                ))}
                                {[...Array(5)].map((_, rowIdx) => (
                                   <div key={`set2-${rowIdx}`} className={styles.galleryIcons}>
                                    {[...Array(6)].map((_, iconIdx) => (
                                       <GalleryIcon key={iconIdx} className={styles.galleryIcon} />
                                    ))}
                                   </div>
                                ))}
                            </div>
                        <div className={`${styles.gradientShadow} ${styles.shadow_1}`} />
                        <div className={`${styles.gradientShadow} ${styles.shadow_2}`} />
                            <h1 className={styles.title}>
                                {tCommon('navigation.PHOTO_GALLERY')}
                            </h1>
                        </div>
                    </div>
                    <div className={styles.navButtons}>
                        <Link href={PAGES.HOME} className={styles.navLink}>{tCommon('navigation.HOME')}</Link>
                        <ArrowRight />
                        <span>{tCommon('navigation.PHOTO_GALLERY')}</span>
                    </div>
                </div>
                <div className='list-container'>
                    <ul className={styles.list} role="list">
                                
                        {photos.map((photo, i) => (
                            <li key={i} className={styles.listItem}>
                              <div
                                className={styles.bgImage}
                                style={{
                                  backgroundImage: `url(${photo.src})`,
                                }}
                                role="img"
                                aria-label={tAlt(`photo-gallery.${photo.altKey}`) || 'Зображення'}
                              />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.hyperlinkContainer}>
                    <Hyperlink href='#top'>
                        <div className={styles.hyperlink}>
                            <ArrowUp /> 
                            <span>{tCommon('backToTop')}</span>
                        </div>
                    </Hyperlink>
                </div>
            </div>
        </section>
    )
}