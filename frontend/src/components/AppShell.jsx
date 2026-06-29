export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" data-link>
          <span className="brand-mark">R</span>
          Revisor
        </a>
        <span className="topbar-label">URL Availability Checker</span>
      </header>
      <main className="container">{children}</main>
      <footer className="footer">Revisor <span aria-hidden="true">•</span> MVP</footer>
    </div>
  )
}
