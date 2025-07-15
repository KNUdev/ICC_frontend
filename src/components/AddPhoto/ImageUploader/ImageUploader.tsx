"use client"

import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import styles from './ImageUploader.module.scss'
import { useTranslations } from 'next-intl'
import IconFile from '@/assets/image/icons/add-photo/icon-static.svg'

export default function ImageUploadForm() {
    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const tImageUploader = useTranslations('add-photo/imageUploader')
  
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setImage(file);
          setImageURL(URL.createObjectURL(file));
        }
    }
  
    const handleRemove = () => {
      setImage(null)
      setImageURL('')
    }

    return (
        <div className={styles.container}>
            <label className={styles.uploadBox}>
            {!imageURL ? (
              <>
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                />
                <IconFile />
                <div onClick={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()}>
                  <p>{tImageUploader('uploadText')}</p>
                </div>
              </>
            ) : (
                <div className={styles.uploadedPhoto}>
                    <IconFile style={{ color: '#ff525e', 
                        marginBottom: '1rem',
                        width: '50px',
                        height: '50px', }} />
                    <div className={styles.uploadedControl}>
                        <a href={imageURL} target="_blank" rel="noopener noreferrer">
                      {tImageUploader('imageViewing')}
                        </a>
                        <div className={styles.divider}></div>
                        <p>{tImageUploader('imageUploaded')}</p>
                        <div className={styles.divider}></div>
                        <button onClick={handleRemove} className={styles.buttonDelete}>
                          {tImageUploader('imageDeletion')}
                        </button>
                    </div>
              </div>
            )}
            </label>
            <div className={styles.nameFieldWrapper}>
                <label className={styles.labelName}>{tImageUploader('name')} <span>*</span></label>
                <input
                type="text"
                placeholder={tImageUploader('imageName')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputName}
                />
            </div>
                <button className={styles.submitBtn}>{tImageUploader('addButton')}</button>
        </div>
      )
}