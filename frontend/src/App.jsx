import { useCallback, useEffect, useState } from 'react'
import AppShell from './components/AppShell.jsx'
import CreateTestPage from './pages/CreateTestPage.jsx'
import RunResultsPage from './pages/RunResultsPage.jsx'
import TestDetailsPage from './pages/TestDetailsPage.jsx'
import TestsPage from './pages/TestsPage.jsx'

function getRoute(pathname) {
  if (pathname === '/') return { page: 'tests' }
  if (pathname === '/tests/new') return { page: 'create' }

  const testMatch = pathname.match(/^\/tests\/(\d+)\/?$/)
  if (testMatch) return { page: 'test', id: testMatch[1] }

  const runMatch = pathname.match(/^\/runs\/(\d+)\/?$/)
  if (runMatch) return { page: 'run', id: runMatch[1] }

  return { page: 'not-found' }
}

export default function App() {
  const [route, setRoute] = useState(() => getRoute(window.location.pathname))

  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path)
    setRoute(getRoute(path))
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    function handlePopState() {
      setRoute(getRoute(window.location.pathname))
    }

    function handleClick(event) {
      const link = event.target.closest('a[data-link]')
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
        return
      }
      event.preventDefault()
      navigate(link.getAttribute('href'))
    }

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleClick)
    }
  }, [navigate])

  let content
  if (route.page === 'tests') content = <TestsPage />
  if (route.page === 'create') content = <CreateTestPage navigate={navigate} />
  if (route.page === 'test') content = <TestDetailsPage id={route.id} navigate={navigate} />
  if (route.page === 'run') content = <RunResultsPage id={route.id} />
  if (route.page === 'not-found') {
    content = (
      <div className="state-card empty-state">
        <strong>Page not found</strong>
        <p>The requested page does not exist.</p>
        <a className="button button-primary" href="/" data-link>Go to tests</a>
      </div>
    )
  }

  return <AppShell>{content}</AppShell>
}
