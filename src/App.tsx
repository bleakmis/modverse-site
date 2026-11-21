import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'

// Code splitting: every non-home page loads on demand.
const Catalog = lazy(() => import('@/pages/Catalog'))
const ModDetail = lazy(() => import('@/pages/ModDetail'))
const Search = lazy(() => import('@/pages/Search'))
const Top100 = lazy(() => import('@/pages/Top100'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const Compare = lazy(() => import('@/pages/Compare'))
const About = lazy(() => import('@/pages/About'))
const Faq = lazy(() => import('@/pages/Faq'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="mods" element={<Catalog />} />
          <Route path="mods/:slug" element={<ModDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="top" element={<Top100 />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="compare" element={<Compare />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<Faq />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
