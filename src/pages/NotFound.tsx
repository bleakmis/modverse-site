import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="relative isolate container-x grid min-h-[80vh] place-items-center pt-24 text-center">
      <div className="aurora absolute inset-0 -z-10 opacity-70" aria-hidden />
      <div>
        <p className="text-gradient font-display text-8xl font-black sm:text-9xl">404</p>
        <h1 className="mt-4 font-display text-xl font-bold uppercase tracking-widest">Lost in the void</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for drifted off into another dimension.</p>
        <Link to="/" className="btn-primary mt-8">
          Return to MODVERSE
        </Link>
      </div>
    </section>
  )
}
