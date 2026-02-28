'use client'

import { useState, useEffect } from 'react'

const BOOT_DURATION = 4200 // total ms before fade-out begins

const systemNodes = [
  { id: 'INV', name: 'Inventory', code: 'sys_01', status: 'cataloging engine' },
  { id: 'ANL', name: 'Analytics', code: 'sys_02', status: 'revenue pipeline' },
  { id: 'NET', name: 'Network', code: 'sys_03', status: 'dealer mesh' },
]

const bootLog = [
  'waxed enterprise system v3.0',
  'initializing core modules...',
  'loading inventory database',
  'connecting dealer network',
  'analytics engine online',
  'marketplace sync ready',
  'system check — all nodes nominal',
  '→ portal ready',
]

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)       // 0-7 boot log lines
  const [nodeStates, setNodeStates] = useState([false, false, false])
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Boot log typing — stagger each line
    const lineTimers = bootLog.map((_, i) =>
      setTimeout(() => setPhase(i + 1), 400 + i * 420)
    )

    // Node power-on sequence
    const nodeTimers = systemNodes.map((_, i) =>
      setTimeout(() => setNodeStates(prev => {
        const next = [...prev]
        next[i] = true
        return next
      }), 800 + i * 600)
    )

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100 }
        return prev + 2
      })
    }, 60)

    // Fade out and complete
    const fadeTimer = setTimeout(() => setFadeOut(true), BOOT_DURATION)
    const completeTimer = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, BOOT_DURATION + 600)

    return () => {
      lineTimers.forEach(clearTimeout)
      nodeTimers.forEach(clearTimeout)
      clearInterval(progressInterval)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'var(--color-boot-bg)' }}>

      {/* Animated full-screen gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden boot-gradient-bg">
        <div className="absolute boot-blob boot-blob-1" />
        <div className="absolute boot-blob boot-blob-2" />
        <div className="absolute boot-blob boot-blob-3" />
        <div className="absolute boot-blob boot-blob-4" />
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '512px 512px',
          }} />
      </div>

      <div className="relative w-full max-w-3xl px-6">

        {/* Header — Logo + System Title */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <img src="/waxed-logo.svg" alt="WAXED" className="w-10 h-10" style={{ filter: 'var(--color-boot-logo-filter)' }} />
              <div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
                  waxed
                </h1>
                <p className="text-[9px] font-medium" style={{ color: 'var(--color-boot-accent)', fontFamily: 'var(--font-mono)' }}>
                  enterprise system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex text-[9px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-boot-accent)', color: 'var(--color-boot-bg)' }}>
                ent
              </span>
              <span className="inline-flex text-[9px] font-medium px-2 py-0.5 rounded-full border"
                style={{ borderColor: 'var(--color-boot-text-muted)', color: 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
                v3.0
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-medium" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              code : wxd
            </p>
          </div>
        </div>

        {/* Three System Nodes */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {systemNodes.map((node, i) => (
            <div key={node.id}
              className="relative overflow-hidden rounded-2xl transition-all duration-500 p-5"
              style={{
                border: `1px solid ${nodeStates[i] ? 'var(--color-boot-border-active)' : 'var(--color-boot-border)'}`,
                background: nodeStates[i] ? 'color-mix(in srgb, var(--color-boot-accent) 5%, transparent)' : 'color-mix(in srgb, var(--color-boot-border) 15%, transparent)',
                minHeight: '120px',
              }}>
              {/* Node header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-medium"
                  style={{ color: nodeStates[i] ? 'var(--color-boot-accent)' : 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {node.code}
                </span>
                <span className="inline-block w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: nodeStates[i] ? 'var(--color-boot-positive)' : 'var(--color-boot-text-muted)' }} />
              </div>

              {/* Node name */}
              <h2 className="text-sm font-semibold mb-1 transition-colors duration-500"
                style={{ color: nodeStates[i] ? 'var(--color-boot-text)' : 'var(--color-boot-border)', fontFamily: 'var(--font-mono)' }}>
                {node.name}
              </h2>

              {/* Divider */}
              <div className="mb-2 h-px" style={{
                background: nodeStates[i] ? 'var(--color-boot-border-active)' : 'var(--color-boot-border)',
                opacity: 0.4,
              }} />

              {/* Status text */}
              <p className="text-[9px] transition-colors duration-500"
                style={{ color: nodeStates[i] ? 'var(--color-boot-text)' : 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {nodeStates[i] ? node.status : '—'}
              </p>

              {/* Status label */}
              <div className="absolute bottom-3 right-3">
                <span className="text-[8px] font-medium rounded-full px-2 py-0.5"
                  style={{
                    color: nodeStates[i] ? 'var(--color-boot-bg)' : 'var(--color-boot-text-muted)',
                    background: nodeStates[i] ? 'var(--color-boot-positive)' : 'transparent',
                    border: nodeStates[i] ? 'none' : '1px solid var(--color-boot-border)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                  {nodeStates[i] ? 'online' : 'standby'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Central label */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{ flex: 1, height: '1px', background: 'var(--color-boot-border)' }} />
          <span className="text-[10px] font-medium px-3"
            style={{ color: 'var(--color-boot-accent)', fontFamily: 'var(--font-mono)' }}>
            waxed dealer portal
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-boot-border)' }} />
        </div>

        {/* Progress bar */}
        <div className="mb-5 rounded-full overflow-hidden" style={{ border: '1px solid var(--color-boot-border)', height: '24px', position: 'relative' }}>
          <div className="absolute inset-0 flex items-center px-3 justify-between" style={{ zIndex: 2 }}>
            <span className="text-[9px] font-medium"
              style={{ color: progress > 15 ? 'var(--color-boot-bg)' : 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              initializing
            </span>
            <span className="text-[9px] font-medium"
              style={{ color: progress > 85 ? 'var(--color-boot-bg)' : 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
              {progress}%
            </span>
          </div>
          <div className="h-full transition-all duration-100 ease-linear rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, var(--color-boot-accent), var(--color-boot-border-active))`,
              position: 'relative',
              zIndex: 1,
            }} />
        </div>

        {/* Boot log */}
        <div className="p-4 mb-5 rounded-xl" style={{ border: '1px solid var(--color-boot-border)', background: 'color-mix(in srgb, var(--color-boot-border) 10%, transparent)', minHeight: '140px' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[8px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: 'var(--color-boot-border)', color: 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
              sys
            </span>
            <span className="text-[8px] font-medium"
              style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              boot log
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            {bootLog.slice(0, phase).map((line, i) => (
              <div key={i} className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
                <span className="text-[8px]" style={{ color: 'var(--color-boot-text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[9px]"
                  style={{
                    color: i === phase - 1 && i === bootLog.length - 1 ? 'var(--color-boot-positive)'
                      : i === phase - 1 ? 'var(--color-boot-accent)'
                      : 'var(--color-boot-text)',
                    fontWeight: i === bootLog.length - 1 ? 600 : 400,
                  }}>
                  {line}
                </span>
                {i < phase - 1 && (
                  <span className="text-[8px] font-medium" style={{ color: 'var(--color-boot-positive)' }}>✓</span>
                )}
              </div>
            ))}
            {/* Blinking cursor */}
            {phase < bootLog.length && (
              <span className="inline-block w-1.5 h-3 ml-5 animate-pulse rounded-sm" style={{ background: 'var(--color-boot-accent)' }} />
            )}
          </div>
        </div>

        {/* Bottom status line */}
        <div className="flex items-center justify-between">
          <span className="text-[8px]" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
            wax & groove records
          </span>
          <span className="text-[8px]" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
            enterprise dealer portal
          </span>
        </div>
      </div>
    </div>
  )
}
