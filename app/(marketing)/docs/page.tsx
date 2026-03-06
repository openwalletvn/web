import { redirect } from 'next/navigation';
import { ScalarRef } from './_scalar-ref';

export default function DocsPage() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return <ScalarRef />;
}
