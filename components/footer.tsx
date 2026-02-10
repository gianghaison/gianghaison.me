import { NewsletterForm } from "./newsletter-form"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Newsletter */}
        <div className="mb-8">
          <h3 className="font-mono text-sm font-medium mb-4">Subscribe to newsletter</h3>
          <NewsletterForm />
        </div>

        {/* Copyright */}
        <p className="font-mono text-xs text-muted-foreground">
          {"© 2026 Giang Hải Sơn — A designer lost in the land of code"}
        </p>
      </div>
    </footer>
  )
}
