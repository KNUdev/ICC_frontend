import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') || '0');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');

  const galleryDir = path.join(process.cwd(), 'public', 'upload', 'gallery');

  try {
    if (!fs.existsSync(galleryDir)) {
         return NextResponse.json({
            content: [],
            pageable: {
                pageNumber: 0,
                pageSize: pageSize,
                sort: { empty: true, sorted: false, unsorted: true },
                offset: 0,
                paged: true,
                unpaged: false
            },
            totalElements: 0,
            totalPages: 0,
            last: true,
            size: pageSize,
            number: 0,
            sort: { empty: true, sorted: false, unsorted: true },
            numberOfElements: 0,
            first: true,
            empty: true
        });
    }

    const files = fs.readdirSync(galleryDir).filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
    const totalElements = files.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    const startIndex = pageNumber * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalElements);
    const paginatedFiles = files.slice(startIndex, endIndex);

    const content = paginatedFiles.map((file, index) => ({
      creatorId: 'local-admin',
      itemId: `local-${startIndex + index}`,
      itemUrl: `/upload/gallery/${file}`,
      publicItemName: file.replace(/\.[^/.]+$/, ""),
      itemDescription: '',
      uploadedAt: [2024, 1, 1, 12, 0, 0],
      updatedAt: null
    }));

    return NextResponse.json({
      content,
      pageable: {
        pageNumber,
        pageSize,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: startIndex,
        paged: true,
        unpaged: false
      },
      totalElements,
      totalPages,
      last: pageNumber >= totalPages - 1 || totalPages === 0,
      size: pageSize,
      number: pageNumber,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: content.length,
      first: pageNumber === 0,
      empty: content.length === 0
    });

  } catch (error) {
    console.error('Error reading gallery directory:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}
