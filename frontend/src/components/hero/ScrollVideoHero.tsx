import { useRef, useState } from 'react'
import { useSite } from '../SiteProvider'
import { LogoMark } from '../Brand'
import { ButtonLink } from '../ui/Button'
import { ArrowLeftIcon } from '../../icons'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { useScrollVideoScrub } from './useScrollVideoScrub'

/**
 * Pick the smallest encode that still looks right for the screen. Phones get the
 * 854px all-intra version (same frame-accurate seeking, far less decode work).
 * Chosen once on mount so a resize never swaps a partially buffered source.
 */
function pickHeroVideo() {
  if (typeof window === 'undefined') return '/videos/hero-desktop.mp4'
  const narrow =
    window.matchMedia('(max-width: 767px)').matches || window.innerWidth < 768
  return narrow ? '/videos/hero-mobile.mp4' : '/videos/hero-desktop.mp4'
}

export function ScrollVideoHero() {
  const { settings } = useSite()
  const reducedMotion = useReducedMotion()
  const [videoSrc] = useState(pickHeroVideo)

  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const hintRef = useRef<HTMLDivElement | null>(null)

  const status = useScrollVideoScrub({
    sectionRef,
    videoRef,
    contentRef,
    hintRef,
    enabled: !reducedMotion,
  })

  // Reduced motion or a broken/unsupported file falls back to the existing
  // static hero image with no pinning and no scrub area.
  const staticHero = reducedMotion || status === 'failed'
  const loading = status === 'loading' && !staticHero
  const fallbackImage = settings.heroImage || '/images/hero.jpg'

  return (
    <section
      ref={sectionRef}
      aria-label='معرفی'
      data-hero-scrub={staticHero ? 'static' : 'scroll'}
      className={
        staticHero ? 'relative bg-navy-950' : 'relative h-[340svh] bg-navy-950'
      }
    >
      <div
        className={
          staticHero
            ? 'relative flex min-h-[88vh] items-end overflow-hidden bg-navy-950 lg:min-h-[92vh]'
            : 'sticky top-0 flex h-[100svh] items-end overflow-hidden bg-navy-950'
        }
      >
        {/* Existing hero image doubles as the poster and as the failure fallback. */}
        <img
          src={fallbackImage}
          alt=''
          aria-hidden='true'
          fetchPriority='high'
          loading='eager'
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover'
        />

        {reducedMotion ? null : (
          <video
            ref={videoRef}
            data-hero-video=''
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              status === 'ready' ? 'opacity-100' : 'opacity-0'
            }`}
            src={videoSrc}
            poster={fallbackImage}
            preload='auto'
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            tabIndex={-1}
            aria-hidden='true'
          />
        )}

        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/25 to-navy-950/45' />
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,19,31,0.4)_100%)]' />

        <div
          ref={contentRef}
          className='shell relative z-10 flex w-full flex-col items-center pb-24 pt-36 text-center text-white sm:pb-28 lg:pb-32'
        >
          <span className='animate-fade-up text-champagne-400 [animation-delay:120ms] motion-reduce:animate-none'>
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandName}
                className='h-20 w-20 object-contain sm:h-24 sm:w-24'
              />
            ) : (
              <LogoMark className='h-20 w-20 sm:h-24 sm:w-24' />
            )}
          </span>

          <h1 className='mt-7 max-w-4xl animate-fade-up text-[2.6rem] font-bold leading-[1.15] tracking-tight text-balance text-white sm:text-6xl lg:text-[4.4rem] motion-reduce:animate-none [animation-delay:280ms]'>
            {settings.brandName}
          </h1>

          <div className='mt-7 flex animate-fade-in items-center gap-4 text-[10px] font-medium text-white/65 motion-reduce:animate-none [animation-delay:520ms]'>
            <span className='h-px w-10 bg-champagne-400/70' />
            {settings.brandDescriptor}
            <span className='h-px w-10 bg-champagne-400/70' />
          </div>

          <div className='mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3 motion-reduce:animate-none [animation-delay:640ms]'>
            <ButtonLink to='/buy' variant='champagne'>
              مشاهده املاک خرید
              <ArrowLeftIcon className='h-4 w-4' />
            </ButtonLink>
            <ButtonLink to='/rent' variant='light'>
              املاک اجاره‌ای
            </ButtonLink>
          </div>
        </div>

        <div
          ref={hintRef}
          className={`absolute bottom-7 left-1/2 z-10 -translate-x-1/2 flex-col items-center gap-2 text-white/50 ${
            staticHero ? 'hidden' : 'hidden sm:flex'
          }`}
        >
          <span className='text-[9px]'>اسکرول</span>
          <span className='h-10 w-px bg-gradient-to-b from-champagne-400/70 to-transparent' />
        </div>

        {/* Minimal loading treatment: a single hairline, never a spinner or a black frame. */}
        <div
          aria-hidden='true'
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[2px] overflow-hidden bg-white/10 transition-opacity duration-700 ${
            loading ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className='absolute inset-y-0 w-1/3 animate-hero-loading bg-champagne-400/80' />
        </div>
      </div>
    </section>
  )
}
