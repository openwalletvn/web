import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="bg-brand-dark border-t border-slate-800">
      <div className="max-w-container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-slate-400">
        <span className="text-slate-300">{t('copyright', { year: new Date().getFullYear() })}</span>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-white transition-colors">{t('home')}</Link>
          <Link href="/ngan-hang" className="hover:text-white transition-colors">{t('banks')}</Link>
          <Link href="/the" className="hover:text-white transition-colors">{t('cards')}</Link>
          <Link href="/tin-tuc" className="hover:text-white transition-colors">{t('blog')}</Link>
          <Link href="/so-sanh" className="hover:text-white transition-colors">{t('compare')}</Link>
          <Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link>
          <a
            href="https://github.com/openwalletvn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {t('github')}
          </a>
        </nav>
      </div>
    </footer>
  );
}
