'use client'

import { useState, useEffect } from 'react'

const BOOT_DURATION = 4200 // total ms before fade-out begins

const systemNodes = [
  { id: 'INV', name: 'INVENTORY', code: 'SYS_01', status: 'Cataloging engine' },
  { id: 'ANL', name: 'ANALYTICS', code: 'SYS_02', status: 'Revenue pipeline' },
  { id: 'NET', name: 'NETWORK', code: 'SYS_03', status: 'Dealer mesh' },
]

const bootLog = [
  'WAXED ENTERPRISE SYSTEM v1.0',
  'INITIALIZING CORE MODULES...',
  'LOADING INVENTORY DATABASE',
  'CONNECTING DEALER NETWORK',
  'ANALYTICS ENGINE ONLINE',
  'MARKETPLACE SYNC READY',
  'SYSTEM CHECK — ALL NODES NOMINAL',
  '>> PORTAL READY',
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

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, var(--color-boot-scanline) 3px, var(--color-boot-scanline) 4px)',
      }} />

      {/* Hatch pattern overlay - subtle */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 8px, var(--color-boot-hatch) 8px, var(--color-boot-hatch) 9px)',
      }} />

      <div className="relative w-full max-w-3xl px-6">

        {/* Top hatch bar */}
        <div className="mb-6" style={{
          height: '6px',
          background: 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-boot-accent) 40%, transparent), color-mix(in srgb, var(--color-boot-accent) 40%, transparent) 1px, transparent 1px, transparent 3px)',
        }} />

        {/* Header — Logo + System Title */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <img src="/waxed-logo.svg" alt="WAXED" className="w-10 h-10" style={{ filter: 'var(--color-boot-logo-filter)' }} />
              <div>
                <h1 className="text-xl font-black tracking-[0.2em] uppercase" style={{ color: 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
                  WAXED
                </h1>
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--color-boot-accent)', fontFamily: 'var(--font-mono)' }}>
                  ENTERPRISE SYSTEM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5"
                style={{ background: 'var(--color-boot-accent)', color: 'var(--color-boot-bg)', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                ENT
              </span>
              <span className="inline-flex text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 border"
                style={{ borderColor: 'var(--color-boot-text-muted)', color: 'var(--color-boot-text)', fontFamily: 'var(--font-mono)', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                V1.0
              </span>
              <div style={{ flex: 1, height: '4px', background: 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-boot-accent) 30%, transparent), color-mix(in srgb, var(--color-boot-accent) 30%, transparent) 1px, transparent 1px, transparent 3px)' }} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              CODE : WXD
            </p>
            <p className="text-[8px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              FILE:WAXED_SYS<br />
              PROTOCOL:DEALER<br />
              EX_MODE:ACTIVE<br />
              PRIORITY:AAA
            </p>
          </div>
        </div>

        {/* Three System Nodes — MAGI-style */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {systemNodes.map((node, i) => (
            <div key={node.id}
              className="relative overflow-hidden transition-all duration-500"
              style={{
                border: `2px solid ${nodeStates[i] ? 'var(--color-boot-border-active)' : 'var(--color-boot-border)'}`,
                background: nodeStates[i] ? 'color-mix(in srgb, var(--color-boot-accent) 8%, transparent)' : 'color-mix(in srgb, var(--color-boot-border) 20%, transparent)',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                padding: '16px',
                minHeight: '120px',
              }}>
              {/* Node header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black tracking-[0.2em] uppercase"
                  style={{ color: nodeStates[i] ? 'var(--color-boot-accent)' : 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {node.code}
                </span>
                <span className="inline-block w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: nodeStates[i] ? 'var(--color-boot-positive)' : 'var(--color-boot-text-muted)' }} />
              </div>

              {/* Node name */}
              <h2 className="text-sm font-black tracking-[0.15em] uppercase mb-1 transition-colors duration-500"
                style={{ color: nodeStates[i] ? 'var(--color-boot-text)' : 'var(--color-boot-border)', fontFamily: 'var(--font-mono)' }}>
                {node.name}
              </h2>

              {/* Hatch divider */}
              <div className="mb-2" style={{
                height: '4px',
                background: nodeStates[i]
                  ? 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-boot-accent) 40%, transparent), color-mix(in srgb, var(--color-boot-accent) 40%, transparent) 1px, transparent 1px, transparent 3px)'
                  : 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-boot-border) 30%, transparent), color-mix(in srgb, var(--color-boot-border) 30%, transparent) 1px, transparent 1px, transparent 3px)',
              }} />

              {/* Status text */}
              <p className="text-[9px] tracking-[0.1em] uppercase transition-colors duration-500"
                style={{ color: nodeStates[i] ? 'var(--color-boot-text)' : 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {nodeStates[i] ? node.status : '—'}
              </p>

              {/* Status label */}
              <div className="absolute bottom-3 right-3">
                <span className="text-[8px] font-black tracking-[0.2em] uppercase"
                  style={{
                    color: nodeStates[i] ? 'var(--color-boot-bg)' : 'var(--color-boot-text-muted)',
                    background: nodeStates[i] ? 'var(--color-boot-positive)' : 'transparent',
                    border: nodeStates[i] ? 'none' : '1px solid var(--color-boot-border)',
                    padding: '2px 6px',
                    fontFamily: 'var(--font-mono)',
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 50%, calc(100% - 4px) 100%, 0 100%)',
                    paddingRight: '10px',
                  }}>
                  {nodeStates[i] ? 'ONLINE' : 'STANDBY'}
                </span>
              </div>

              {/* Pulsing scan effect when powering on */}
              {nodeStates[i] && (
                <div className="absolute inset-0 pointer-events-none animate-pulse" style={{
                  background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-boot-accent) 10%, transparent) 0%, transparent 50%)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Central label */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ flex: 1, height: '2px', background: 'var(--color-boot-border)' }} />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase px-3"
            style={{ color: 'var(--color-boot-accent)', fontFamily: 'var(--font-mono)' }}>
            WAXED DEALER PORTAL
          </span>
          <div style={{ flex: 1, height: '2px', background: 'var(--color-boot-border)' }} />
        </div>

        {/* Progress bar */}
        <div className="mb-4" style={{ border: '2px solid var(--color-boot-border)', height: '24px', position: 'relative', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
          <div className="absolute inset-0 flex items-center px-3 justify-between" style={{ zIndex: 2 }}>
            <span className="text-[9px] font-black tracking-[0.15em] uppercase"
              style={{ color: progress > 15 ? 'var(--color-boot-bg)' : 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              INITIALIZING
            </span>
            <span className="text-[9px] font-black tracking-[0.1em]"
              style={{ color: progress > 85 ? 'var(--color-boot-bg)' : 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
              {progress}%
            </span>
          </div>
          <div className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, var(--color-boot-accent), var(--color-boot-border-active))`,
              position: 'relative',
              zIndex: 1,
            }} />
          {/* Scanline on progress bar */}
          <div className="absolute inset-0 pointer-events-none" style={{
            zIndex: 3,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--color-boot-bg) 15%, transparent) 2px, color-mix(in srgb, var(--color-boot-bg) 15%, transparent) 3px)',
          }} />
        </div>

        {/* Boot log */}
        <div className="p-3 mb-4" style={{ border: '1px solid var(--color-boot-border)', background: 'color-mix(in srgb, var(--color-boot-border) 15%, transparent)', minHeight: '140px' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[8px] font-black tracking-[0.2em] uppercase px-1.5 py-0.5"
              style={{ background: 'var(--color-boot-border)', color: 'var(--color-boot-text)', fontFamily: 'var(--font-mono)' }}>
              SYS
            </span>
            <span className="text-[8px] font-black tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
              BOOT LOG
            </span>
            <div style={{ flex: 1, height: '3px', background: 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-boot-border) 30%, transparent), color-mix(in srgb, var(--color-boot-border) 30%, transparent) 1px, transparent 1px, transparent 3px)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            {bootLog.slice(0, phase).map((line, i) => (
              <div key={i} className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
                <span className="text-[8px]" style={{ color: 'var(--color-boot-text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[9px] tracking-[0.05em]"
                  style={{
                    color: i === phase - 1 && i === bootLog.length - 1 ? 'var(--color-boot-positive)'
                      : i === phase - 1 ? 'var(--color-boot-accent)'
                      : 'var(--color-boot-text)',
                    fontWeight: i === bootLog.length - 1 ? 900 : 400,
                  }}>
                  {line}
                </span>
                {i < phase - 1 && (
                  <span className="text-[8px] font-bold" style={{ color: 'var(--color-boot-positive)' }}>✓</span>
                )}
              </div>
            ))}
            {/* Blinking cursor */}
            {phase < bootLog.length && (
              <span className="inline-block w-1.5 h-3 ml-5 animate-pulse" style={{ background: 'var(--color-boot-accent)' }} />
            )}
          </div>
        </div>

        {/* Bottom hatch bar */}
        <div style={{
          height: '6px',
          background: 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-boot-accent) 40%, transparent), color-mix(in srgb, var(--color-boot-accent) 40%, transparent) 1px, transparent 1px, transparent 3px)',
        }} />

        {/* Bottom status line */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
            WAX & GROOVE RECORDS
          </span>
          <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-boot-text-muted)', fontFamily: 'var(--font-mono)' }}>
            ENTERPRISE DEALER PORTAL
          </span>
        </div>
      </div>
    </div>
  )
}
