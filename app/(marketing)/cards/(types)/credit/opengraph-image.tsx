import { createTypeOgImage } from '../_helpers';
import { OG_SIZE } from '@/lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createTypeOgImage('type_credit');
}
