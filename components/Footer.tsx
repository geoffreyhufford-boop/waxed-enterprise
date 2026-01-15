export default function Footer() {
  return (
    <footer className="py-8 border-t border-waxed-border">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-waxed-text-muted">
            © {new Date().getFullYear()} Waxed Enterprise. All rights reserved.
          </p>
          <a
            href="mailto:hello@waxed.io"
            className="text-sm text-waxed-text-muted hover:text-waxed-text transition-colors"
          >
            hello@waxed.io
          </a>
        </div>
      </div>
    </footer>
  )
}
