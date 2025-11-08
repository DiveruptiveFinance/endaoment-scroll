# University Logos

Place university logo images in this directory.

## Required Images

Based on the students in the database, you need the following university logos:

1. **USP (Universidade de São Paulo)** - `usp.jpg`
   - Used by: Maria Silva (ID: 1)

2. **UNAM (Universidad Nacional Autónoma de México)** - `unam.jpg`
   - Used by: Ana Rodríguez (ID: 3)

3. **UFRJ (Universidade Federal do Rio de Janeiro)** - `ufrj.png`
   - Used by: João Ferreira (ID: 2)

4. **Tecnológico de Monterrey** - `tec.png`
   - Used by: Carlos Mendoza (ID: 4)

5. **PUC-Rio (Pontifícia Universidade Católica do Rio de Janeiro)** - `puc-rio.png`
   - Used by: Lucia Santos (ID: 5)

6. **UBA (Universidad de Buenos Aires)** - `uba.png`
   - Used by: Diego Torres (ID: 6)

7. **Universidad de los Andes** - `uniandes.png`
   - Used by: Isabella Vargas (ID: 7)

8. **IPN (Instituto Politécnico Nacional)** - `ipn.png`
   - Used by: Miguel Ángel (ID: 8)

## Image Specifications

- **Format**: JPG or PNG
- **Recommended size**: 200x200px minimum
- **Aspect ratio**: Square (1:1) preferred
- **Background**: Transparent or white

## How to Add Images

1. Save the university logo image in this directory (`packages/nextjs/public/universities/`)
2. Name it according to the list above
3. The images will be automatically available at `/universities/[filename]`

## Notes

- Images are referenced in `packages/nextjs/data/students.ts`
- If an image is missing, a fallback will be shown
- Images should be optimized for web (compressed, appropriate size)

