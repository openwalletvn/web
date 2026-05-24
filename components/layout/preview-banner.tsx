const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

export function PreviewBanner() {
  if (!isPreview) return null;
  return (
    <div className="ow-preview-banner" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#f59e0b',
      color: '#000',
      textAlign: 'center',
      fontSize: '0.75rem',
      fontWeight: 600,
      padding: '4px 8px',
      letterSpacing: '0.05em',
    }}>
      PREVIEW — {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ?? 'branch unknown'}
    </div>
  );
}
