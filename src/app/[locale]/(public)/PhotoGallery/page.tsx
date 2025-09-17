'use client'

import ArrowUp from '@/assets/image/icons/align_arrow_up_line.svg'
import GalleryIcon from '@/assets/image/icons/animation/gallery.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import HomeIcon from '@/assets/image/icons/icon_home.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { PAGES } from '@/shared/config/page.config'
import { useGallery } from '@/shared/hooks/useGallery'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import LazyImage from './LazyImage/LazyImage'
import LoadMoreTrigger from './LoadMoreTrigger/LoadMoreTrigger'
import styles from './page.module.scss'

export default function PhotoGalleryPage() {
  const tCommon = useTranslations('common')
  const { items, loading, hasMore, error, loadMore, refresh } = useGallery({
    pageSize: 12,
  })

  if (error) {
    return (
      <section
        className={styles.galleryPage + ' main-wrapper'}
        aria-label='Photo gallery'
      >
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
                      <GalleryIcon
                        key={iconIdx}
                        className={styles.galleryIcon}
                      />
                    ))}
                  </div>
                ))}

                {[...Array(5)].map((_, rowIdx) => (
                  <div key={`set2-${rowIdx}`} className={styles.galleryIcons}>
                    {[...Array(6)].map((_, iconIdx) => (
                      <GalleryIcon
                        key={iconIdx}
                        className={styles.galleryIcon}
                      />
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

          <div className={styles.breadcrumbs}>
            <Link href={PAGES.HOME} className={styles.navLink}>
              {tCommon('navigation.HOME')}
            </Link>

            <ArrowRight />

            <span className={styles.currentPage}>
              {tCommon('navigation.PHOTO_GALLERY')}
            </span>
          </div>
        </div>

        <div className='list-container'>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>

            <button onClick={refresh} className={styles.retryButton}>
              Попробовать снова
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.galleryPage + ' main-wrapper'}>
      <div className={styles.header}>
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

        <div className={styles.breadcrumbs}>
          <Link href={PAGES.HOME} className={styles.navLink}>
            {tCommon('navigation.HOME')}
          </Link>

          <ArrowRight />

          <span className={styles.currentPage}>
            {tCommon('navigation.PHOTO_GALLERY')}
          </span>
        </div>
      </div>

      <div className='list-container'>
        {loading && items.length === 0 ? (
          <div className={styles.initialLoading}>
            <div className={styles.spinner}>
              <div className={styles.spinnerCircle} />
            </div>
            <p>Загрузка галереи...</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>В галерее пока нет изображений</p>
          </div>
        ) : (
          <>
            <ul className={styles.list} role='list'>
              {items.map((item) => (
                <li key={item.itemId} className={styles.listItem}>
                  <LazyImage item={item} className={styles.galleryImage} />

                  <div className={styles.imageInfo}>
                    <h3 className={styles.imageName}>{item.publicItemName}</h3>

                    {item.itemDescription && (
                      <p className={styles.imageDescription}>
                        {item.itemDescription}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <LoadMoreTrigger
              onLoadMore={loadMore}
              hasMore={hasMore}
              loading={loading}
            />
          </>
        )}
      </div>

      <div className={styles.hyperlinkContainer}>
        <Hyperlink href='#top'>
          <div className={styles.hyperlink}>
            <ArrowUp />
            <span>{tCommon('backToTop')}</span>
          </div>
        </Hyperlink>
      </div>
    </section>
  )
}
