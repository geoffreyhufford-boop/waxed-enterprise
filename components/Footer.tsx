export default function Footer() {
  return (
    <footer className="py-8 border-t border-waxe-border">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-waxe-warm">WAXE</span>
            <p className="text-sm text-waxe-text-muted">
              © {new Date().getFullYear()} WAXE. All rights reserved.
            </p>
          </div>
          <a
            href="mailto:hello@waxe.io"
            className="text-sm text-waxe-text-muted hover:text-waxe-text transition-colors"
          >
            hello@waxe.io
          </a>
        </div>
      </div>
    </footer>
  )
}
