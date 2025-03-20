export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><FooterLink href="#features">Features</FooterLink></li>
              <li><FooterLink href="#pricing">Pricing</FooterLink></li>
              <li><FooterLink href="#demo">Demo</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><FooterLink href="#about">About</FooterLink></li>
              <li><FooterLink href="#blog">Blog</FooterLink></li>
              <li><FooterLink href="#careers">Careers</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><FooterLink href="#docs">Documentation</FooterLink></li>
              <li><FooterLink href="#help">Help Center</FooterLink></li>
              <li><FooterLink href="#guides">Guides</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <FooterLink 
                  href="https://x.com/withbreeeve" 
                  target="_blank"
                  className="flex items-center gap-2 hover:text-purple-light"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>@withbreeeve</span>
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Breeeve. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="https://x.com/withbreeeve" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-light transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children, className = "", target = "" }: { 
  href: string
  children: React.ReactNode
  className?: string
  target?: string
}) {
  return (
    <a 
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : ""}
      className={`text-gray-400 hover:text-purple-light transition-colors duration-200 text-sm ${className}`}
    >
      {children}
    </a>
  )
} 