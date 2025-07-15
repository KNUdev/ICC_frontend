import styles from './AddPhoto.module.scss'
import { useTranslations } from 'next-intl'
import ImageUploadForm from "./ImageUploader/ImageUploader"

export function AddPhoto() {
    const tAddPhotoText = useTranslations('add-photo/text')

    return (
        <div className={styles.mainContainer}>
            <div className={styles.textContainer}>
                <h1 className={styles.heading}>{tAddPhotoText('heading')}</h1>
                <p className={styles.paragraph}>{tAddPhotoText('subheading')}</p>
            </div>
            <div className={styles.formContainer}>
                <ImageUploadForm />
            </div>
        </div>
    )
}