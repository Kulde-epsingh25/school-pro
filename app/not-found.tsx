"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"

type ErrorStateProps = {
  code?: string
  title?: string
  message?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function NotFound({
  code = "404",
  title = "Oops !!",
  message = "We searched everywhere, but it didn't come back. Try going home!",
  actionLabel = "Go to home",
  actionHref = "/",
  onAction,
}: ErrorStateProps) {
  const [first, ...rest] = code.split("")
  const last = rest.pop()
  const middle = rest.join("")

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 py-16 text-neutral-100">
      {/* Giant background code + centered mascot */}
      <div className="relative flex w-full max-w-3xl items-center justify-center">
        <span
          aria-hidden="true"
          className="select-none text-[28vw] font-bold leading-none tracking-tighter text-neutral-800/70 sm:text-[20rem]"
        >
          {first}
        </span>

        <div className="relative z-10 mx-[-4vw] flex w-[34vw] max-w-[280px] items-center justify-center sm:mx-[-2rem]">
          {middle ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center text-[10vw] font-bold leading-none tracking-tighter text-neutral-700/60 sm:text-[20rem]"
            >
              {middle}
            </span>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className="select-none text-[28vw] font-bold leading-none tracking-tighter text-neutral-800/70 sm:text-[20rem]"
        >
          {last}
        </span>
      </div>

      <span className="sr-only">{`Error ${code}`}</span>

      {/* Copy */}
      <div className="relative z-10 mt-2 flex flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-neutral-400">{message}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Go back
          </button>

          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="group  inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800"
            >
              <Home className="size-4 transition-transform group-hover:translate-x-0.5" />
              {actionLabel}
            </button>
          ) : (
            <Link
              href={actionHref}
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800"
            >
              
              <Home className="size-4 transition-transform group-hover:translate-x-0.5" />
                {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

export default function NotFoundPage() {
  return <NotFound />
}
