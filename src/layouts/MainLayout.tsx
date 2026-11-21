import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import Preloader from '@/components/Preloader'
import CompareBar from '@/components/CompareBar'
import PageSkeleton from '@/components/Skeleton'

export default function MainLayout() {
  const { pathname } = useLocation()
  const outlet = useOutlet()

  return (
    <>
      <Preloader />
      <Navbar />
      <main id="main" className="min-h-screen">
        {/* Animated page transitions (keyed by path so query-string filtering does not re-animate). */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<PageSkeleton />}>{outlet}</Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CompareBar />
      <ScrollToTop />
    </>
  )
}
