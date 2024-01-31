import { Link } from '@tanstack/react-router'

export function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/settings"> Blog Post </Link>
    </div>
  )
}
