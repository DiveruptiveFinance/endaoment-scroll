# Student Avatars

Place student profile images in this directory.

## Required Images

Based on the students in the database, you need the following student avatars:

1. **Maria Silva** - `maria.jpg`
2. **João Ferreira** - `joao.jpg`
3. **Ana Rodríguez** - `ana.jpg`
4. **Carlos Mendoza** - `carlos.jpg`
5. **Lucia Santos** - `lucia.jpg`
6. **Diego Torres** - `diego.jpg`
7. **Isabella Vargas** - `isabella.jpg`
8. **Miguel Ángel** - `miguel.jpg`

## Image Specifications

- **Format**: JPG or PNG
- **Recommended size**: 400x400px minimum
- **Aspect ratio**: Square (1:1) preferred
- **Background**: Any (will be cropped to circle)

## How to Add Images

1. Save the student profile image in this directory (`packages/nextjs/public/avatars/`)
2. Name it according to the list above
3. The images will be automatically available at `/avatars/[filename]`

## Notes

- Images are referenced in `packages/nextjs/data/students.ts`
- If an image is missing, a fallback with the student's initial will be shown
- Images should be optimized for web (compressed, appropriate size)
- Images will be displayed as circular avatars in the UI
